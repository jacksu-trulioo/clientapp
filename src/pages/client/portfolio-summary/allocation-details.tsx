import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import {
  Box,
  Flex,
  Hide,
  Link,
  ListItem,
  OrderedList,
  Show,
  useDisclosure,
} from "@chakra-ui/react"
import ky from "ky"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR from "swr"

import {
  ChartAssets,
  ClientLayout,
  DownloadButton,
  FeedbackModal,
  InvestmentDealsTable,
  ModalBox,
  PageContainer,
  ResponsiveTable,
  ScrollTop,
  SkeletonCard,
} from "~/components"
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import { FeedbackSubmissionScreen } from "~/services/mytfo/types"
import {
  getFeedbackCookieStatus,
  setFeedbackCookieStatus,
} from "~/utils/clientUtils/feedbackCookieUtilities"
import {
  percentTwoDecimalPlace,
  roundCurrencyValue,
} from "~/utils/clientUtils/globalUtilities"
import { downloadBlob } from "~/utils/downloadBlob"
import { downloadedExcel, screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type AllocationData = {
  allocationChartData: []
  assetTableData: AssetTableDataType[]
}

type AssetTableDataType = {
  data: [
    {
      id: number
      name: string
      investmentVehicle: string
      initialInvestmentDate: string
      bookValue: number
      marketValue: number
      performance: {
        percent: number
      }
    },
  ]
  type: string
  color: string
}

type AllocatioSectionProps = {
  deals: AllocationData
}

const AllocationDetails = () => {
  const { t, lang } = useTranslation("allocationDetails")
  const { user } = useUser()
  const [isPageLoading, setIsPageLoading] = useState(true)

  const scrollToTop = () => {
    const input = document.getElementById("scrollTop")
    const element: HTMLElement = input!

    element.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const { data: deals, error } = useSWR<AllocationData>(
    `/api/client/deals/portfolio-summary-allocation?langCode=${lang}&type=INVESTMENT`,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  )

  const isLoading = !deals && !error

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Allocation Details",
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
  return (
    <ClientLayout title={t("page.title")} description={t("page.description")}>
      {error && !isPageLoading && !isLoading ? (
        <ModalBox
          isOpen={error}
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
        <Fragment>
          {" "}
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
                <Box
                  justifyContent="space-between"
                  mb={{ lgp: "30px", md: "24px", base: "24px" }}
                  d={{ lgp: "flex", md: "block", base: "block" }}
                  alignItems={{ lgp: "center" }}
                >
                  <Box w="100%" mb={{ lgp: "0", md: "18px", base: "18px" }}>
                    <Box
                      as="nav"
                      fontStyle="normal"
                      mb="0"
                      fontSize="12px"
                      fontWeight="400"
                      d={{ base: "none", md: "block", lgp: "block" }}
                    >
                      <OrderedList m="8px 0">
                        <ListItem display="inline-flex" alignItems="center">
                          {" "}
                        </ListItem>
                        <ListItem display="inline-flex" alignItems="center">
                          <Link
                            onClick={() =>
                              router.push("/client/portfolio-summary")
                            }
                            color="primary.500"
                          >
                            {t("breadcrumb.parent")}
                          </Link>
                          <Box as="span" marginInline="0.5rem">
                            /
                          </Box>
                        </ListItem>
                        <ListItem
                          display="inline-flex"
                          alignItems="center"
                          _hover={{ textDecoration: "underline" }}
                        >
                          {t("heading")}
                        </ListItem>
                      </OrderedList>
                    </Box>
                    <Box
                      as="h4"
                      color="contrast.200"
                      fontWeight="400"
                      fontSize="30px"
                      mb="8px"
                    >
                      {t("heading")}
                    </Box>
                    <Box
                      as="h4"
                      color="gray.400"
                      fontWeight="400"
                      lineHeight="24px"
                      fontSize="18px"
                    >
                      {t("description")}
                    </Box>
                  </Box>
                </Box>
                {deals ? <AllocationSection deals={deals} /> : false}

                <Box
                  position="fixed"
                  right="3%"
                  bottom="2%"
                  zIndex="docked"
                  cursor="pointer"
                  onClick={scrollToTop}
                >
                  <ScrollTop />
                </Box>
              </Fragment>
            )}
          </PageContainer>
        </Fragment>
      )}
    </ClientLayout>
  )
}

const AllocationSection = ({ deals }: AllocatioSectionProps) => {
  return (
    <AllocationChartAndTableSection
      allocationChartData={deals?.allocationChartData || []}
      assetTableData={deals?.assetTableData}
    />
  )
}

