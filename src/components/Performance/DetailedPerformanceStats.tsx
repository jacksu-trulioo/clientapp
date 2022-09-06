import {
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Hide,
  Image,
  Show,
  Spacer,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { DownloadButton, PolygonDownIcon, PolygonIcon } from "~/components"
import { getShortMonth } from "~/utils/clientUtils/dateUtility"
import {
  absoluteConvertCurrencyWithDollar,
  percentTwoDecimalPlace,
  roundCurrencyValue,
  roundValueWithoutAbsolute,
} from "~/utils/clientUtils/globalUtilities"

type PerformanceProps = {
  selectedQuarterDetailedPerformance: {
    valueStart: number
    valueEnd: number
    netChangeValue: {
      money: number
      direction: string
    }
    netChangePercent: {
      percent: number
      direction: string
    }
    itdAnnualizedPercentPerAnnum: number
    itdAnnualizedPercent: {
      percent: number
      direction: string
    }
    illiquidValue: {
      percent: number
      direction: string
    }
    liquidValue: {
      percent: number
      direction: string
    }
    illiquidVintage: {
      percent: number
      direction: string
    }
    liquidValuePerAnnum: number
    illiquidValuePerAnnum: number
    illiquidVintagePerAnnum: number
    sharpeRatio: number
    riskVolatility: number
    annualizedPerformance: number
    additions: number
  }
  selectedQuarterMonthlyPerformance: monthlyPerformanceType[]
  selectedQuarter: string | number
  downloadTableDataInExcel: Function
}

type monthlyPerformanceType = {
  additionsOrWithdrawels: number
  netChange: number
  performance: number
  cumulativePerformancePercent: number
  period: {
    year: number
    month: number
  }
  cumulativePerformanceValue: number
}

export default function DetailedPerformanceStats({
  selectedQuarterDetailedPerformance,
  selectedQuarterMonthlyPerformance,
  selectedQuarter,
  downloadTableDataInExcel,
}: PerformanceProps) {
  const { lang, t } = useTranslation("performance")
  const isMobileView = useBreakpointValue({
    base: true,
    lgp: true,
    md: true,
    sm: true,
    xl: false,
    "2xl": false,
  })

  return (
    <>
      <Show below="md">
        <Divider orientation="horizontal" mt="24px" mb="24px" />
      </Show>

      <Box>
        <Flex
          paddingTop={{ base: "0px", sm: "0px", md: "48px" }}
          paddingBottom="32px"
          alignItems="end"
        >
          <Text
            color="white"
            fontSize={{ base: "18px", sm: "20px" }}
            fontWeight={{ base: "bold", md: "400", xl: 400 }}
          >
            {t("detailedPerformance.title")}{" "}
          </Text>
          {selectedQuarter == "ITD" ? (
            <Text
              fontWeight="400"
              fontSize="14px"
              color="primary.500"
              marginLeft="16px"
            >
              {t("labels.inceptionToDate")}
            </Text>
          ) : (
            false
          )}
        </Flex>
        {!isMobileView ? (
          <Box>
            <Grid
              templateColumns={{
                base: "repeat(2, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(2, 1fr)",
                xl: "repeat(4, 1fr)",
              }}
              gap={{ base: "10px", sm: "6", md: "6" }}
              borderBottom={{ base: "0", xl: "1px solid #4d4d4d" }}
              paddingBottom={{ base: "15px", xl: "40px" }}
            >
              <GridItem
                borderRight="1px solid #4d4d4d"
                p={{
                  base: "0 0 20",
                  sm: "0 0 20px",
                  xl: lang.includes("ar") ? "0" : "0px 12px",
                }}
                position="relative"
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "95%",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: { width: "95%" },
                    xl: { borderBottom: "0" },
                  }}
                >
                  <Text
                    color="gray.500"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar")
                        ? "0"
                        : Math.round(
                            selectedQuarterDetailedPerformance.valueStart,
                          ) < 0
                        ? "28px"
                        : "20px",
                    }}
                  >
                    {t("labels.valueStart")}
                  </Text>
                  <Flex
                    color="white"
                    fontSize={{ base: "16px", md: "26px" }}
                    fontWeight="thin"
                    marginTop="15px"
                    dir="ltr"
                    flexFlow="row wrap"
                    style={{
                      justifyContent: lang.includes("ar")
                        ? "flex-end"
                        : "flex-start",
                    }}
                  >
                    <Text fontSize="inherit" fontWeight="400">
                      $
                    </Text>
                    <Text fontSize="inherit" fontWeight="400">
                      {roundCurrencyValue(
                        selectedQuarterDetailedPerformance?.valueStart,
                      )}
                    </Text>
                  </Flex>
                </Box>
              </GridItem>
              <GridItem
                borderRight={{ base: "0", xl: "1px solid #4d4d4d" }}
                p={{ base: "0 0 20", sm: "0 0 20px", xl: "0px 24px" }}
                position="relative"
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "95%",
                      left: "0",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: { width: "95%", left: "-5px" },
                    xl: { borderBottom: "0" },
                  }}
                >
                  <Text
                    color="gray.500"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar")
                        ? "0"
                        : Math.round(
                            selectedQuarterDetailedPerformance.valueEnd,
                          ) < 0
                        ? "28px"
                        : "20px",
                    }}
                  >
                    {t("labels.valueEnd")}
                  </Text>
                  <Flex
                    color="white"
                    fontSize={{ base: "16px", md: "26px" }}
                    fontWeight="thin"
                    marginTop="15px"
                    dir="ltr"
                    flexFlow="row wrap"
                    style={{
                      justifyContent: lang.includes("ar")
                        ? "flex-end"
                        : "flex-start",
                    }}
                  >
                    <Text fontSize="inherit" fontWeight="400">
                      $
                    </Text>
                    <Text fontSize="inherit" fontWeight="400">
                      {roundCurrencyValue(
                        selectedQuarterDetailedPerformance?.valueEnd,
                      )}
                    </Text>
                  </Flex>
                </Box>
              </GridItem>
              <GridItem
                borderRight="1px solid #4d4d4d"
                p={{ base: "0 0 20", sm: "0 0 20px", xl: "0 20px 0 0" }}
                position={"relative"}
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "95%",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: { width: "95%", borderBottom: "1px solid #4d4d4d" },
                    xl: { borderBottom: "0" },
                  }}
                >
                  <Text
                    color="gray.500"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar")
                        ? "0"
                        : selectedQuarterDetailedPerformance
                            ?.itdAnnualizedPercent?.direction == "downwards" ||
                          selectedQuarterDetailedPerformance
                            ?.itdAnnualizedPercent?.direction == "upwards"
                        ? "32px"
                        : "0",
                    }}
                  >
                    {t("labels.inceptionToDate")}
                  </Text>
                  <Flex
                    color="white"
                    fontSize={{ base: "16px", md: "26px" }}
                    fontWeight="thin"
                    marginTop="15px"
                    alignItems={"center"}
                    flexFlow="row wrap"
                    style={{
                      justifyContent: "flex-start",
                    }}
                  >
                    <Flex dir="ltr" align="center">
                      {selectedQuarterDetailedPerformance?.itdAnnualizedPercent
                        ?.direction == "downwards" && (
                        <PolygonDownIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mr="2"
                          ml="2"
                        />
                      )}
                      {selectedQuarterDetailedPerformance?.itdAnnualizedPercent
                        ?.direction == "upwards" && (
                        <PolygonIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mr="2"
                          ml="2"
                        />
                      )}
                      <Text
                        color={
                          selectedQuarterDetailedPerformance
                            ?.itdAnnualizedPercent?.direction == "downwards"
                            ? "red.500"
                            : selectedQuarterDetailedPerformance
                                ?.itdAnnualizedPercent?.direction == "neutral"
                            ? "gray.500"
                            : "green.500"
                        }
                        fontSize="inherit"
                        fontWeight="400"
                        whiteSpace="nowrap"
                      >
                        {percentTwoDecimalPlace(
                          selectedQuarterDetailedPerformance
                            .itdAnnualizedPercent.percent,
                        )}
                        %
                      </Text>
                    </Flex>
                    <Flex mb={{ base: "0", md: "-5px" }} dir="ltr" ml="2">
                      <Text
                        color="gray.500"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontStyle="italic"
                        ml={lang.includes("ar") ? "5px" : "0"}
                        whiteSpace="nowrap"
                      >
                        {" "}
                        {roundValueWithoutAbsolute(
                          selectedQuarterDetailedPerformance.itdAnnualizedPercentPerAnnum,
                        )}
                        %
                      </Text>
                      <Text
                        color="gray.500"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontStyle="italic"
                        mb={{ base: "0", md: "-10px" }}
                        ml="2"
                      >
                        p.a.
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              </GridItem>
              <GridItem
                p={{
                  base: "0 0 20",
                  sm: "0 0 20px 10px",
                  xl: "0px 15px",
                }}
                position="relative"
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "95%",
                      left: "0",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: {
                      width: "95%",
                      left: "-5px",
                      borderBottom: "1px solid #4d4d4d",
                    },
                    xl: { borderBottom: "0" },
                  }}
                >
                  <Text
                    color="gray.500"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "20px",
                    }}
                  >
                    {t("labels.netChange")}
                  </Text>
                  <Flex
                    color="white"
                    fontSize={{ base: "16px", md: "26px" }}
                    fontWeight="thin"
                    marginTop="15px"
                    alignItems={"center"}
                    style={{
                      justifyContent: "flex-start",
                    }}
                    flexFlow="row wrap"
                  >
                    <Flex
                      color={
                        selectedQuarterDetailedPerformance.netChangeValue
                          ?.direction == "downwards"
                          ? "red.500"
                          : "green.500"
                      }
                      dir="ltr"
                      flexFlow="row wrap"
                    >
                      <Text fontSize="inherit" fontWeight="400">
                        $
                      </Text>
                      <Text fontSize="inherit" fontWeight="400">
                        {roundCurrencyValue(
                          Math.abs(
                            selectedQuarterDetailedPerformance.netChangeValue
                              .money,
                          ),
                        )}{" "}
                      </Text>
                    </Flex>
                    <Flex
                      alignItems="center"
                      dir="ltr"
                      style={{
                        marginRight: lang.includes("ar") ? "6px" : "0",
                      }}
                    >
                      {selectedQuarterDetailedPerformance.netChangePercent
                        ?.direction == "downwards" ? (
                        <Image
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          objectFit="contain"
                          style={{
                            marginLeft: "0.5rem",
                          }}
                          alt=""
                          src={`/images/downArrow.svg`}
                        />
                      ) : (
                        <PolygonIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mr="2"
                          ml="2"
                        />
                      )}
                      <Text
                        color={
                          selectedQuarterDetailedPerformance.netChangePercent
                            ?.direction == "downwards"
                            ? "red.500"
                            : "green.500"
                        }
                        fontSize={{ base: "12px", md: "14px" }}
                        dir="ltr"
                      >
                        {percentTwoDecimalPlace(
                          selectedQuarterDetailedPerformance.netChangePercent
                            .percent,
                        )}
                        %
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              </GridItem>
            </Grid>
            <Grid
              templateColumns={{
                base: "repeat(2, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(2, 1fr)",
                xl: "repeat(3, 1fr)",
              }}
              gap={{ base: "10px", sm: "6", md: "6" }}
              borderBottom={{ base: "0", xl: "1px solid #4d4d4d" }}
              paddingBottom={{ base: "15px", xl: "40px" }}
              paddingTop={{ base: "0", md: "15px", xl: "40px" }}
            >
              <GridItem borderRight="1px solid #4d4d4d" position="relative">
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "95%",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: { width: "95%", borderBottom: "1px solid #4d4d4d" },
                    xl: { borderBottom: "0" },
                  }}
                >
                  <Text
                    color="gray.400"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar")
                        ? "0"
                        : selectedQuarterDetailedPerformance?.liquidValue
                            ?.direction == "downwards" ||
                          selectedQuarterDetailedPerformance?.liquidValue
                            ?.direction == "upwards"
                        ? "33px"
                        : "33px",
                    }}
                  >
                    {t("common:client.liquid")}
                  </Text>
                  <Flex
                    color="white"
                    fontSize={{ base: "16px", md: "26px" }}
                    fontWeight="thin"
                    marginTop="15px"
                    alignItems="center"
                    justifyContent="flex-start"
                    ms={
                      selectedQuarterDetailedPerformance?.liquidValue
                        ?.direction == "neutral" && lang.includes("en")
                        ? "32px"
                        : "0"
                    }
                  >
                    <Flex dir="ltr" align="center">
                      {selectedQuarterDetailedPerformance?.liquidValue
                        ?.direction == "downwards" ? (
                        <PolygonDownIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mr="2"
                          ml="2"
                        />
                      ) : selectedQuarterDetailedPerformance?.liquidValue
                          ?.direction == "upwards" ? (
                        <PolygonIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mr="2"
                          ml="2"
                        />
                      ) : (
                        ""
                      )}
                      <Text
                        color={
                          selectedQuarterDetailedPerformance?.liquidValue
                            ?.direction == "downwards"
                            ? "red.500"
                            : selectedQuarterDetailedPerformance?.liquidValue
                                ?.direction == "neutral"
                            ? "gray.500"
                            : "green.500"
                        }
                        fontSize="inherit"
                        fontWeight="400"
                        whiteSpace="nowrap"
                      >
                        {percentTwoDecimalPlace(
                          selectedQuarterDetailedPerformance.liquidValue
                            .percent,
                        )}
                        %
                      </Text>
                    </Flex>
                    <Flex
                      mb={{ base: "0", md: "-5px" }}
                      dir="ltr"
                      ml="2"
                      flexFlow="row wrap"
                    >
                      <Text
                        color="gray.500"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontStyle="italic"
                        ml={lang.includes("ar") ? "5px" : "0"}
                        whiteSpace="nowrap"
                      >
                        {" "}
                        {percentTwoDecimalPlace(
                          selectedQuarterDetailedPerformance.liquidValuePerAnnum,
                        )}
                        %
                      </Text>
                      <Text
                        color="gray.500"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontStyle="italic"
                        ml="2"
                      >
                        p.a.
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              </GridItem>
              <GridItem
                borderRight={{ base: "0", xl: "1px solid #4d4d4d" }}
                position="relative"
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "95%",
                      left: "0",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: {
                      width: "95%",
                      left: "-5px",
                      borderBottom: "1px solid #4d4d4d",
                    },
                    xl: { borderBottom: "0" },
                  }}
                >
                  <Text
                    color="gray.400"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "33px",
                    }}
                  >
                    {t("common:client.illiquid")}{" "}
                  </Text>
                  <Flex
                    color="white"
                    fontSize={{ base: "16px", md: "26px" }}
                    fontWeight="thin"
                    marginTop="15px"
                    alignItems={"center"}
                    style={{
                      justifyContent: "flex-start",
                    }}
                    flexFlow="row wrap"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar")
                        ? "0"
                        : selectedQuarterDetailedPerformance?.illiquidValue
                            ?.direction == "downwards" ||
                          selectedQuarterDetailedPerformance?.illiquidValue
                            ?.direction == "upwards"
                        ? "2px"
                        : "33px",
                    }}
                  >
                    <Flex dir="ltr" align="center">
                      {selectedQuarterDetailedPerformance?.illiquidValue
                        ?.direction == "downwards" && (
                        <PolygonDownIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mr="2"
                          ml="2"
                        />
                      )}
                      {selectedQuarterDetailedPerformance?.illiquidValue
                        ?.direction == "upwards" && (
                        <PolygonIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mr="2"
                          ml="2"
                        />
                      )}
                      <Text
                        color={
                          selectedQuarterDetailedPerformance?.illiquidValue
                            ?.direction == "downwards"
                            ? "red.500"
                            : selectedQuarterDetailedPerformance?.illiquidValue
                                ?.direction == "neutral"
                            ? "gray.500"
                            : "green.500"
                        }
                        fontSize="inherit"
                        fontWeight="400"
                        whiteSpace="nowrap"
                        style={{
                          direction: lang.includes("ar") ? "initial" : "revert",
                        }}
                        direction="initial"
                      >
                        {percentTwoDecimalPlace(
                          selectedQuarterDetailedPerformance.illiquidValue
                            .percent,
                        )}
                        %
                      </Text>
                    </Flex>
                    <Flex
                      mb={{ base: "0", md: "-5px" }}
                      dir="ltr"
                      ml="2"
                      flexFlow="row wrap"
                    >
                      <Text
                        color="gray.500"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontStyle="italic"
                        whiteSpace="nowrap"
                      >
                        {" "}
                        {percentTwoDecimalPlace(
                          selectedQuarterDetailedPerformance.illiquidValuePerAnnum,
                        )}
                        %
                      </Text>
                      <Text
                        color="gray.500"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontStyle="italic"
                        ml="2"
                      >
                        p.a.
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              </GridItem>
              <GridItem
                paddingBottom="20px"
                position="relative"
                paddingRight="10px"
              >
                <Box>
                  <Text
                    color="gray.400"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "33px",
                    }}
                  >
                    {t("labels.illiquidGreaterThanTwoYear")}
                  </Text>
                  <Flex
                    color="white"
                    fontSize={{ base: "16px", md: "26px" }}
                    fontWeight="thin"
                    marginTop="15px"
                    alignItems={"center"}
                    flexFlow="row wrap"
                    style={{
                      justifyContent: "flex-start",
                    }}
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar")
                        ? "0"
                        : selectedQuarterDetailedPerformance?.illiquidVintage
                            ?.direction == "downwards" ||
                          selectedQuarterDetailedPerformance?.illiquidVintage
                            ?.direction == "upwards"
                        ? "2px"
                        : "33px",
                    }}
                  >
                    <Flex dir="ltr" align="center">
                      {selectedQuarterDetailedPerformance?.illiquidVintage
                        ?.direction == "downwards" ? (
                        <PolygonDownIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mr="2"
                          ml="2"
                        />
                      ) : selectedQuarterDetailedPerformance?.illiquidVintage
                          ?.direction == "upwards" ? (
                        <PolygonIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mr="2"
                          ml="2"
                        />
                      ) : (
                        <></>
                      )}
                      <Text
                        color={
                          selectedQuarterDetailedPerformance?.illiquidVintage
                            ?.direction == "downwards"
                            ? "red.500"
                            : selectedQuarterDetailedPerformance
                                ?.illiquidVintage?.direction == "neutral"
                            ? "gray.500"
                            : "green.500"
                        }
                        fontSize="inherit"
                        fontWeight="400"
                        whiteSpace="nowrap"
                      >
                        {percentTwoDecimalPlace(
                          selectedQuarterDetailedPerformance.illiquidVintage
                            .percent,
                        )}
                        %
                      </Text>
                    </Flex>
                    <Flex
                      mb={{ base: "0", md: "-5px" }}
                      dir="ltr"
                      ml="2"
                      flexFlow="row wrap"
                    >
                      <Text
                        color="gray.500"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontStyle="italic"
                        whiteSpace="nowrap"
                      >
                        {" "}
                        {percentTwoDecimalPlace(
                          selectedQuarterDetailedPerformance.illiquidVintagePerAnnum,
                        )}
                        %
                      </Text>
                      <Text
                        color="gray.500"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontStyle="italic"
                        ml="2"
                      >
                        p.a.
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              </GridItem>
            </Grid>
            <Grid
              templateColumns={{
                base: "repeat(2, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(2, 1fr)",
                xl: "repeat(3, 1fr)",
              }}
              gap={{ base: "10px", sm: "6", md: "6" }}
              borderBottom={{ base: "0", xl: "1px solid #4d4d4d" }}
              paddingBottom={{ base: "15px", xl: "40px" }}
              paddingTop={{ base: "0", md: "15px", xl: "40px" }}
            >
              <GridItem
                borderRight={{
                  base: "0",
                  xl: "1px solid #4d4d4d",
                }}
                paddingBottom="20px"
                position="relative"
                p={{ base: "0 0 20", sm: "0 0 20" }}
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "95%",
                      left: "0",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: { width: "95%", left: "-5px" },
                    xl: { borderBottom: "0" },
                  }}
                >
                  <Text
                    color="gray.400"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang === "ar" ? "0" : "32px",
                    }}
                  >
                    {t("labels.sharpRatio")}
                  </Text>

                  <Text
                    fontSize={{ base: "16px", md: "26px" }}
                    color="white"
                    fontWeight="thin"
                    marginTop="15px"
                    style={{
                      textAlign: lang.includes("ar") ? "right" : "left",
                    }}
                    marginLeft={{
                      base: "0px",
                      xl: lang === "ar" ? "0" : "32px",
                    }}
                  >
                    {percentTwoDecimalPlace(
                      selectedQuarterDetailedPerformance.sharpeRatio,
                    )}
                  </Text>
                </Box>
              </GridItem>
              <GridItem
                borderRight="1px solid #4d4d4d"
                paddingBottom="20px"
                position="relative"
                p={{ base: "0 0 20", sm: "0 0 20" }}
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "95%",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: { width: "95%" },
                    md: { borderBottom: "0" },
                  }}
                >
                  <Text
                    color="gray.400"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang === "ar" ? "0" : "32px",
                    }}
                  >
                    {t("labels.riskVolatility")}
                  </Text>
                  <Text
                    fontSize={{ base: "16px", md: "26px" }}
                    color="white"
                    fontWeight="thin"
                    marginTop="15px"
                    style={{
                      textAlign: lang.includes("ar") ? "right" : "left",
                    }}
                    marginLeft={{
                      base: "0px",
                      xl: lang === "ar" ? "0" : "32px",
                    }}
                  >
                    {percentTwoDecimalPlace(
                      selectedQuarterDetailedPerformance.riskVolatility,
                    )}
                    %
                  </Text>
                </Box>
              </GridItem>
              <GridItem
                position="relative"
                p={{ base: "0 0 20", sm: "0 0 20" }}
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "90%",
                      left: "0",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: { width: "95%", left: "-5px" },
                    md: { borderBottom: "0" },
                  }}
                >
                  <Text
                    color="gray.400"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang === "ar" ? "0" : "32px",
                    }}
                  >
                    {t("labels.annualized")}
                  </Text>
                  <Text
                    dir="ltr"
                    fontSize={{ base: "16px", md: "26px" }}
                    color="white"
                    fontWeight="thin"
                    marginTop="15px"
                    style={{
                      textAlign: lang.includes("ar") ? "right" : "left",
                    }}
                    marginLeft={{
                      base: "0px",
                      xl: lang === "ar" ? "0" : "32px",
                    }}
                  >
                    {selectedQuarterDetailedPerformance.annualizedPerformance <
                    0
                      ? "-"
                      : ""}
                    {percentTwoDecimalPlace(
                      selectedQuarterDetailedPerformance.annualizedPerformance,
                    )}
                    %
                  </Text>
                </Box>
              </GridItem>
            </Grid>
            <Grid
              templateColumns="repeat(3, 1fr)"
              gap={{ base: "10px", sm: "6", md: "6" }}
              paddingBottom={{ base: "15px", xl: "40px" }}
              paddingTop={{ base: "0", md: "15px", xl: "40px" }}
            >
              <GridItem
                paddingBottom="20px"
                p={{ base: "0 0 20", sm: "0 0 20" }}
                borderRight={{
                  base: "0px",
                  sm: "0px",
                  xl: "1px solid #4d4d4d",
                }}
                position="relative"
              >
                <Box>
                  <Text
                    color="gray.400"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar")
                        ? "0"
                        : Math.round(
                            selectedQuarterDetailedPerformance.additions,
                          ) < 0
                        ? "28px"
                        : "33px",
                    }}
                  >
                    {t("labels.additions")}
                  </Text>
                  <Flex
                    color="white"
                    fontSize={{ base: "16px", md: "26px" }}
                    fontWeight="thin"
                    marginTop="20px"
                    flexFlow="row wrap"
                    dir="ltr"
                    style={{
                      justifyContent: lang.includes("ar")
                        ? "flex-end"
                        : "flex-start",
                    }}
                  >
                    <Text
                      fontSize="inherit"
                      fontWeight="400"
                      marginLeft={{
                        base: "0px",
                        xl: lang.includes("ar")
                          ? "0"
                          : Math.round(
                              selectedQuarterDetailedPerformance.additions,
                            ) < 0
                          ? "0"
                          : "13px",
                      }}
                    >
                      {absoluteConvertCurrencyWithDollar(
                        selectedQuarterDetailedPerformance.additions,
                      ) || "$0"}
                    </Text>
                  </Flex>
                </Box>
              </GridItem>
            </Grid>
          </Box>
        ) : (
          false
        )}
        {isMobileView ? (
          <>
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap={{ base: "10px", sm: "6", md: "6" }}
              paddingBottom={{ base: "15px", xl: "40px" }}
            >
              <GridItem
                borderRight="1px solid #4d4d4d"
                p={{ base: "0 0 20px", sm: "0 0 20px" }}
                position="relative"
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "95%",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: { width: "95%" },
                    xl: { borderBottom: "0" },
                  }}
                >
                  <Text
                    color="gray.500"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "20px",
                    }}
                  >
                    {t("labels.valueStart")}
                  </Text>
                  <Flex
                    color="white"
                    fontSize={{ base: "16px", md: "26px" }}
                    fontWeight="thin"
                    marginTop="15px"
                    dir="ltr"
                    flexFlow="row wrap"
                    style={{
                      justifyContent: lang.includes("ar")
                        ? "flex-end"
                        : "flex-start",
                    }}
                  >
                    <Text fontSize="inherit" fontWeight="400">
                      $
                    </Text>
                    <Text fontSize="inherit" fontWeight="400">
                      {roundCurrencyValue(
                        selectedQuarterDetailedPerformance?.valueStart,
                      )}
                    </Text>
                  </Flex>
                </Box>
              </GridItem>
              <GridItem
                p={{ base: "0 0 20", sm: "0 0 20px", xl: "0px 24px" }}
                position="relative"
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "95%",
                      left: "0",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: { width: "95%", left: "-5px" },
                    xl: { borderBottom: "0" },
                  }}
                >
                  <Text
                    color="gray.500"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "20px",
                    }}
                  >
                    {t("labels.valueEnd")}
                  </Text>
                  <Flex
                    color="white"
                    fontSize={{ base: "16px", md: "26px" }}
                    fontWeight="thin"
                    marginTop="15px"
                    dir="ltr"
                    flexFlow="row wrap"
                    style={{
                      justifyContent: lang.includes("ar")
                        ? "flex-end"
                        : "flex-start",
                    }}
                  >
                    <Text
                      paddingRigth={"5px"}
                      fontSize="inherit"
                      fontWeight="400"
                    >
                      $
                    </Text>
                    <Text fontSize="inherit" fontWeight="400">
                      {roundCurrencyValue(
                        selectedQuarterDetailedPerformance?.valueEnd,
                      )}
                    </Text>
                  </Flex>
                </Box>
              </GridItem>
            </Grid>

            <Grid
              templateColumns="repeat(2, 1fr)"
              gap={{ base: "10px", sm: "6", md: "6" }}
              paddingBottom={{ base: "15px", xl: "40px" }}
            >
              <GridItem
                borderRight="1px solid #4d4d4d"
                p={{ base: "0 0 20px", sm: "0 0 20px", xl: "0px 24px" }}
                position={"relative"}
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "95%",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: { width: "95%", borderBottom: "1px solid #4d4d4d" },
                    xl: { borderBottom: "0" },
                  }}
                >
                  <Text
                    color="gray.500"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "32px",
                    }}
                  >
                    {t("labels.inceptionToDate")}
                  </Text>
                  <Flex
                    color="white"
                    fontSize={{ base: "16px", md: "26px" }}
                    fontWeight="thin"
                    marginTop="15px"
                    alignItems={"center"}
                    flexFlow="row wrap"
                    style={{
                      justifyContent: "flex-start",
                    }}
                  >
                    <Flex dir="ltr" align="center">
                      {selectedQuarterDetailedPerformance?.itdAnnualizedPercent
                        ?.direction == "downwards" ? (
                        <PolygonDownIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mx="2"
                        />
                      ) : (
                        <PolygonIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mx="2"
                        />
                      )}
                      <Text
                        color={
                          selectedQuarterDetailedPerformance
                            ?.itdAnnualizedPercent?.direction == "downwards"
                            ? "red.500"
                            : "green.500"
                        }
                        fontSize="inherit"
                        fontWeight="400"
                        whiteSpace="nowrap"
                      >
                        {percentTwoDecimalPlace(
                          selectedQuarterDetailedPerformance
                            .itdAnnualizedPercent.percent,
                        )}
                        %
                      </Text>
                    </Flex>
                    <Flex mb={{ base: "0", md: "-5px" }} dir="ltr" ml="2">
                      <Text
                        color="gray.500"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontStyle="italic"
                        ml={lang.includes("ar") ? "5px" : "0"}
                        whiteSpace="nowrap"
                      >
                        {" "}
                        {roundValueWithoutAbsolute(
                          selectedQuarterDetailedPerformance.itdAnnualizedPercentPerAnnum,
                        )}
                        %
                      </Text>
                      <Text
                        color="gray.500"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontStyle="italic"
                        mb={{ base: "0", md: "-10px" }}
                        ml="2"
                      >
                        p.a.
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              </GridItem>
              <GridItem
                p={{ base: "0 0 20px", sm: "0 0 20px", xl: "0px 24px" }}
                position="relative"
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "95%",
                      left: "0",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: {
                      width: "95%",
                      left: "-5px",
                      borderBottom: "1px solid #4d4d4d",
                    },
                  }}
                >
                  <Text
                    color="gray.500"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "20px",
                    }}
                  >
                    {t("labels.netChange")}
                  </Text>
                  <Flex
                    color="white"
                    fontSize={{ base: "16px", md: "26px" }}
                    fontWeight="thin"
                    marginTop="15px"
                    alignItems={"center"}
                    style={{
                      justifyContent: "flex-start",
                    }}
                    flexFlow="row wrap"
                  >
                    <Flex
                      color={
                        selectedQuarterDetailedPerformance.netChangeValue
                          ?.direction == "downwards"
                          ? "red.500"
                          : "green.500"
                      }
                      dir="ltr"
                      flexFlow="row wrap"
                      mr="2"
                    >
                      <Text fontSize="inherit" fontWeight="400">
                        $
                      </Text>
                      <Text fontSize="inherit" fontWeight="400">
                        {roundCurrencyValue(
                          Math.abs(
                            selectedQuarterDetailedPerformance.netChangeValue
                              .money,
                          ),
                        )}{" "}
                      </Text>
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      dir="ltr"
                      mt={lang.includes("ar") ? "2px" : ""}
                    >
                      {selectedQuarterDetailedPerformance.netChangePercent
                        ?.direction == "downwards" ? (
                        <PolygonDownIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mx="1"
                        />
                      ) : (
                        <PolygonIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mx="1"
                        />
                      )}
                      <Text
                        color={
                          selectedQuarterDetailedPerformance.netChangePercent
                            ?.direction == "downwards"
                            ? "red.500"
                            : "green.500"
                        }
                        fontSize={{ base: "12px", md: "18px", lgp: "14px" }}
                        dir="ltr"
                      >
                        {percentTwoDecimalPlace(
                          selectedQuarterDetailedPerformance.netChangePercent
                            .percent,
                        )}
                        %
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              </GridItem>
            </Grid>

            <Grid
              templateColumns="repeat(2, 1fr)"
              gap={{ base: "10px", sm: "6", md: "6" }}
              paddingBottom={{ base: "15px", xl: "40px" }}
              paddingTop={{ base: "0", md: "15px", xl: "40px" }}
            >
              <GridItem
                borderRight="1px solid #4d4d4d"
                p={{ base: "0 0 20", sm: "0 0 20" }}
                position="relative"
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "95%",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: { width: "95%", borderBottom: "1px solid #4d4d4d" },
                  }}
                >
                  <Text
                    color="gray.400"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "33px",
                    }}
                  >
                    {t("common:client.liquid")}
                  </Text>
                  <Flex
                    color="white"
                    fontSize={{ base: "16px", md: "26px" }}
                    fontWeight="thin"
                    marginTop="15px"
                    alignItems="center"
                    style={{
                      justifyContent: "flex-start",
                    }}
                    flexFlow="row wrap"
                  >
                    <Flex dir="ltr" align="center">
                      {selectedQuarterDetailedPerformance?.liquidValue
                        ?.direction == "downwards" ? (
                        <PolygonDownIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mx="2"
                        />
                      ) : selectedQuarterDetailedPerformance?.liquidValue
                          ?.direction == "upwards" ? (
                        <PolygonIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mx="2"
                        />
                      ) : (
                        <></>
                      )}

                      <Text
                        color={
                          selectedQuarterDetailedPerformance?.liquidValue
                            ?.direction == "downwards"
                            ? "red.500"
                            : selectedQuarterDetailedPerformance?.liquidValue
                                ?.direction == "neutral"
                            ? "gray.500"
                            : "green.500"
                        }
                        fontSize="inherit"
                        fontWeight="400"
                        whiteSpace="nowrap"
                      >
                        {percentTwoDecimalPlace(
                          selectedQuarterDetailedPerformance.liquidValue
                            .percent,
                        )}
                        %
                      </Text>
                    </Flex>
                    <Flex
                      mb={{ base: "0", md: "-5px" }}
                      dir="ltr"
                      ml="2"
                      flexFlow="row wrap"
                    >
                      <Text
                        color="gray.500"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontStyle="italic"
                        ml={lang.includes("ar") ? "5px" : "0"}
                        whiteSpace="nowrap"
                      >
                        {" "}
                        {percentTwoDecimalPlace(
                          selectedQuarterDetailedPerformance.liquidValuePerAnnum,
                        )}
                        %
                      </Text>
                      <Text
                        color="gray.500"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontStyle="italic"
                        ml="2"
                      >
                        p.a.
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              </GridItem>
              <GridItem
                p={{ base: "0 0 20px", sm: "0 0 20px" }}
                position="relative"
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "95%",
                      left: "0",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: {
                      width: "95%",
                      left: "-5px",
                      borderBottom: "1px solid #4d4d4d",
                    },
                  }}
                >
                  <Text
                    color="gray.400"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "33px",
                    }}
                  >
                    {t("common:client.illiquid")}
                  </Text>
                  <Flex
                    color="white"
                    fontSize={{ base: "16px", md: "26px" }}
                    fontWeight="thin"
                    marginTop="15px"
                    alignItems={"center"}
                    style={{
                      justifyContent: "flex-start",
                    }}
                    flexFlow="row wrap"
                  >
                    <Flex dir="ltr" alignItems="center">
                      {selectedQuarterDetailedPerformance?.illiquidValue
                        ?.direction == "downwards" ? (
                        <PolygonDownIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mx="2"
                        />
                      ) : (
                        <PolygonIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mx="2"
                        />
                      )}
                      <Text
                        color={
                          selectedQuarterDetailedPerformance?.illiquidValue
                            ?.direction == "downwards"
                            ? "red.500"
                            : "green.500"
                        }
                        fontSize="inherit"
                        fontWeight="400"
                        whiteSpace="nowrap"
                        style={{
                          direction: lang.includes("ar") ? "initial" : "revert",
                        }}
                        direction="initial"
                      >
                        {percentTwoDecimalPlace(
                          selectedQuarterDetailedPerformance.illiquidValue
                            .percent,
                        )}{" "}
                        %
                      </Text>
                    </Flex>
                    <Flex
                      mb={{ base: "0", md: "-5px" }}
                      dir="ltr"
                      ml="2"
                      flexFlow="row wrap"
                    >
                      <Text
                        color="gray.500"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontStyle="italic"
                        whiteSpace="nowrap"
                      >
                        {" "}
                        {percentTwoDecimalPlace(
                          selectedQuarterDetailedPerformance.illiquidValuePerAnnum,
                        )}
                        %
                      </Text>
                      <Text
                        color="gray.500"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontStyle="italic"
                        ml="2"
                      >
                        p.a.
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              </GridItem>
            </Grid>

            <Grid
              templateColumns="repeat(2, 1fr)"
              gap={{ base: "10px", sm: "6", md: "6" }}
              paddingBottom={{ base: "15px", xl: "40px" }}
              paddingTop={{ base: "0", md: "15px", xl: "40px" }}
            >
              <GridItem
                borderRight="1px solid #4d4d4d"
                position="relative"
                p={{ base: "0 0 20px", sm: "0 0 20px" }}
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "95%",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: { width: "95%", borderBottom: "1px solid #4d4d4d" },
                  }}
                >
                  <Text
                    color="gray.400"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "20px",
                    }}
                  >
                    {t("labels.illiquidGreaterThanTwoYear")}
                  </Text>
                  <Flex
                    color="white"
                    fontSize={{ base: "16px", md: "26px" }}
                    fontWeight="thin"
                    marginTop="15px"
                    alignItems={"center"}
                    flexFlow="row wrap"
                    style={{
                      justifyContent: "flex-start",
                    }}
                  >
                    <Flex dir="ltr" align="center">
                      {selectedQuarterDetailedPerformance?.illiquidVintage
                        ?.direction == "downwards" ? (
                        <PolygonDownIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mx="2"
                        />
                      ) : selectedQuarterDetailedPerformance?.illiquidVintage
                          ?.direction == "upwards" ? (
                        <PolygonIcon
                          w={{ base: "10px", md: "14px", xl: "14px" }}
                          mx="2"
                        />
                      ) : (
                        <></>
                      )}
                      <Text
                        color={
                          selectedQuarterDetailedPerformance?.illiquidVintage
                            ?.direction == "downwards"
                            ? "red.500"
                            : selectedQuarterDetailedPerformance
                                ?.illiquidVintage?.direction == "neutral"
                            ? "gray.500"
                            : "green.500"
                        }
                        fontSize="inherit"
                        fontWeight="400"
                        whiteSpace="nowrap"
                      >
                        {percentTwoDecimalPlace(
                          selectedQuarterDetailedPerformance.illiquidVintage
                            .percent,
                        )}
                        %
                      </Text>
                    </Flex>

                    <Flex
                      mb={{ base: "0", md: "-5px" }}
                      dir="ltr"
                      ml="2"
                      flexFlow="row wrap"
                    >
                      <Text
                        color="gray.500"
                        fontSize={{ base: "12px", md: "14px" }}
                        whiteSpace="nowrap"
                      >
                        {" "}
                        {percentTwoDecimalPlace(
                          selectedQuarterDetailedPerformance.illiquidVintagePerAnnum,
                        )}
                        %{" "}
                      </Text>
                      <Flex>
                        <Text
                          color="gray.500"
                          fontSize={{ base: "12px", md: "14px" }}
                          ml="2"
                          fontStyle="italic"
                        >
                          p.a.
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Box>
              </GridItem>

              <GridItem
                paddingBottom="20px"
                position="relative"
                p={{ base: "0 0 20px", sm: "0 0 20px" }}
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "95%",
                      left: "0",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: {
                      width: "95%",
                      left: "-5px",
                      borderBottom: "1px solid #4d4d4d",
                    },
                  }}
                >
                  <Text
                    color="gray.400"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "33px",
                    }}
                  >
                    {t("labels.sharpRatio")}
                  </Text>

                  <Text
                    fontSize={{ base: "16px", md: "26px" }}
                    color="white"
                    fontWeight="thin"
                    marginTop="15px"
                    style={{
                      textAlign: lang.includes("ar") ? "right" : "left",
                    }}
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "32px",
                    }}
                  >
                    {percentTwoDecimalPlace(
                      selectedQuarterDetailedPerformance.sharpeRatio,
                    )}
                  </Text>
                </Box>
              </GridItem>
            </Grid>

            <Grid
              templateColumns="repeat(2, 1fr)"
              gap={{ base: "10px", sm: "6", md: "6" }}
              paddingBottom={{ base: "15px", xl: "40px" }}
              paddingTop={{ base: "0", md: "15px", xl: "40px" }}
            >
              <GridItem
                paddingBottom="20px"
                position="relative"
                p={{ base: "0 0 20", sm: "0 0 20" }}
                borderRight="1px solid #4d4d4d"
              >
                <Box
                  _after={{
                    content: '""',
                    borderBottom: "1px solid #4d4d4d",
                    position: "absolute",
                    display: "block",
                    width: "95%",
                    height: "1px",
                    bottom: "-9px",
                  }}
                >
                  <Text
                    color="gray.400"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "32px",
                    }}
                  >
                    {t("labels.riskVolatility")}
                  </Text>
                  <Text
                    fontSize={{ base: "16px", md: "26px" }}
                    color="white"
                    fontWeight="thin"
                    marginTop="15px"
                    style={{
                      textAlign: lang.includes("ar") ? "right" : "left",
                    }}
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "33px",
                    }}
                  >
                    {percentTwoDecimalPlace(
                      selectedQuarterDetailedPerformance.riskVolatility,
                    )}
                    %
                  </Text>
                </Box>
              </GridItem>
              <GridItem
                position="relative"
                p={{ base: "0 0 20", sm: "0 0 20", xl: "20px" }}
              >
                <Box
                  _after={{
                    base: {
                      content: '""',
                      borderBottom: "1px solid #4d4d4d",
                      position: "absolute",
                      display: "block",
                      width: "90%",
                      left: "0",
                      height: "1px",
                      bottom: "-9px",
                    },
                    sm: {
                      width: "95%",
                      left: "-5px",
                      borderBottom: "1px solid #4d4d4d",
                    },
                    xl: { borderBottom: "0px" },
                  }}
                >
                  <Text
                    color="gray.400"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "32px",
                    }}
                  >
                    {t("labels.annualized")}
                  </Text>
                  <Text
                    fontSize={{ base: "16px", md: "26px" }}
                    color="white"
                    fontWeight="thin"
                    marginTop="15px"
                    style={{
                      textAlign: lang.includes("ar") ? "right" : "left",
                    }}
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "32px",
                    }}
                    dir="ltr"
                  >
                    {selectedQuarterDetailedPerformance.annualizedPerformance <
                    0
                      ? "-"
                      : ""}
                    {percentTwoDecimalPlace(
                      selectedQuarterDetailedPerformance.annualizedPerformance,
                    )}
                    %
                  </Text>
                </Box>
              </GridItem>
            </Grid>

            <Grid
              templateColumns="repeat(1, 1fr)"
              gap={{ base: "10px", sm: "6", md: "6" }}
              paddingBottom={{ base: "15px", xl: "40px" }}
              paddingTop={{ base: "0", md: "15px", xl: "40px" }}
            >
              <GridItem
                paddingBottom="20px"
                p={{ base: "0 0 20", sm: "0 0 20" }}
                borderRight={{
                  base: "0px",
                  sm: "0px",
                  xl: "1px solid #4d4d4d",
                }}
                position="relative"
              >
                <Box>
                  <Text
                    color="gray.400"
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight="700"
                    marginTop="20px"
                    marginLeft={{
                      base: "0px",
                      xl: lang.includes("ar") ? "0" : "28px",
                    }}
                  >
                    {t("labels.additions")}
                  </Text>
                  <Flex
                    color="white"
                    fontSize={{ base: "16px", md: "26px" }}
                    fontWeight="thin"
                    marginTop="20px"
                    flexFlow="row wrap"
                    dir="ltr"
                    style={{
                      justifyContent: lang.includes("ar")
                        ? "flex-end"
                        : "flex-start",
                    }}
                  >
                    <Text fontSize="inherit" fontWeight="400">
                      {absoluteConvertCurrencyWithDollar(
                        selectedQuarterDetailedPerformance.additions,
                      ) || "$0"}
                    </Text>
                  </Flex>
                </Box>
              </GridItem>
            </Grid>
          </>
        ) : (
          false
        )}
        {selectedQuarterMonthlyPerformance.length ? (
          <>
            <Hide below="md">
              <Box mt="64px">
                <Flex
                  justifyContent="flex-end"
                  display={{ base: "none", lgp: "flex" }}
                  mb="16px"
                >
                  <DownloadButton onDownloadClick={downloadTableDataInExcel} />
                </Flex>
                <Box>
                  <Grid
                    templateColumns="repeat(5, 1fr)"
                    px="16px"
                    pb="16px"
                    color="gray.500"
                    alignItems="end"
                  >
                    <GridItem>
                      <Text
                        color="contrast.200"
                        fontWeight="400"
                        fontSize="14px"
                        ms="-16px"
                      >
                        <Box as="span">
                          {t(
                            `monthlyPerformanceTable.header.${
                              selectedQuarterMonthlyPerformance[0].period.month
                                ? "monthlyPerformance"
                                : "yearlyPerformance"
                            }`,
                          )}
                        </Box>
                      </Text>
                    </GridItem>
                    <GridItem textAlign={lang.includes("ar") ? "start" : "end"}>
                      <Text color="gray.400" fontWeight="400" fontSize="14px">
                        {t(
                          "monthlyPerformanceTable.header.additionsWithdrawals",
                        )}
                      </Text>
                    </GridItem>
                    <GridItem textAlign={lang.includes("ar") ? "start" : "end"}>
                      <Text color="gray.400" fontWeight="400" fontSize="14px">
                        {t("monthlyPerformanceTable.header.netChange")}
                      </Text>
                    </GridItem>
                    <GridItem textAlign="end">
                      <Text color="gray.400" fontWeight="400" fontSize="14px">
                        {t("monthlyPerformanceTable.header.performance")}
                      </Text>
                    </GridItem>
                    <GridItem textAlign="end">
                      <Text color="gray.400" fontWeight="400" fontSize="14px">
                        {t("monthlyPerformanceTable.header.cumulPerformance")}
                      </Text>
                    </GridItem>
                  </Grid>
                </Box>
                <Box>
                  {selectedQuarterMonthlyPerformance.map(
                    (
                      {
                        additionsOrWithdrawels,
                        netChange,
                        performance,
                        cumulativePerformancePercent,
                        period,
                        cumulativePerformanceValue,
                      },
                      i,
                    ) => (
                      <Grid
                        p="16px"
                        key={i}
                        bg="gray.800"
                        color="contrast.200"
                        fontSize={14}
                        fontWeight={400}
                        fontStyle="normal"
                        templateColumns="repeat(5, 1fr)"
                        _even={{ backgroundColor: "gray.850" }}
                        mb="2px"
                        alignItems="center"
                      >
                        <GridItem w="115%">
                          <Text fontWeight="400" fontSize="14px">
                            <Box
                              as="span"
                              d="inline-block"
                              minW={{
                                lgp: period.month
                                  ? lang.includes("ar")
                                    ? "68px"
                                    : "75px"
                                  : lang.includes("ar")
                                  ? "42px"
                                  : "45px",
                              }}
                            >
                              {period.month
                                ? `${getShortMonth(period?.month)} ${
                                    period?.year
                                  }`
                                : period.year}
                            </Box>
                            <Hide below="lgp">
                              <Box
                                as="span"
                                backgroundColor="gray.700"
                                d="inline-block"
                                w="1px"
                                h="14px"
                                position="relative"
                                top="2px"
                                me="10px"
                              />
                            </Hide>
                            <Show below="lgp">
                              <br />
                            </Show>
                            <Box
                              as="span"
                              d="inline-block"
                              dir="ltr"
                              fontWeight={700}
                            >
                              {absoluteConvertCurrencyWithDollar(
                                cumulativePerformanceValue,
                              ) || "$0"}
                            </Box>
                          </Text>
                        </GridItem>
                        <GridItem textAlign="end">
                          <Text dir="ltr">
                            {absoluteConvertCurrencyWithDollar(
                              additionsOrWithdrawels,
                            ) || "$0"}
                          </Text>
                        </GridItem>
                        <GridItem textAlign="end">
                          <Text dir="ltr">
                            {absoluteConvertCurrencyWithDollar(netChange) ||
                              "$0"}
                          </Text>
                        </GridItem>
                        <GridItem
                          textAlign={lang.includes("ar") ? "start" : "end"}
                        >
                          <Text dir="ltr">
                            {roundValueWithoutAbsolute(performance) || 0}%
                          </Text>
                        </GridItem>
                        <GridItem
                          textAlign={lang.includes("ar") ? "start" : "end"}
                        >
                          <Text dir="ltr">
                            {roundValueWithoutAbsolute(
                              cumulativePerformancePercent,
                            ) || 0}
                            %
                          </Text>
                        </GridItem>
                      </Grid>
                    ),
                  )}
                </Box>
              </Box>
            </Hide>
            <Show below="md">
              <Center px="24px" py="24px" pr="0px" pl="0px">
                <Divider orientation="horizontal" color="gray.800" />
              </Center>
              <Box color="contrast.200">
                <Text
                  color="contrast.200"
                  fontWeight="400"
                  fontSize="14px"
                  mb="2"
                >
                  <Box as="span">
                    {t(
                      `monthlyPerformanceTable.header.${
                        selectedQuarterMonthlyPerformance[0].period.month
                          ? "monthlyPerformance"
                          : "yearlyPerformance"
                      }`,
                    )}
                  </Box>
                </Text>
                {selectedQuarterMonthlyPerformance.map(
                  (
                    {
                      additionsOrWithdrawels,
                      netChange,
                      performance,
                      cumulativePerformancePercent,
                      period,
                      cumulativePerformanceValue,
                    },
                    i,
                  ) => (
                    <Box
                      key={i}
                      p="16px"
                      bg="gray.800"
                      mb="2px"
                      _even={{ backgroundColor: "gray.850" }}
                    >
                      <Text
                        textAlign="center"
                        pb="24px"
                        fontSize="14px"
                        color="contrast.200"
                        fontWeight="700"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Box as="span" lineHeight="1.2">
                          {getShortMonth(period?.month)} {period?.year}
                        </Box>
                        <Box
                          as="span"
                          backgroundColor="gray.700"
                          d="inline-block"
                          w="1px"
                          h="14px"
                          position="relative"
                          top={lang.includes("ar") ? "-1px" : "1px"}
                          mx="10px"
                        />
                        <Box as="span" lineHeight="1.2">
                          {absoluteConvertCurrencyWithDollar(
                            cumulativePerformanceValue,
                          ) || "$0"}
                        </Box>
                      </Text>
                      <Box>
                        <Flex pb="24px" fontSize="14px" fontWeight="400">
                          <Box color="gray.500">
                            {t(
                              "monthlyPerformanceTable.header.additionsWithdrawals",
                            )}
                          </Box>
                          <Spacer />
                          <Box dir="ltr" color="contrast.200">
                            {absoluteConvertCurrencyWithDollar(
                              additionsOrWithdrawels,
                            ) || "$0"}
                          </Box>
                        </Flex>
                        <Flex pb="24px" fontSize="14px" fontWeight="400">
                          <Box color="gray.500">
                            {t("monthlyPerformanceTable.header.netChange")}
                          </Box>
                          <Spacer />
                          <Box dir="ltr" color="contrast.200">
                            {absoluteConvertCurrencyWithDollar(netChange) ||
                              "$0"}
                          </Box>
                        </Flex>
                        <Flex pb="24px" fontSize="14px" fontWeight="400">
                          <Box color="gray.500">
                            {t("monthlyPerformanceTable.header.performance")}
                          </Box>
                          <Spacer />
                          <Box dir="ltr" color="contrast.200">
                            {" "}
                            {roundValueWithoutAbsolute(performance) || 0}%
                          </Box>
                        </Flex>
                        <Flex fontSize="14px" fontWeight="400">
                          <Box color="gray.500">
                            {t(
                              "monthlyPerformanceTable.header.cumulPerformance",
                            )}
                          </Box>
                          <Spacer />
                          <Box dir="ltr" color="contrast.200">
                            {roundValueWithoutAbsolute(
                              cumulativePerformancePercent,
                            ) || 0}
                            %
                          </Box>
                        </Flex>
                      </Box>
                    </Box>
                  ),
                )}
              </Box>
            </Show>
          </>
        ) : (
          false
        )}
      </Box>
    </>
  )
}
