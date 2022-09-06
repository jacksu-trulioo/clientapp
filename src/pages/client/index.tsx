import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { useBreakpointValue } from "@chakra-ui/media-query"
import { Box } from "@chakra-ui/react"
import moment from "moment"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR from "swr"

import {
  Card,
  CardContent,
  ClientLayout,
  InsightsList,
  MeetingBox,
  OpportunityCard,
  PageContainer,
  PerformanceChart,
  PerformanceMetrics,
  PolygonDownIcon,
  PolygonIcon,
  PortfolioActivity,
  SkeletonCard,
  SkeletonOpportunityCard,
} from "~/components"
import siteConfig from "~/config/siteConfig"
import { useUser } from "~/hooks/useUser"
import { MyTfoClient } from "~/services/mytfo"
import { formatDate } from "~/utils/clientUtils/dateUtility"
import { percentTwoDecimalPlace } from "~/utils/clientUtils/globalUtilities"
import { screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type DashboardProps = {
  mandate: string
}

const ClientDashboard = ({ mandate }: DashboardProps) => {
  const { t } = useTranslation("clientDashboard")
  const { user } = useUser()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const { data: profile, error } = useSWR(`/api/client/account/profile`)
  const { data: lastValuationDate } = useSWR(
    `/api/client/get-last-valuation-date`,
  )
  const isLoading = !profile && !error

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Dashboard",
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
    <ClientLayout
      title={t("page.title")}
      description={t("page.description")}
      footerRequired={false}
    >
      <PageContainer
        isLoading={isPageLoading}
        as="section"
        maxW="full"
        px="0"
        mt={{ base: 8, md: 0, lgp: 0 }}
        filter={isPageLoading ? "blur(3px)" : "none"}
      >
        {isLoading ? (
          <Fragment>
            <SkeletonCard mt="20px" flex={1} mb={"15px"} />
          </Fragment>
        ) : (
          <Fragment>
            <MeetingBox manager={profile?.manager} mandateId={mandate} />
            <PerformanceMetricsSection />
            {lastValuationDate?.lastValuationDate ? (
              <PerformanceChartSection
                lastValuationDate={lastValuationDate?.lastValuationDate}
              />
            ) : (
              false
            )}
            {siteConfig.featureFlags.clientPortfolioActivityEnabled ? (
              <PortfolioActivity />
            ) : (
              false
            )}
            <OpportunitySection />
            <InsightsListSection />
          </Fragment>
        )}
      </PageContainer>
    </ClientLayout>
  )
}

const OpportunitySection = () => {
  const { lang } = useTranslation("opportunities")

  const isLessThan1280 = useBreakpointValue({
    base: false,
    md: false,
    lgp: false,
    "2xl": true,
    xl: true,
  })

  const valueCount = isLessThan1280 ? 3 : 2

  const { data: opportunities, error } = useSWR(
    `/api/client/deals/client-opportunities?count=${valueCount}&langCode=${lang}`,
  )
  const isLoading = !opportunities && !error
  if (isLoading) {
    return <SkeletonOpportunityCard mt="20px" flex="1" mb="12px" />
  }

  if (!opportunities?.length) {
    return <Fragment />
  }

  return (
    <OpportunityCard
      opportunities={opportunities}
      showHeading={true}
      showAll={true}
    />
  )
}

const InsightsListSection = () => {
  const { lang } = useTranslation("clientDashboard")
  const largeDesktopView = useBreakpointValue({
    base: false,
    md: false,
    lgp: false,
    "2xl": true,
    xl: true,
  })
  const valueCount = largeDesktopView ? 3 : 2
  const { data, error } = useSWR(
    `/api/client/insights/get-podcast-videos?langCode=${lang}&count=${valueCount}`,
  )
  const isLoading = !data && !error
  if (isLoading) {
    return <SkeletonCard mt="20px" flex="1" mb="12px" />
  }
  if (!data) {
    return <Fragment />
  }
  return <InsightsList insights={data} />
}

const PerformanceMetricsSection = () => {
  const { data: metricsData, error } = useSWR(
    `/api/client/account/dashboard-performance-metrics`,
  )
  const isLoading = !metricsData && !error
  if (isLoading) {
    return <SkeletonCard mt="20px" flex="1" mb="12px" />
  }

  if (!metricsData) {
    return <Fragment />
  } else {
    return <PerformanceMetrics metricsData={metricsData} />
  }
}