const AllocationChartAndTableSection = ({ assetTableData }: AllocationData) => {
  const { user } = useUser()
  const { t, lang } = useTranslation("portfolioSummary")
  const [allocationData, setAllocationData] = useState<AssetTableDataType[]>([])
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()

  useEffect(() => {
    setAllocationData(assetTableData)
  }, [assetTableData])

  const downloadTableDataInExcel = async () => {
    let response = await ky.post("/api/client/generate-excel-file", {
      json: {
        type: "portfolioSummary",
        headerType: "INVESTMENT",
      },
    })
    let fileData = await response.blob()
    let fileName = `${user?.mandateId}-Allocation-Details`
    downloadBlob(window.URL.createObjectURL(fileData), fileName)
    clientEvent(
      downloadedExcel,
      "Allocation Details",
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
    <Fragment>
      <Box>
        {allocationData ? (
          <Box>
            <Hide below="lgp">
              <Flex mb="26px" justifyContent="flex-end">
                <DownloadButton onDownloadClick={downloadTableDataInExcel} />
              </Flex>
              <Box border="1px solid" borderColor="gray.800" borderRadius="8px">
                {allocationData?.map(({ data, type, color }, i) => (
                  <InvestmentDealsTable
                    key={i}
                    isHeaderLegend
                    tableBodyData={[
                      {
                        labelColor: color,
                        bodyData: data,
                        header: t(`common:client.assetClasses.${type}`),
                        headerSize: 20,
                        style: {
                          textAlign: "center",
                        },
                      },
                    ]}
                    isHeader={i == 0 ? true : false}
                    isRowNotClickable={true}
                    tableGridSize={20}
                    tableHeader={[
                      {
                        headerSize: 1,
                        name: t(
                          "portfolioAllocation.table.tableHeader.assetClass",
                        ),
                        style: {},
                        textAlign: "start",
                        colspan: 3,
                      },
                      {
                        headerSize: 1,
                        name: t(
                          "portfolioAllocation.table.tableHeader.dealName",
                        ),
                        style: {},
                        textAlign: "start",
                        colspan: 3,
                      },
                      {
                        headerSize: 1,
                        name: t("portfolioAllocation.table.tableHeader.spv"),
                        style: {},
                        textAlign: "start",
                        colspan: 2,
                      },
                      {
                        headerSize: 1,
                        name: t(
                          "portfolioAllocation.table.tableHeader.investmentDate",
                        ),
                        style: {},
                        textAlign: lang.includes("en") ? "right" : "left",
                        colspan: 3,
                      },
                      {
                        headerSize: 1,
                        name: t(
                          "portfolioAllocation.table.tableHeader.investmentAmount",
                        ),
                        style: {},
                        textAlign: lang.includes("en") ? "right" : "left",
                        colspan: 3,
                      },
                      {
                        headerSize: 1,
                        name: t(
                          "portfolioAllocation.table.tableHeader.marketValue",
                        ),
                        style: {},
                        textAlign: lang.includes("en") ? "right" : "left",
                        colspan: 3,
                      },
                      {
                        headerSize: 2,
                        name: t(
                          "portfolioAllocation.table.tableHeader.performanceContribution",
                        ),
                        style: {},
                        textAlign: "right",
                        colspan: 3,
                      },
                    ]}
                  />
                ))}
              </Box>
            </Hide>
            <Show below="lgp">
              {allocationData?.map(({ data, type, color }, i) => (
                <Fragment key={i}>
                  <Box mt="24px" mb="12px">
                    <ChartAssets
                      color={color || ""}
                      text={t(`common:client.assetClasses.${type}`)}
                    />
                  </Box>
                  {data.map(
                    (
                      {
                        name,
                        initialInvestmentDate,
                        investmentVehicle,
                        bookValue,
                        marketValue,
                        performance,
                      },
                      j,
                    ) => (
                      <ResponsiveTable
                        key={j}
                        header={name}
                        isHeader
                        tableItem={[
                          {
                            key: t("portfolioAllocation.table.tableHeader.spv"),
                            value: investmentVehicle,
                          },
                          {
                            key: t(
                              "portfolioAllocation.table.tableHeader.investmentDate",
                            ),
                            value: moment(initialInvestmentDate).format(
                              "DD/MM/YYYY",
                            ),
                          },
                          {
                            key: t(
                              "portfolioAllocation.table.tableHeader.investmentAmount",
                            ),
                            value: `$${roundCurrencyValue(bookValue)}`,
                          },

                          {
                            key: t(
                              "portfolioAllocation.table.tableHeader.marketValue",
                            ),
                            value: `$${roundCurrencyValue(marketValue) || 0}`,
                          },
                          {
                            key: t(
                              "portfolioAllocation.table.tableHeader.performanceContribution",
                            ),
                            value: `${percentTwoDecimalPlace(
                              performance?.percent,
                            )} %`,
                          },
                        ]}
                      />
                    ),
                  )}
                </Fragment>
              ))}
            </Show>
          </Box>
        ) : (
          false
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
      </Box>
    </Fragment>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const sesison = getSession(ctx.req, ctx.res)
    if (sesison?.mandateId) {
      return {
        props: {
          mandate: sesison?.mandateId,
        },
      }
    }
    return {
      notFound: true,
    }
  },
})
export default AllocationDetails
