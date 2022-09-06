import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { Box, Flex, Text } from "@chakra-ui/react"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR from "swr"

import {
  ClientLayout,
  MarketHighlights,
  MarketSimplifiedCarousel,
  MarketWatchlist,
  ModalBox,
  PageContainer,
  SkeletonCard,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import { screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

const MarketSimplified = () => {
  const { t } = useTranslation("insights")
  const [isPageLoading, setIsPageLoading] = useState(false)
  const { data: marketSimplified, error } = useSWR(
    `/api/client/insights/markets-simplified`,
  )
  const isLoading = !marketSimplified && !error
  const { user } = useUser()

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Insights Market Simplified Page",
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
    <Fragment>
      <ClientLayout
        title={t("marketSimplified.title")}
        description={t("marketSimplified.title")}
      >
        {!marketSimplified && !isPageLoading && !isLoading ? (
          <ModalBox
            isOpen={true}
            modalDescription={t("common:client.errors.noDate.description")}
            modalTitle={t("common:client.errors.noDate.title")}
            primaryButtonText={t("common:client.errors.noDate.button")}
            onClose={() => {
              router.push("/client/insights")
            }}
            onPrimaryClick={() => {
              router.push("/client/insights")
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
                <Flex justifyContent="space-between">
                  <Box>
                    <Text fontSize="30px" color="contrast.200" fontWeight="400">
                      {t("marketSimplified.title")}:{" "}
                      {t("marketSimplified.label.week")}{" "}
                      {marketSimplified?.topWeeklyResponse?.week}
                    </Text>
                  </Box>
                </Flex>
                <MarketHighlights
                  SlideOnScreenDesktop={2}
                  SlideOnScreenMob={1}
                  SlideOnScreenTab={1}
                  Highlights={marketSimplified?.highlightsResponse.highlights}
                  MinHeight="165px"
                />
                {/* <Categories /> */}
                <MarketSimplifiedCarousel
                  CardCategoriesDataProps={
                    marketSimplified?.cardCategoriesResponse
                  }
                />

                <MarketWatchlist
                  WatchlistData={marketSimplified?.watchlistResponse}
                />
              </Fragment>
            )}
          </PageContainer>
        )}
      </ClientLayout>
    </Fragment>
  )
}
export default MarketSimplified

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