type PerformanceChartSectionProps = {
  lastValuationDate: string
}

const PerformanceChartSection = ({
  lastValuationDate,
}: PerformanceChartSectionProps) => {
  const { lang, t } = useTranslation("clientDashboard")

  const { data: performanceJSON, error } = useSWR(
    `/api/client/performance/dashboard-performance-chart?langCode=${lang}`,
  )
  const isLoading = !performanceJSON && !error
  if (isLoading) {
    return <SkeletonCard mt="20px" flex="1" mb="12px" />
  }

  if (!performanceJSON) {
    return <Fragment />
  } else {
    return (
      <Card
        bg="linear-gradient(270deg, var(--chakra-colors-gray-900) 16.67%, var(--chakra-colors-gray-800) 50.52%, var(--chakra-colors-gray-900) 81.77%)"
        p={{ base: "15px", md: "5" }}
        mb={{ base: "40px", xl: "80px" }}
      >
        {" "}
        <Box pt="5">
          <Box
            as="header"
            aria-label="Valuation date"
            role={"heading"}
            fontWeight="400"
            fontSize="18px"
            color="#fff"
            d={{ md: "flex", base: "block" }}
            alignItems={{ base: "flex-start", sm: "center" }}
          >
            <Box>{t("portfolio.performanceData.title")}</Box>
            <Box
              fontWeight="400"
              fontSize="14px"
              color="#b99855"
              marginLeft={{ md: "8px", base: "0" }}
              textAlign={{ md: "center", base: "start" }}
              mt={{ md: "0", base: "4px" }}
            >
              {t("portfolio.performanceData.asOf")}{" "}
              {formatDate(lastValuationDate, lang)}
            </Box>
          </Box>
          <Box
            fontSize="30px"
            margin="24px 0"
            alignItems="center"
            display="-webkit-flex"
            fontWeight="400"
            style={{
              flexDirection: lang.includes("ar") ? "row-reverse" : "revert",
              justifyContent: lang.includes("ar") ? "flex-end" : "flex-start",
              color:
                performanceJSON?.netChangePercent?.direction == "downwards"
                  ? "rgb(199, 61, 61)"
                  : "#B5E361",
            }}
          >
            {performanceJSON?.netChangePercent?.direction == "downwards" ? (
              <PolygonDownIcon width={5} height={30} />
            ) : (
              <PolygonIcon width={5} height={30} />
            )}

            <Box
              style={{
                marginLeft: "8px",
              }}
            >
              {percentTwoDecimalPlace(
                performanceJSON?.netChangePercent?.percent,
              )}
              %
            </Box>
          </Box>

          <Box
            fontSize="14px"
            margin="10px 0"
            alignItems="center"
            display="-webkit-flex"
            color="gray.400"
            fontWeight="400"
          >
            <Box
              height="16px"
              width="16px"
              backgroundColor="#ffffff"
              borderRadius="50%"
              mr="8px"
            ></Box>
            {t("portfolio.performanceData.cumulativePerformance")}
          </Box>
          <Box
            fontSize="14px"
            margin="10px 0"
            alignItems="center"
            display="-webkit-flex"
            color="#aaa"
            fontWeight="400"
          >
            <Box
              height="16px"
              width="16px"
              backgroundColor="rgb(191, 197, 244)"
              borderRadius="50%"
              mr="8px"
            ></Box>
            {t("portfolio.performanceData.periodPerformance")}
          </Box>
        </Box>
        <CardContent p="0">
          <Box h="full" zIndex="1">
            <PerformanceChart
              chartData={{
                months: performanceJSON.timeLine,
                cumulativeData: performanceJSON.cumulativeData,
                periodicData: performanceJSON.periodicData,
                minMaxValue: performanceJSON.minMax,
              }}
            />
          </Box>
        </CardContent>
      </Card>
    )
  }
}

export default ClientDashboard

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const session = getSession(ctx.req, ctx.res)
    const client = new MyTfoClient(ctx.req, ctx.res, {
      authRequired: true,
      msType: "maverick",
    })

    if (!session?.mandateId) {
      const mandates = await client.clientAccount.mandateAuthenticator()

      mandates.sort((a, b) => {
        return Number(a?.mandateId) - Number(b?.mandateId)
      })

      if (session) {
        session.mandateId = mandates[0].mandateId
      }
    }

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
