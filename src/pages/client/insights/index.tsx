import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Spacer,
  Text,
} from "@chakra-ui/react"
import moment from "moment"
import router, { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR from "swr"

import {
  ArchiveCard,
  ClientLayout,
  MarketHighlights,
  Marquee,
  PageContainer,
  SkeletonCard,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import {
  Insights,
  TopBonds,
  TopIndices,
  TopStocks,
} from "~/services/mytfo/clientTypes"
import { formatShortDate } from "~/utils/clientUtils/dateUtility"
import {
  percentTwoDecimalPlace,
  wholeRoundWithAbsolute,
} from "~/utils/clientUtils/globalUtilities"
import {
  openInsightsArticles,
  screenSpentTime,
  timeOpenArticle,
} from "~/utils/googleEventsClient"
import { clientEvent, clientUniEvent } from "~/utils/gtag"

export default function InsightsPage() {
  const router = useRouter()

  const { lang, t } = useTranslation("insights")
  const [isPageLoading, setIsPageLoading] = useState(true)
  const { data: insightsData, error } = useSWR(
    `/api/client/insights/insights-landing-page`,
  )
  const isLoading = !insightsData && !error

  const redirectPage = (path: string) => {
    router.push(path)
  }
  const { user } = useUser()
  useEffect(() => {
    const openTime = moment(new Date())

    return () => {
      moment.locale(lang.includes("en") ? "en" : "ar")
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Insights Landing Page",
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
      title={t("page.index.title")}
      description={t("page.index.description")}
    >
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
            <Box>
              <Box
                aria-label={t("page.index.subheading")}
                role={"heading"}
                as="header"
                fontStyle="normal"
                fontWeight="400"
                fontSize="30px"
                lineHeight="120%"
                color=""
              >
                {t("page.index.heading")}
              </Box>
              <Text
                aria-label={t("page.index.subheading")}
                role={"heading"}
                color="gray.400"
                fontSize="18px"
                mt="8px"
                fontWeight="400"
              >
                {t("page.index.subheading")}
              </Text>

              <Grid
                templateColumns="repeat(7, 1fr)"
                gridGap="1.5rem"
                display={{ lgp: "grid", md: "block" }}
              >
                {insightsData ? (
                  <GridItem gridColumn="span 5 / span 5" w="100%">
                    <Box aria-label="highlightsSlider" role={"slider"}>
                      <MarketHighlights
                        SlideOnScreenDesktop={1}
                        SlideOnScreenMob={1}
                        SlideOnScreenTab={1}
                        Highlights={insightsData.highlights}
                        insideArrowMain="in"
                        Boxpadding="16px 72px"
                        MinHeight="140px"
                      />
                    </Box>
                    <Flex paddingBottom="12px" mt="24px" alignItems="center">
                      <Text
                        color="contrast.200"
                        fontSize="18px"
                        fontWeight="700"
                      >
                        {t("marketSimplified.title")}
                      </Text>
                      <Spacer />
                      <Box
                        aria-label="week"
                        role={"columnheader"}
                        as="p"
                        color="contrast.200"
                        fontSize="14px"
                        fontWeight="400"
                        whiteSpace="nowrap"
                      >
                        {t("marketSimplified.label.week")}{" "}
                        {insightsData?.marketSimplified?.week} -{" "}
                        {formatShortDate(
                          insightsData.marketSimplified.timestamp,
                          lang,
                        )}
                      </Box>
                    </Flex>
                    <Box
                      px={{ base: "5px", md: "24px" }}
                      py="20px"
                      bg="gray.800"
                      borderRadius="10px"
                    >
                      <Text
                        color="contrast.200"
                        fontWeight="700"
                        fontSize="14px"
                      >
                        {t("marketSimplified.label.indices")}
                      </Text>
                      <Grid
                        aria-label={t("marketSimplified.label.indices")}
                        role={"grid"}
                        templateColumns={{
                          lgp: "repeat(3, 1fr)",
                          md: "repeat(3, 1fr)",
                          base: "repeat(2, 1fr)",
                        }}
                        gap={{ xl: "32px", base: "10px" }}
                        py="8px"
                        overflow={{ md: "unset", base: "auto" }}
                      >
                        {insightsData.marketSimplified.topIndices.map(
                          (paste: TopIndices, i: number) => (
                            <GridItem
                              aria-label={paste.indexCode}
                              role={"gridcell"}
                              w="100%"
                              p="8px"
                              borderRadius="6px"
                              bg="gray.850"
                              color="contrast.200"
                              fontSize="14px"
                              key={i}
                            >
                              <Flex aria-label={paste.indexCode} role={"row"}>
                                <Text fontSize="14px" fontWeight="400">
                                  {paste.indexCode}
                                </Text>
                                <Spacer />
                                <Text fontSize="16px" dir="ltr">
                                  {percentTwoDecimalPlace(+paste.indexLevel)}
                                </Text>
                              </Flex>

                              <Flex
                                aria-label={paste.indexName}
                                role={"row"}
                                pt="6px"
                              >
                                {paste.indexName.length <= 10 ? (
                                  <Text style={{ color: "gray.400" }} dir="ltr">
                                    {paste.indexName}
                                  </Text>
                                ) : (
                                  <Box dir="ltr">
                                    <Marquee
                                      color="gray.400"
                                      width="73px"
                                      text={paste.indexName}
                                    />
                                  </Box>
                                )}
                                <Spacer />
                                <Text
                                  fontSize="16px"
                                  display="flex"
                                  alignItems="center"
                                  color={
                                    paste.indexWeekChange.direction == "upwards"
                                      ? "green.500"
                                      : "red.500"
                                  }
                                  dir="ltr"
                                >
                                  {paste.indexWeekChange.direction ==
                                  "upwards" ? (
                                    <TriangleUpIcon
                                      mt="-1px"
                                      me="5px"
                                      h="10px"
                                      w="10px"
                                      color="green.500"
                                    />
                                  ) : (
                                    <TriangleDownIcon
                                      mt="-1px"
                                      me="5px"
                                      h="10px"
                                      w="10px"
                                      color="red.500"
                                    />
                                  )}{" "}
                                  {percentTwoDecimalPlace(
                                    paste.indexWeekChange.percent,
                                  )}
                                  %
                                </Text>
                              </Flex>
                            </GridItem>
                          ),
                        )}
                      </Grid>
                      <Text
                        color="contrast.200"
                        fontWeight="700"
                        fontSize="14px"
                        d={{ lgp: "block", md: "block", base: "block" }}
                        mt="12px"
                      >
                        {t("marketSimplified.label.stocks")}
                      </Text>
                      <Grid
                        aria-label={t("marketSimplified.label.stocks")}
                        role={"grid"}
                        templateColumns={{
                          lgp: "repeat(3, 1fr)",
                          md: "repeat(3, 1fr)",
                          base: "repeat(2, 1fr)",
                        }}
                        gap={{ xl: "32px", base: "10px" }}
                        py="8px"
                        d={{ lgp: "grid", md: "grid", base: "grid" }}
                      >
                        {insightsData.marketSimplified.topStocks.map(
                          (paste: TopStocks, i: number) => (
                            <GridItem
                              aria-label={paste.stockCode}
                              role={"gridcell"}
                              w="100%"
                              p="8px"
                              borderRadius="6px"
                              bg="gray.850"
                              color="contrast.200"
                              fontSize="14px"
                              key={i}
                            >
                              <Flex
                                aria-label={paste.stockCode}
                                role={"row"}
                                alignItems="center"
                              >
                                <Text fontSize="14px">{paste.stockCode}</Text>
                                <Spacer />
                                <Text fontSize="16px" dir="ltr">
                                  ${percentTwoDecimalPlace(paste.stockPrice)}
                                </Text>
                              </Flex>

                              <Flex
                                aria-label={paste.stockCompany}
                                role={"row"}
                                pt="6px"
                              >
                                <Text style={{ color: "gray.400" }} dir="ltr">
                                  {paste.stockCompany}
                                </Text>
                                <Spacer />
                                <Text
                                  fontSize="16px"
                                  display="flex"
                                  alignItems="center"
                                  color={
                                    paste.stockWeekChange.direction == "upwards"
                                      ? "green.500"
                                      : "red.500"
                                  }
                                  dir="ltr"
                                  whiteSpace="nowrap"
                                >
                                  {paste.stockWeekChange.direction ==
                                  "upwards" ? (
                                    <TriangleUpIcon
                                      mt="-1px"
                                      me="5px"
                                      h="10px"
                                      w="10px"
                                      color="green.500"
                                    />
                                  ) : (
                                    <TriangleDownIcon
                                      mt="-1px"
                                      me="5px"
                                      h="10px"
                                      w="10px"
                                      color="red.500"
                                    />
                                  )}{" "}
                                  {percentTwoDecimalPlace(
                                    paste.stockWeekChange.percent,
                                  )}
                                  %
                                </Text>
                              </Flex>
                            </GridItem>
                          ),
                        )}
                        {insightsData.marketSimplified.topBonds.map(
                          (paste: TopBonds, i: number) => (
                            <GridItem
                              aria-label={paste.bondYields}
                              role={"gridcell"}
                              w="100%"
                              p="8px"
                              borderRadius="6px"
                              bg="gray.850"
                              color="contrast.200"
                              fontSize="14px"
                              key={i}
                            >
                              <Flex
                                aria-label={paste.bondYields}
                                role={"row"}
                                alignItems="center"
                              >
                                <Text fontSize="14px">{paste.bondYields}</Text>
                                <Spacer />
                                <Text
                                  fontSize="16px"
                                  display="flex"
                                  alignItems="center"
                                  color={
                                    paste.bondStockWeekChange.direction ==
                                    "upwards"
                                      ? "green.500"
                                      : "red.500"
                                  }
                                  dir="ltr"
                                  whiteSpace="nowrap"
                                >
                                  {paste.bondStockWeekChange.direction ==
                                  "upwards" ? (
                                    <TriangleUpIcon
                                      mt="-1px"
                                      me="5px"
                                      h="10px"
                                      w="10px"
                                      color="green.500"
                                    />
                                  ) : (
                                    <TriangleDownIcon
                                      mt="-1px"
                                      me="5px"
                                      h="10px"
                                      w="10px"
                                      color="red.500"
                                    />
                                  )}{" "}
                                  {percentTwoDecimalPlace(
                                    paste.bondStockWeekChange.percent,
                                  )}
                                  %
                                </Text>
                              </Flex>

                              <Flex
                                aria-label={`${paste.bondMaturity}-years`}
                                pt="6px"
                              >
                                <Text style={{ color: "gray.400" }} dir="ltr">
                                  {paste.bondMaturity}-years
                                </Text>
                                <Spacer />
                                <Text
                                  fontSize="16px"
                                  display="flex"
                                  alignItems="center"
                                  color={
                                    paste.bondWeekChange.direction == "upwards"
                                      ? "green.500"
                                      : "red.500"
                                  }
                                  dir="ltr"
                                  whiteSpace="nowrap"
                                >
                                  {paste.bondWeekChange.direction ==
                                  "upwards" ? (
                                    <TriangleUpIcon
                                      mt="-1px"
                                      me="5px"
                                      h="10px"
                                      w="10px"
                                      color="green.500"
                                    />
                                  ) : (
                                    <TriangleDownIcon
                                      mt="-1px"
                                      me="5px"
                                      h="10px"
                                      w="10px"
                                      color="red.500"
                                    />
                                  )}{" "}
                                  {wholeRoundWithAbsolute(
                                    paste.bondWeekChange.percent,
                                  )}{" "}
                                  bps
                                </Text>
                              </Flex>
                            </GridItem>
                          ),
                        )}
                      </Grid>
                      <Flex
                        justify="center"
                        mt="32px"
                        fontWeight="500"
                        fontSize="12px"
                      >
                        <Text color="#C4C4C4" maxW="500px" textAlign="center">
                          {lang.includes("en")
                            ? insightsData.marketSimplified.message
                            : insightsData.marketSimplified.messageAr}
                        </Text>
                      </Flex>
                    </Box>
                    <Flex
                      justify="center"
                      mt="24px"
                      fontWeight="600"
                      fontSize="14px"
                    >
                      <Button
                        colorScheme="primary"
                        variant="outline"
                        fontSize="14px"
                        fontWeight="600"
                        onClick={() =>
                          redirectPage("/client/insights/markets-simplified")
                        }
                      >
                        {t("button.viewMarketSimplified")}
                      </Button>
                    </Flex>
                  </GridItem>
                ) : (
                  false
                )}
                <GridItem gridColumn="span 2 / span 2">
                  <Box
                    mt={{
                      base: "32px",
                      lgp: lang.includes("en") ? "64px" : "72px",
                    }}
                    ml={{ lgp: "24px", md: "0", base: "0" }}
                  >
                    <InsightsDarstVideosSection />
                    <Flex
                      justify="center"
                      mt="32px"
                      pb={{ base: "35px" }}
                      fontWeight="600"
                      fontSize="14px"
                    >
                      <Button
                        colorScheme="primary"
                        variant="outline"
                        fontSize="14px"
                        fontWeight="600"
                        onClick={() =>
                          redirectPage("/client/insights/markets-archive")
                        }
                      >
                        {t("button.viewMarketArchive")}
                      </Button>
                    </Flex>
                  </Box>
                </GridItem>
              </Grid>
            </Box>
          </Fragment>
        )}
      </PageContainer>
    </ClientLayout>
  )
}

const InsightsDarstVideosSection = () => {
  const { lang, t } = useTranslation("insights")
  const { user } = useUser()
  const { data: insightsDarstVideos, error } = useSWR(
    `/api/client/insights/get-podcast-videos?langCode=${lang}`,
  )

  const isLoading = !insightsDarstVideos && !error
  if (isLoading) {
    return <SkeletonCard flex="1" mb="25px" mt="20px" />
  }

  if (!insightsDarstVideos) {
    return <Fragment />
  }

  const sliceResult = insightsDarstVideos.slice(0, 2)

  const getDescription = (publishDate: string, estimatedDuration: string) => {
    moment.locale("en")
    return `${moment(publishDate).format("MMM DD YYYY")} | ${estimatedDuration}`
  }

  return (
    <Flex
      flexDirection={{ lgp: "column", md: "row", base: "column" }}
      style={{ gap: "22px" }}
    >
      {sliceResult.map((data: Insights, i: number) => (
        <Box
          flex="0 0 auto"
          w={{ base: "100%", md: "50%", lgp: "100%" }}
          m="0"
          key={i}
          onClick={() => {
            clientUniEvent(
              openInsightsArticles,
              data.content.Title + " Insights Landing Page",
              user?.mandateId as string,
              user?.email as string,
            )
            clientEvent(
              timeOpenArticle,
              data.content.Title,
              moment().format("LT"),
              user?.mandateId as string,
              user?.email as string,
            )
            router.push(`/client/insights/markets-archive/podcasts/${data.id}`)
          }}
        >
          <ArchiveCard
            cardImage={data.content.BannerImage.filename}
            tag={t("tag.Podcast")}
            title={data.content.Title}
            showVideoIcon={true}
            description={`${getDescription(
              data.content.PublishDate,
              data.content.EstimatedDuration,
            )}`}
            imageMinHeight="auto"
          />
        </Box>
      ))}
    </Flex>
  )
}

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
