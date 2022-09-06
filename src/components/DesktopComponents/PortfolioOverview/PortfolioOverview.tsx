import { useBreakpointValue } from "@chakra-ui/media-query"
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Hide,
  Text,
} from "@chakra-ui/react"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { CaretRightIcon, PolygonDownIcon, PolygonIcon } from "~/components"
import HighChartsBarChart from "~/components/Chart/highChartsBarChart"
import HighChartsLineChart from "~/components/Chart/highChartsLineChart"
import {
  percentTwoDecimalPlace,
  roundCurrencyValue,
} from "~/utils/clientUtils/globalUtilities"

import PortMapIcon from "../../Icon/PortfolioMapIcon"
import MarketIndicatorsChart from "./MarketIndicatorsChart"

type PortfolioOverviewProps = {
  viewOverViewTitle: string
  getLastMonth: string[]
  portfolioOverviewDetails: {
    lastFourQuarters: []
    commitmentChartValues: Array<number>
    cashflowChartValues: []
    cashflowChartValuesCapitalCall: []
    cashFlowProjections: number
    commitments: number
    profitLossChartValues: []
    profitLoss: {
      money: number
      direction: string
    }
    itdGrowth: {
      percent: number
      direction: string
    }
    annualizedGrowth: {
      percent: number
      direction: string
    }
    ytdGrowth: {
      percent: number
      direction: string
    }
    performanceChartValues: []
    deals: number | string
    marketSpectrumData: {
      trackerLength: number
      start: {
        value: number
        date: string
      }
      end: {
        value: number
        date: string
      }
    }
  }
}

