import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { useDisclosure } from "@chakra-ui/react"
import ky from "ky"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR from "swr"

import {
  ClientLayout,
  FeedbackModal,
  ModalBox,
  PageContainer,
  ProfitAndLoss,
  SkeletonCard,
} from "~/components"
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import { FeedbackSubmissionScreen } from "~/services/mytfo/types"
import {
  getFeedbackCookieStatus,
  setFeedbackCookieStatus,
} from "~/utils/clientUtils/feedbackCookieUtilities"
import { downloadBlob } from "~/utils/downloadBlob"
import { downloadedExcel, screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

const ProfitAndLossPage = () => {
  const { t } = useTranslation("profitAndLoss")
  const [isPageLoading, setIsPageLoading] = useState(true)
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()

  const { data: profitAndLoss, error: profitLossError } = useSWR(
    `/api/client/profitloss/profit-loss-details`,
  )

  const { data: lastValuationDate } = useSWR(
    `/api/client/get-last-valuation-date`,
  )

  const isLoading = !profitAndLoss && !profitLossError
  const { user } = useUser()

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Profit and Loss",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  useEffect(() => {
    if (isLoading) {
      setIsPageLoading(true)
    } else {
      setIsPageLoading(false)
    }
  }, [isLoading])

  const downloadTableDataInExcel = async (quarter: string) => {
    let response = await ky.post("/api/client/generate-excel-file", {
      json: {
        type: "profitAndLoss",
        quarter: quarter,
      },
    })
    let fileData = await response.blob()
    let fileName = `${user?.mandateId}-Profit-and-Loss`
    downloadBlob(window.URL.createObjectURL(fileData), fileName)
    clientEvent(
      downloadedExcel,
      "Profit and Loss",
      fileName,
      user?.mandateId as string,
      user?.email as string,
    )
    if (
      getFeedbackCookieStatus(siteConfig.clientFeedbackSessionVariableName) ==
      "true"
    ) {
      setTimeout(() => {
        onFeedbackModalOpen()
      }, 500)
    }
  }

  return (
    <ClientLayout title={t("page.title")} description={t("page.description")}>
      {(!profitAndLoss || !lastValuationDate) &&
      !isLoading &&
      !isPageLoading ? (
        <ModalBox
          isOpen={true}
          modalDescription={t("common:client.errors.noDate.description")}
          modalTitle={t("common:client.errors.noDate.title")}
          primaryButtonText={t("common:client.errors.noDate.button")}
          onClose={() => {
            router.push("/client/portfolio-summary")
          }}
          onPrimaryClick={() => {
            router.push("/client/portfolio-summary")
          }}
        />
      ) : (
        <PageContainer
          isLoading={isPageLoading}
          as="section"
          maxW="full"
          px="0"
          mt={{ base: 8, md: 8, lgp: 0 }}
          filter={isPageLoading ? "blur(3px)" : "none"}
        >
          {isLoading ? (
            <SkeletonCard flex="1" mb="25px" mt="20px" />
          ) : (
            <Fragment>
              {profitAndLoss && lastValuationDate ? (
                <ProfitAndLoss
                  lastValuationDate={lastValuationDate}
                  profitAndLossData={profitAndLoss}
                  downloadTableDataInExcel={downloadTableDataInExcel}
                />
              ) : (
                false
              )}
            </Fragment>
          )}
          <FeedbackModal
            hideReferalOption={true}
            isOpen={isFeedbackModalOpen}
            onClose={() => {
              onFeedbackModalClose()
              setFeedbackCookieStatus(
                siteConfig.clientFeedbackSessionVariableName,
                false,
                siteConfig.clientFeedbackSessionExpireDays,
              )
            }}
            submissionScreen={FeedbackSubmissionScreen.ClientDownloadTableData}
          />
        </PageContainer>
      )}
    </ClientLayout>
  )
}

export default ProfitAndLossPage

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const sesison = getSession(ctx.req, ctx.res)
    if (sesison?.mandateId) {
      return {
        props: {}, // will be passed to the page component as props
      }
    }
    return {
      notFound: true,
    }
  },
})