export default function PortfolioOverview({
  portfolioOverviewDetails,
  getLastMonth,
}: PortfolioOverviewProps) {
  const { t, lang } = useTranslation("portfolioSummary")
  const largeDesktopView = useBreakpointValue({
    base: false,
    md: false,
    lgp: true,
    "2xl": true,
    xl: true,
  })

  const goToDetailPage = (path: string) => {
    router.push(`/client/${path}`)
  }

  return (
    <Box>
      <Flex
        flexDir={{ base: "column", md: "row" }}
        alignItems={{ base: "self-start", md: "center" }}
        mb="48px"
        mt="40px"
      >
        <Heading
          fontSize="18px"
          fontWeight="700"
          color="white"
          mr="32px"
          mb={{ base: "38px", md: 0 }}
        >
          {t("portfolioOverview.title")}
        </Heading>
        <Flex alignItems="center">
          <Text
            pos="relative"
            _after={{
              content: '""',
              position: "absolute",
              top: "50%",
              height: "16px",
              width: "16px",
              borderRadius: "full",
              insetStart: lang == "ar" ? "inherit " : "0",
              insetEnd: lang == "ar" ? "0" : "inherit",
              backgroundColor: "#aed1da",
              transform: "translateY(-50%)",
            }}
            pl="25px"
            fontSize="14px"
          >
            {t("portfolioOverview.label.capitalCall")}
          </Text>
          <Text
            pos="relative"
            _after={{
              content: '""',
              position: "absolute",
              top: "50%",
              height: "16px",
              width: "16px",
              borderRadius: "full",
              insetStart: lang == "ar" ? "inherit " : "0",
              insetEnd: lang == "ar" ? "0 " : "inherit",
              backgroundColor: "#b4985f",
              transform: "translateY(-50%)",
            }}
            pl="25px"
            fontSize="14px"
            ml="18px"
          >
            {t("portfolioOverview.label.distributions")}
          </Text>
        </Flex>
      </Flex>
      <Box>
        <Flex flexWrap="wrap" mb={{ lg: "72px", md: "72px", base: "0" }}>
          <Box
            h={{ base: "auto", md: "300px" }}
            onClick={() => {
              if (!largeDesktopView) {
                goToDetailPage("/cash-flows")
              }
            }}
            flex="0 0 auto"
            w={{ base: "100%", md: "50%" }}
            maxW={{ base: "100%", md: "50%" }}
            pos="relative"
            _after={{
              content: '""',
              display: { base: "none", md: "block" },
              position: "absolute",
              width: "1px",
              top: "0",
              bottom: "15px",
              right: "0",
              backgroundColor: "#4d4d4d",
            }}
            _before={{
              content: '""',
              position: "absolute",
              height: "1px",
              left: "0",
              bottom: "0",
              right: { base: "0", md: "15px" },
              backgroundColor: "#4d4d4d",
            }}
          >
            <Box p={{ base: "30px 0 30px 0", md: "24px 24px 24px 0" }}>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                mb="20px"
              >
                <Heading
                  fontSize={{ base: "14px", md: "14px", lgp: "14px" }}
                  fontWeight="700"
                  color="white"
                  borderBottom={{ base: "1px solid white", lgp: "none" }}
                >
                  {t("portfolioOverview.label.cashFlows")}
                </Heading>
                <Hide below="lgp">
                  <Box
                    as="span"
                    color="primary.500"
                    fontSize="14px"
                    fontWeight="400"
                    whiteSpace="nowrap"
                    textDecor="underline"
                    cursor="pointer"
                    onClick={() => {
                      goToDetailPage("/cash-flows")
                    }}
                  >
                    {t("common:button.viewDetails")}{" "}
                    <CaretRightIcon
                      h="20px"
                      color="primary.500"
                      w="20px"
                      transform={lang == "ar" ? "rotate(-180deg)" : "initial"}
                      transformOrigin="center"
                      position="relative"
                      top="-1px"
                    />
                  </Box>
                </Hide>
              </Flex>

              <Box w="100%">
                <HighChartsBarChart
                  chartHeight={150}
                  series={[
                    {
                      name: "Capital Call",
                      data: portfolioOverviewDetails.cashflowChartValuesCapitalCall,
                      showInLegend: false,
                    },
                    {
                      name: "Distribution",
                      data: portfolioOverviewDetails.cashflowChartValues,
                      showInLegend: false,
                    },
                  ]}
                  colors={["#AED1DA", "#B4985F"]}
                  categories={portfolioOverviewDetails.lastFourQuarters}
                />
              </Box>
              <Flex
                justifyContent="center"
                alignItems="center"
                direction={lang === "ar" ? "row-reverse" : "row"}
                color="contrast.200"
                fontSize="36px"
              >
                <Box
                  fontWeight="100"
                  mr={lang.includes("en") ? "8px" : "0"}
                  ml={lang.includes("ar") ? "8px" : "0"}
                >
                  {portfolioOverviewDetails.cashFlowProjections > 0
                    ? "+"
                    : portfolioOverviewDetails.cashFlowProjections < 0
                    ? "-"
                    : false}
                </Box>
                <Box fontWeight="100">$</Box>
                <Box fontSize="36px" fontWeight="400">
                  {roundCurrencyValue(
                    Math.abs(portfolioOverviewDetails.cashFlowProjections),
                  )}
                </Box>
              </Flex>
            </Box>
          </Box>
          <Box
            h={{ base: "auto", md: "300px" }}
            onClick={() => {
              if (!largeDesktopView) {
                goToDetailPage("/performance")
              }
            }}
            flex="0 0 auto"
            w={{ base: "100%", md: "50%" }}
            maxW={{ base: "100%", md: "50%" }}
            pos="relative"
            _after={{
              content: '""',
              position: "absolute",
              height: "1px",
              insetStart: "0",
              bottom: "0",
              left: { base: "0", md: "15px" },
              right: "0",
              backgroundColor: "#4d4d4d",
            }}
          >
            <Box p={{ base: "30px 0 30px 0", md: "24px 0 24px 24px" }}>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                mb="20px"
              >
                <Heading
                  fontSize={{ base: "14px", md: "14px", lgp: "14px" }}
                  fontWeight="700"
                  color="white"
                  borderBottom={{ base: "1px solid white", lgp: "none" }}
                >
                  {t("portfolioOverview.label.performance")}
                </Heading>
                <Hide below="lgp">
                  <Box
                    as="span"
                    color="primary.500"
                    fontSize="14px"
                    fontWeight="400"
                    whiteSpace="nowrap"
                    textDecor="underline"
                    cursor="pointer"
                    onClick={() => {
                      goToDetailPage("/performance")
                    }}
                  >
                    {t("common:button.viewDetails")}{" "}
                    <CaretRightIcon
                      h="20px"
                      color="primary.500"
                      w="20px"
                      transform={lang == "ar" ? "rotate(-180deg)" : "initial"}
                      transformOrigin="center"
                      position="relative"
                      top="-1px"
                    />
                  </Box>
                </Hide>
              </Flex>

              <Box mb="10px" mt="50px" w="100%">
                <HighChartsBarChart
                  showYAxis={false}
                  chartHeight={125}
                  series={[
                    {
                      name: "Performance",
                      data: portfolioOverviewDetails.performanceChartValues,
                      showInLegend: false,
                    },
                  ]}
                  colors={["#C0C5F0"]}
                  categories={portfolioOverviewDetails.lastFourQuarters}
                />
              </Box>
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  md: "repeat(3, 1fr)",
                }}
                gap={2}
                m={{ base: "0 auto", md: "0 0 0 25px" }}
                maxW={{ base: "500px", lgp: "initial", xl: "initial" }}
              >
                <GridItem textAlign={{ base: "center", md: "inherit" }}>
                  <Flex
                    flexDir="column"
                    d={{ base: "inline-block", md: "inherit" }}
                    textAlign={{ base: "left", md: "inherit" }}
                    minW={{ base: "120px", md: "inherit" }}
                    ml={{ base: "30px", md: "0" }}
                  >
                    <Text
                      fontSize={{ base: "14px", md: "11px", lgp: "14px" }}
                      fontWeight="400"
                      color="gray.500"
                      ml={{
                        base: lang === "ar" ? "0" : "19px",
                        md: lang === "ar" ? "0" : "24px",
                      }}
                      whiteSpace="nowrap"
                      textAlign="start"
                    >
                      {t("common:client.YTD")}
                    </Text>
                    <Flex
                      alignItems="center"
                      justifyContent={lang === "ar" ? "flex-end" : ""}
                      dir="ltr"
                    >
                      {portfolioOverviewDetails?.ytdGrowth.direction ==
                      "downwards" ? (
                        <PolygonDownIcon
                          width={{ base: "14px", md: "18px", lgp: "20px" }}
                          height="auto"
                          mr={lang.includes("en") ? "4px" : "0"}
                          ml={lang.includes("ar") ? "4px" : "0"}
                        />
                      ) : (
                        <PolygonIcon
                          width={{ base: "14px", md: "18px", lgp: "20px" }}
                          height="auto"
                          mr={lang.includes("en") ? "4px" : "0"}
                          ml={lang.includes("ar") ? "4px" : "0"}
                        />
                      )}
                      <Heading
                        fontSize={{ lgp: "26px", md: "26px", base: "26px" }}
                        fontWeight="300"
                        color={
                          portfolioOverviewDetails?.ytdGrowth.direction ===
                          "downwards"
                            ? "red.500"
                            : "green.500"
                        }
                      >
                        {percentTwoDecimalPlace(
                          portfolioOverviewDetails?.ytdGrowth.percent,
                        )}
                        %
                      </Heading>
                    </Flex>
                  </Flex>
                </GridItem>
                <GridItem
                  textAlign={{ base: "center", md: "inherit" }}
                  pt={{ base: "15px", md: "0" }}
                >
                  <Flex
                    flexDir="column"
                    d={{ base: "inline-block", md: "inherit" }}
                    textAlign={{ base: "left", md: "inherit" }}
                    minW={{ base: "120px", md: "inherit" }}
                    ml={{ base: "30px", md: "0" }}
                  >
                    <Text
                      fontSize={{ base: "14px", md: "11px", lgp: "14px" }}
                      fontWeight="400"
                      color="gray.500"
                      ml={{
                        base: lang === "ar" ? "0" : "19px",
                        md: lang === "ar" ? "0" : "24px",
                      }}
                      whiteSpace="nowrap"
                      textAlign="start"
                    >
                      {t("common:client.ITD")}
                    </Text>
                    <Flex
                      alignItems="center"
                      justifyContent={lang === "ar" ? "flex-end" : ""}
                      dir="ltr"
                    >
                      {portfolioOverviewDetails?.itdGrowth.direction ==
                      "downwards" ? (
                        <PolygonDownIcon
                          width={{ base: "14px", md: "18px", lgp: "20px" }}
                          height="auto"
                          mr={lang.includes("en") ? "4px" : "0"}
                          ml={lang.includes("ar") ? "4px" : "0"}
                        />
                      ) : (
                        <PolygonIcon
                          width={{ base: "14px", md: "18px", lgp: "20px" }}
                          height="auto"
                          mr={lang.includes("en") ? "4px" : "0"}
                          ml={lang.includes("ar") ? "4px" : "0"}
                        />
                      )}
                      <Heading
                        fontSize={{ lgp: "26px", md: "26px", base: "26px" }}
                        fontWeight="300"
                        color={
                          portfolioOverviewDetails?.itdGrowth.direction ===
                          "downwards"
                            ? "red.500"
                            : "green.500"
                        }
                      >
                        {percentTwoDecimalPlace(
                          portfolioOverviewDetails?.itdGrowth.percent,
                        )}
                        %
                      </Heading>
                    </Flex>
                  </Flex>
                </GridItem>
                <GridItem
                  textAlign={{ base: "center", md: "inherit" }}
                  pt={{ base: "15px", md: "0" }}
                >
                  <Flex
                    flexDir="column"
                    d={{ base: "inline-block", md: "inherit" }}
                    textAlign={{ base: "left", md: "inherit" }}
                    minW={{ base: "120px", md: "inherit" }}
                    ml={{ base: "30px", md: "0" }}
                  >
                    <Text
                      fontSize={{ base: "14px", md: "11px", lgp: "14px" }}
                      fontWeight="400"
                      color="gray.500"
                      ml={{
                        base: lang === "ar" ? "0" : "19px",
                        md: lang === "ar" ? "0" : "24px",
                      }}
                      whiteSpace="nowrap"
                      textAlign="start"
                    >
                      {t("common:client.annualized")}
                    </Text>
                    <Flex
                      alignItems="center"
                      justifyContent={lang === "ar" ? "flex-end" : ""}
                      dir="ltr"
                    >
                      {portfolioOverviewDetails?.annualizedGrowth.direction ==
                      "downwards" ? (
                        <PolygonDownIcon
                          width={{ base: "14px", md: "18px", lgp: "20px" }}
                          height="auto"
                          mr={lang.includes("en") ? "4px" : "0"}
                          ml={lang.includes("ar") ? "4px" : "0"}
                        />
                      ) : (
                        <PolygonIcon
                          width={{ base: "14px", md: "18px", lgp: "20px" }}
                          height="auto"
                          mr={lang.includes("en") ? "4px" : "0"}
                          ml={lang.includes("ar") ? "4px" : "0"}
                        />
                      )}
                      <Heading
                        fontSize={{ lgp: "26px", md: "26px", base: "26px" }}
                        fontWeight="300"
                        color={
                          portfolioOverviewDetails?.annualizedGrowth
                            .direction === "downwards"
                            ? "red.500"
                            : "green.500"
                        }
                      >
                        {percentTwoDecimalPlace(
                          portfolioOverviewDetails?.annualizedGrowth.percent,
                        )}
                        %
                      </Heading>
                    </Flex>
                  </Flex>
                </GridItem>
              </Grid>
            </Box>
          </Box>
          <Box
            h={{ base: "auto", md: "300px" }}
            onClick={() => {
              if (!largeDesktopView) {
                goToDetailPage("/profit-and-loss")
              }
            }}
            flex="0 0 auto"
            w={{ base: "100%", md: "50%" }}
            maxW={{ base: "100%", md: "50%" }}
            pos="relative"
            _after={{
              content: '""',
              display: { base: "none", md: "block" },
              position: "absolute",
              width: "1px",
              top: "15px",
              bottom: "15px",
              right: "0",
              backgroundColor: "#4d4d4d",
            }}
            _before={{
              content: '""',
              position: "absolute",
              height: "1px",
              bottom: "0",
              right: { base: "0", md: "15px" },
              left: "0",
              backgroundColor: "#4d4d4d",
            }}
          >
            <Box p={{ base: "30px 0 30px 0", md: "24px 24px 24px 0" }}>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                mb="20px"
              >
                <Heading
                  fontSize={{ base: "14px", md: "14px", lgp: "14px" }}
                  fontWeight="700"
                  color="white"
                  borderBottom={{ base: "1px solid white", lgp: "none" }}
                >
                  {t("portfolioOverview.label.profitAndLoss")}
                </Heading>
                <Hide below="lgp">
                  <Box
                    as="span"
                    color="primary.500"
                    fontSize="14px"
                    fontWeight="400"
                    whiteSpace="nowrap"
                    textDecor="underline"
                    cursor="pointer"
                    onClick={() => {
                      goToDetailPage("/profit-and-loss")
                    }}
                  >
                    {t("common:button.viewDetails")}{" "}
                    <CaretRightIcon
                      h="20px"
                      color="primary.500"
                      w="20px"
                      transform={lang == "ar" ? "rotate(-180deg)" : "initial"}
                      transformOrigin="center"
                      position="relative"
                      top="-1px"
                    />
                  </Box>
                </Hide>
              </Flex>

              <Box w="100%">
                <HighChartsBarChart
                  series={[
                    {
                      name: "PnL",
                      data: portfolioOverviewDetails.profitLossChartValues,
                      showInLegend: false,
                    },
                  ]}
                  colors={["#AED1DA"]}
                  categories={portfolioOverviewDetails.lastFourQuarters}
                />
              </Box>
              <Flex
                justifyContent="center"
                alignItems="center"
                direction={lang === "ar" ? "row-reverse" : "row"}
                fontSize="36px"
              >
                <Box
                  fontWeight="100"
                  color={
                    portfolioOverviewDetails.profitLoss.direction ===
                    "downwards"
                      ? "red.500"
                      : "green.500"
                  }
                  mr={lang.includes("en") ? "8px" : "0"}
                  ml={lang.includes("ar") ? "8px" : "0"}
                >
                  {portfolioOverviewDetails.profitLoss.direction === "downwards"
                    ? "-"
                    : "+"}
                </Box>
                <Box
                  fontSize="36px"
                  fontWeight="100"
                  color={
                    portfolioOverviewDetails.profitLoss.direction ===
                    "downwards"
                      ? "red.500"
                      : "green.500"
                  }
                >
                  $
                </Box>
                <Box
                  color={
                    portfolioOverviewDetails.profitLoss.direction ===
                    "downwards"
                      ? "red.500"
                      : "green.500"
                  }
                  fontWeight="400"
                >
                  {roundCurrencyValue(
                    Math.abs(portfolioOverviewDetails.profitLoss.money),
                  )}
                </Box>
              </Flex>
            </Box>
          </Box>
          <Box
            h={{ base: "auto", md: "300px" }}
            onClick={() => {
              if (!largeDesktopView) {
                goToDetailPage("/total-investments")
              }
            }}
            flex="0 0 auto"
            w={{ base: "100%", md: "50%" }}
            maxW={{ base: "100%", md: "50%" }}
            pos="relative"
            _after={{
              content: '""',
              position: "absolute",
              height: "1px",

              bottom: "0",
              left: { base: "0", md: "15px" },
              right: "0",
              backgroundColor: "#4d4d4d",
            }}
          >
            <Box p={{ base: "30px 0 30px 0", md: "24px 0 24px 24px" }}>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                mb="20px"
              >
                <Heading
                  fontSize={{ base: "14px", md: "14px", lgp: "14px" }}
                  fontWeight="700"
                  color="white"
                  borderBottom={{ base: "1px solid white", lgp: "none" }}
                >
                  {t("portfolioOverview.label.portfolioHolding")}
                </Heading>
                <Hide below="lgp">
                  <Box
                    as="span"
                    color="primary.500"
                    fontSize="14px"
                    fontWeight="400"
                    whiteSpace="nowrap"
                    textDecor="underline"
                    cursor="pointer"
                    onClick={() => {
                      goToDetailPage("/total-investments")
                    }}
                  >
                    {t("common:button.viewDetails")}{" "}
                    <CaretRightIcon
                      h="20px"
                      color="primary.500"
                      w="20px"
                      transform={lang == "ar" ? "rotate(-180deg)" : "initial"}
                      transformOrigin="center"
                      position="relative"
                      top="-1px"
                    />
                  </Box>
                </Hide>
              </Flex>

              <Flex alignItems="center" justifyContent="center" height="200px">
                <Box width="40%">
                  <Text
                    textAlign="center"
                    color="gray.400"
                    fontWeight="400"
                    fontSize="58px"
                  >
                    {portfolioOverviewDetails.deals}
                  </Text>
                </Box>

                <Box width="60%">
                  <PortMapIcon />
                </Box>
              </Flex>
            </Box>
          </Box>
          <Box
            h={{ base: "auto", md: "300px" }}
            onClick={() => {
              if (!largeDesktopView) {
                goToDetailPage("/total-commitments")
              }
            }}
            flex="0 0 auto"
            w={{ base: "100%", md: "50%" }}
            maxW={{ base: "100%", md: "50%" }}
            pos="relative"
            _after={{
              content: '""',
              display: { base: "none", md: "block" },
              position: "absolute",
              width: "1px",
              top: "15px",
              bottom: "0",
              right: "0",
              backgroundColor: "#4d4d4d",
            }}
            _before={{
              content: '""',
              display: { base: "block", md: "none" },
              position: "absolute",
              height: "1px",
              right: "0",
              left: "0",
              bottom: "0",
              backgroundColor: "#4d4d4d",
            }}
          >
            <Box p={{ base: "30px 0 30px 0", md: "24px 24px 24px 0" }}>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                mb="20px"
              >
                <Box>
                  <Heading
                    fontSize={{ base: "14px", md: "14px", lgp: "14px" }}
                    fontWeight="700"
                    color="white"
                    whiteSpace="nowrap"
                  >
                    <Text
                      as="span"
                      d="inline-block"
                      borderBottom={{ base: "1px solid white", lgp: "none" }}
                    >
                      {t("portfolioOverview.label.totalCommitments.title")}
                    </Text>
                    <Text
                      as="span"
                      d="inline-block"
                      fontSize="14px"
                      color="#aaa"
                      ml="20px"
                    >
                      {t("portfolioOverview.label.totalCommitments.subTitle")}
                    </Text>
                  </Heading>
                </Box>
                <Hide below="lgp">
                  <Box
                    as="span"
                    color="primary.500"
                    fontSize="14px"
                    fontWeight="400"
                    whiteSpace="nowrap"
                    textDecor="underline"
                    cursor="pointer"
                    onClick={() => {
                      goToDetailPage("/total-commitments")
                    }}
                  >
                    {t("common:button.viewDetails")}{" "}
                    <CaretRightIcon
                      h="20px"
                      color="primary.500"
                      w="20px"
                      transform={lang == "ar" ? "rotate(-180deg)" : "initial"}
                      transformOrigin="center"
                      position="relative"
                      top="-1px"
                    />
                  </Box>
                </Hide>
              </Flex>
              <Box mb={{ base: "36px", md: "50px" }} mt="50px" w="100%">
                <HighChartsLineChart
                  startAndEndDate={getLastMonth}
                  series={[
                    {
                      color: "#C0C5F0",
                      showInLegend: false,
                      name: "Total Commitment",
                      data: portfolioOverviewDetails.commitmentChartValues,
                    },
                  ]}
                />
              </Box>
              <Flex
                justifyContent="center"
                direction={lang === "ar" ? "row-reverse" : "row"}
                fontSize="36px"
                fontWeight="400"
                color="contrast.200"
                alignItems="center"
              >
                <Box
                  mr={lang.includes("en") ? "8px" : "0"}
                  ml={lang.includes("ar") ? "8px" : "0"}
                >
                  {portfolioOverviewDetails?.commitments < 0
                    ? "-"
                    : portfolioOverviewDetails?.commitments > 0
                    ? "+"
                    : false}
                </Box>
                <Box fontSize="36px" fontWeight="100">
                  $
                </Box>
                <Box>
                  {roundCurrencyValue(portfolioOverviewDetails?.commitments)}
                </Box>
              </Flex>
            </Box>
          </Box>
          <Box
            h={{ base: "auto", md: "300px" }}
            onClick={() => {
              if (!largeDesktopView) {
                goToDetailPage("/market-indicator")
              }
            }}
            flex="0 0 auto"
            w={{ base: "100%", md: "50%" }}
            maxW={{ base: "100%", md: "50%" }}
            pos="relative"
          >
            <Box p={{ base: "30px 0 30px 0", md: "24px 0 24px 24px" }}>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                mb="20px"
              >
                <Heading
                  fontSize={{ base: "14px", md: "14px", lgp: "14px" }}
                  fontWeight="700"
                  color="white"
                  borderBottom={{ base: "1px solid white", lgp: "none" }}
                >
                  {t("portfolioOverview.label.marketIndicators")}
                </Heading>
                <Hide below="lgp">
                  <Box
                    as="span"
                    color="primary.500"
                    fontSize="14px"
                    fontWeight="400"
                    whiteSpace="nowrap"
                    textDecor="underline"
                    cursor="pointer"
                    onClick={() => {
                      goToDetailPage("/market-indicator")
                    }}
                  >
                    {t("common:button.viewDetails")}{" "}
                    <CaretRightIcon
                      h="20px"
                      color="primary.500"
                      w="20px"
                      transform={lang == "ar" ? "rotate(-180deg)" : "initial"}
                      transformOrigin="center"
                      position="relative"
                      top="-1px"
                    />
                  </Box>
                </Hide>
              </Flex>
              <Box p="80px 0">
                <MarketIndicatorsChart
                  marketSpectrumData={
                    portfolioOverviewDetails.marketSpectrumData
                  }
                />
              </Box>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}
