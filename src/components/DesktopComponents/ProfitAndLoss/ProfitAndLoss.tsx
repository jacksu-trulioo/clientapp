import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Hide,
  Show,
  Text,
  useMediaQuery,
} from "@chakra-ui/react"
import moment from "moment"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useState } from "react"

import {
  DesktopMultiRowTable,
  DownloadButton,
  PolygonDownIcon,
  PolygonIcon,
  QuarterTabs,
  ResponsiveTable,
} from "~/components"
import {
  formatShortDate,
  getQuarterDate,
} from "~/utils/clientUtils/dateUtility"
import {
  absoluteConvertCurrencyWithDollar,
  percentTwoDecimalPlace,
  roundCurrencyValue,
  roundValueWithoutAbsolute,
} from "~/utils/clientUtils/globalUtilities"

type ProfitAndLossProps = {
  profitAndLossData: {
    profitLoss: ProfitLossType[]
    isCRRExists: boolean
    crrData: {
      illiquidMaximumDrawdown: number
      msciWorldIndexDrawdown: number
    }
  }
  lastValuationDate: {
    lastValuationDate: string
    accountCreated: string
  }
  downloadTableDataInExcel: Function
}

type ProfitLossType = {
  quarter: number | string
  year: number
  timeperiod: {
    year?: number
    quarter?: number
    toDate?: string
    quarterDate?: string
  }
  summary: {
    results: [
      {
        result: string
        value: {
          money: number
          direction: string
        }
        percentChange: {
          percent: number
          direction: string
        }
      },
    ]
    totalChange: {
      value: {
        money: number
        direction: string
      }
      percentChange: {
        percent: number
        direction: string
      }
    }
  }
  results: [
    {
      holdingType: string
      results: [
        {
          result: string
          value: {
            money: number
            direction: string
          }
          percentChange: {
            percent: number
            direction: string
          }
        },
      ]
    },
  ]
}

type DatesObj = {
  fromDate: string
  toDate: string
}

type OptionsProps = {
  value: number | string
  label: string
}

export default function ProfitAndLoss({
  profitAndLossData,
  lastValuationDate,
  downloadTableDataInExcel,
}: ProfitAndLossProps) {
  const { t, lang } = useTranslation("profitAndLoss")
  const [selectedQuarter, setSelectedQuarter] = useState(
    profitAndLossData?.profitLoss[profitAndLossData.profitLoss.length - 1]
      .quarter,
  )
  const [selectedData, setSelectedData] = useState(
    profitAndLossData?.profitLoss[profitAndLossData.profitLoss.length - 1],
  )

  const [timePeriod, setTimePeriod] = useState<OptionsProps[]>([])

  const [isBetweenThis] = useMediaQuery(
    "(min-width: 480px) and (max-width: 645px)",
  )

  useEffect(() => {
    var timePeriodArray: OptionsProps[] = []
    profitAndLossData?.profitLoss.map(({ quarter, year }: ProfitLossType) => {
      if (quarter != "ITD") {
        timePeriodArray.push({
          value: `${quarter}`,
          label: `${t(`common:client.quarters.quarter_${quarter}`)} ${year}`,
        })
      }
    })
    if (
      profitAndLossData?.profitLoss.find(({ quarter }: ProfitLossType) => {
        return quarter == "ITD"
      })
    ) {
      timePeriodArray.push({
        value: "ITD",
        label: t("common:client.quarters.ITD"),
      })
    }
    if (timePeriodArray.length) {
      setTimePeriod([...timePeriodArray])
    }
  }, [])

  const changeActiveFilter = (value: string | number) => {
    var findData = profitAndLossData.profitLoss.find(
      ({ quarter }: ProfitLossType) => {
        return quarter == value
      },
    )

    if (findData) {
      setSelectedQuarter(findData.quarter)
      setSelectedData(findData)
    }
  }

  const rendeSubTitle = () => {
    var getDates: DatesObj

    if (selectedData?.quarter == "ITD") {
      getDates = {
        fromDate: formatShortDate(lastValuationDate.accountCreated, lang),
        toDate: formatShortDate(lastValuationDate.lastValuationDate, lang),
      }
    } else {
      var quarterDates = getQuarterDate(
        selectedData.quarter as number,
        selectedData.year,
      )

      var differenceChecker = moment(lastValuationDate.lastValuationDate).diff(
        moment(quarterDates?.toDate),
        "days",
      )

      getDates = {
        fromDate: formatShortDate(quarterDates?.fromDate as string, lang),
        toDate:
          differenceChecker < 0
            ? formatShortDate(
                lastValuationDate.lastValuationDate as string,
                lang,
              )
            : formatShortDate(quarterDates?.toDate as string, lang),
      }
    }

    return t(`description`, {
      fromDate: getDates.fromDate,
      toDate: getDates.toDate,
    })
  }

  const downloadExcel = () => {
    downloadTableDataInExcel(selectedQuarter)
  }

  return (
    <Box>
      <Flex
        flexDir={{ base: "column", md: "column", lgp: "row" }}
        alignItems="baseline"
        justifyContent="space-between"
      >
        <Box mb={{ base: "30px", lgp: "0" }} pr={{ base: "0", lgp: "55px" }}>
          <Heading fontWeight="400" fontSize="30px" color="white" mb="8px">
            {t("heading")}
          </Heading>
          <Text
            color="gray.400"
            whiteSpace={{ md: "initial", base: "pre-line" }}
            fontWeight="400"
            fontSize="18px"
          >
            {rendeSubTitle()}
          </Text>
        </Box>
        <Box
          w={{ base: "100%", lgp: "auto" }}
          p={{ base: "0", md: "25px 0 0" }}
        >
          <Box>
            <Heading
              fontSize="18px"
              fontWeight="700"
              color="gray.500"
              ml={{
                base: "11px",
                md: "0",
                lgp: lang.includes("ar") ? "0px" : "22px",
              }}
              mb="4px"
            >
              {t("labels.netChange")}
            </Heading>
          </Box>
          <Flex
            justify={{ base: "flex-start", md: "flex-start", lgp: "flex-end" }}
            ml={{
              base: "11px",
              md: "0px",
              lgp: "0px",
            }}
          >
            <Text
              color={
                selectedData.summary.totalChange?.value?.direction ==
                "downwards"
                  ? "red.500"
                  : "green.500"
              }
              fontSize={{ base: "26px", lgp: "36px", md: "30px" }}
              fontWeight="400"
              whiteSpace="nowrap"
              display="flex"
              mr={{ lgp: "28px", base: "20px" }}
              style={{ direction: "ltr" }}
            >
              <Text> $</Text>
              {roundCurrencyValue(
                Math.abs(selectedData.summary.totalChange?.value?.money),
              )}
            </Text>

            <Box>
              <Flex flexDir="row" align="center" style={{ direction: "ltr" }}>
                {selectedData.summary.totalChange?.percentChange?.direction ===
                "downwards" ? (
                  <PolygonDownIcon
                    width={"16px"}
                    height={"12px"}
                    direction="bottom"
                  />
                ) : (
                  <PolygonIcon
                    width={"16px"}
                    height={"12px"}
                    direction="inherit"
                  />
                )}

                <Text
                  color={
                    selectedData.summary.totalChange?.percentChange
                      ?.direction === "downwards"
                      ? "red.500"
                      : "green.500"
                  }
                  fontSize={{
                    base: "26px",
                    lgp: "36px",
                    md: "30px",
                  }}
                  fontWeight="400"
                  ms="8px"
                >
                  {percentTwoDecimalPlace(
                    selectedData.summary.totalChange?.percentChange?.percent,
                  )}
                  %
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Flex>

      {profitAndLossData.isCRRExists ? (
        <Box margin="0px auto" mt="50px" maxWidth="900px">
          <Grid
            templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
            gap={{ base: "0", md: "3", lgp: "6" }}
            pos="relative"
            _after={{
              content: '""',
              display: { base: "none", sm: "block" },
              position: "absolute",
              height: "100%",
              width: "1px",
              insetStart: { sm: "50%", lgp: lang === "ar" ? "50%" : "47%" },
              top: "0",
              backgroundColor: "gray.700",
            }}
          >
            <GridItem w="100%">
              <Box
                borderTop={{ base: "1px", sm: "0" }}
                borderBottom={{ base: "1px", sm: "0" }}
                borderColor="gray.700"
                pl={{ base: "0", sm: "0px" }}
                pb={{ base: "24px", sm: "0" }}
                pt={{ base: "24px", sm: "0", lgp: "20px" }}
                p={{ lgp: "30px", xl: "30px", md: "30px 20px" }}
              >
                <Heading
                  fontSize={isBetweenThis ? "12px" : "18px"}
                  fontWeight="700"
                  color="gray.500"
                  ml={{
                    base: lang === "ar" ? "0" : "11px",
                    md: "0",
                    lgp: "0",
                  }}
                  mb="10px"
                >
                  {t(`drawDown.title`)}
                </Heading>
                <Flex
                  style={{
                    justifyContent: lang.includes("ar") ? "start" : "flex-end",
                  }}
                  flexDirection={{ base: "row", md: "column", lgp: "column" }}
                  m={{
                    base: "10px 0",
                    md: "10px 0",
                    lgp: "0",
                  }}
                  alignItems={{ base: "center", md: "initial" }}
                >
                  <Text
                    fontSize="28px"
                    fontWeight="300"
                    color="white"
                    style={{
                      direction: "initial",
                      textAlign: lang.includes("ar") ? "end" : "start",
                    }}
                  >
                    {roundValueWithoutAbsolute(
                      profitAndLossData.crrData.illiquidMaximumDrawdown,
                    )}
                    %
                  </Text>
                  <Text
                    fontSize="14px"
                    fontWeight="400"
                    color="gray.500"
                    fontStyle="italic"
                    pl={{ base: "24px", lgp: "0", md: "0" }}
                    m={{
                      base: lang === "ar" ? "0" : "10px 0",
                      md: lang === "ar" ? "0" : "10px 0",
                      lgp: lang === "ar" ? "8px 0" : "8px 0 8px 0px",
                    }}
                    pr="5px"
                  >
                    {t(`drawDown.description`)}
                  </Text>
                </Flex>
              </Box>
            </GridItem>
            <GridItem w="100%">
              <Box
                pl={{ base: "0", sm: "30px" }}
                borderBottom={{ base: "1px", sm: "0" }}
                borderColor="gray.700"
                pb={{ base: "24px", sm: "0" }}
                pt={{ base: "24px", sm: "0" }}
                p={{
                  lgp: "30px",
                  xl: "30px",
                  md: "30px 20px",
                }}
              >
                <Heading
                  fontSize={isBetweenThis ? "12px" : "18px"}
                  fontWeight="700"
                  ml={{
                    base: lang === "ar" ? "0" : "11px",
                    md: "0",
                    lgp: "0",
                  }}
                  color="gray.500"
                  mb="10px"
                >
                  {t(`indexDrwadown.title`)}
                </Heading>
                <Flex
                  flexDirection={{ base: "row", md: "column", lgp: "column" }}
                  m={{
                    base: "10px 0",
                    md: "10px 0",
                    lgp: "0",
                  }}
                  alignItems={{ base: "center", md: "initial" }}
                >
                  <Text
                    fontSize="28px"
                    fontWeight="300"
                    color="white"
                    style={{
                      direction: "initial",
                      textAlign: lang.includes("ar") ? "end" : "start",
                    }}
                  >
                    {roundValueWithoutAbsolute(
                      profitAndLossData.crrData.msciWorldIndexDrawdown,
                    )}
                    %
                  </Text>
                  <Text
                    fontSize="14px"
                    fontWeight="400"
                    color="gray.500"
                    fontStyle="italic"
                    pr={{ base: "0", lgp: "0", md: "0" }}
                    pl={{ base: "24px", lgp: "0", md: "0" }}
                    m={{
                      base: lang === "ar" ? "0" : "10px 0",
                      md: lang === "ar" ? "0" : "10px 0",
                      lgp: lang === "ar" ? "8px 0" : "8px 0 8px 0px",
                    }}
                  >
                    {t(`indexDrwadown.description`)}
                  </Text>
                </Flex>
              </Box>
            </GridItem>
          </Grid>
        </Box>
      ) : (
        false
      )}

      <Box w={{ lgp: "80%" }} mt="50px" ml="auto">
        <Flex
          justifyContent="flex-end"
          space="34px"
          d={{ base: "none", md: "none", lgp: "flex" }}
        >
          <QuarterTabs
            changeActiveFilter={changeActiveFilter}
            activeOption={selectedData.quarter}
            options={timePeriod}
            viewType="desktop"
          />
        </Flex>
        <Show below="lgp">
          <QuarterTabs
            changeActiveFilter={changeActiveFilter}
            activeOption={selectedData.quarter}
            options={timePeriod}
            viewType="mobile"
          />
        </Show>
      </Box>

      <Hide below="lgp">
        <Box mt="60px">
          <Flex justifyContent="space-between" alignItems="center">
            <Text
              fontWeight="400"
              fontSize="14px"
              lineHeight="120%"
              color="contrast.200"
            >
              {t("assetClassTotal.title")}
            </Text>
            {selectedData?.summary.results ? (
              <Box display={{ base: "none", lgp: "block" }}>
                <DownloadButton onDownloadClick={downloadExcel} />
              </Box>
            ) : (
              false
            )}
          </Flex>
          <DesktopMultiRowTable
            isHeader
            isGrid
            tableGridSize={8}
            tableHeader={[
              {
                name: "",
                size: 6,
                style: {
                  textAlign: "left",
                  fontWeight: "400",
                  fontSize: "14px",
                  lineHeight: "120%",
                  color: "#C7C7C7",
                  paddingRight: "0",
                },
              },
              {
                name: t("table.header.total"),
                size: 1,
                style: {
                  textAlign: lang.includes("ar") ? "left" : "right",
                  fontWeight: "400",
                  fontSize: "14px",
                  lineHeight: "120%",
                  color: "#C7C7C7",
                  paddingRight: "0",
                },
              },
              {
                name: t("table.header.relative"),
                size: 1,
                style: {
                  textAlign: lang.includes("ar") ? "left" : "right",
                  fontWeight: "400",
                  fontSize: "14px",
                  lineHeight: "120%",
                  color: "#C7C7C7",
                  paddingRight: "10px",
                },
              },
            ]}
            tableBody={selectedData?.summary?.results.map((x) => {
              return {
                data: [
                  {
                    value: t(`table.body.${x.result}`),
                    size: 6,
                    style: {
                      textAlign: "left",
                      fontWeight: "400",
                      fontSize: "14px",
                      lineHeight: "120%",
                      color: "white",
                      paddingRight: "0",
                    },
                  },
                  {
                    value: `${
                      absoluteConvertCurrencyWithDollar(x.value.money) || "$0"
                    }`,
                    size: 1,
                    style: {
                      textAlign: lang.includes("ar") ? "left" : "right",
                      fontWeight: "400",
                      fontSize: "14px",
                      lineHeight: "120%",
                      color: "white",
                      paddingRight: "0",
                    },
                  },

                  {
                    value: `${percentTwoDecimalPlace(
                      x.percentChange.percent,
                    )}%`,
                    size: 1,
                    isArrow: true,
                    arrowType: x.percentChange.direction,
                    style: {
                      textAlign: lang.includes("ar") ? "left" : "end",
                      fontWeight: "400",
                      fontSize: "14px",
                      lineHeight: "120%",
                      isArrow: true,
                      arrowType: x.percentChange.direction,
                      color:
                        x.percentChange.direction == "upwards"
                          ? "green.500"
                          : x.percentChange.direction == "downwards"
                          ? "red.500"
                          : "#fff",

                      paddingRight: "10px",
                    },
                  },
                ],
              }
            })}
          />
        </Box>
      </Hide>

      <Show below="lgp">
        <Box mt={{ base: "16px", lgp: "60px" }}>
          <Flex justifyContent="space-between" alignItems="center" mb="20px">
            <Text
              fontWeight="400"
              fontSize="14px"
              lineHeight="120%"
              color="contrast.200"
            >
              {t("assetClassTotal.title")}
            </Text>
          </Flex>
          {selectedData?.summary.results.map((x, i) => (
            <ResponsiveTable
              key={i}
              header={t(`table.body.${x.result}`)}
              isHeader
              tableItem={[
                {
                  key: t("table.header.total"),
                  style: {
                    color: "#aaa",
                    fontSize: "14px",
                    fontWeight: "400",
                    lineHeight: "120%",
                  },

                  value: `${
                    absoluteConvertCurrencyWithDollar(x.value.money) || "$0"
                  }`,
                  valueStyle: {
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "400",
                    lineHeight: "120%",
                  },
                },
                {
                  key: t("table.header.relative"),
                  isArrow: true,
                  arrowType: x.percentChange.direction,
                  style: {
                    color: "#aaa",
                    fontSize: "14px",
                    fontWeight: "400",
                    lineHeight: "120%",
                  },
                  value: `${percentTwoDecimalPlace(x.percentChange.percent)}%`,
                  valueStyle: {
                    color:
                      x.percentChange.direction == "upwards"
                        ? "green.500"
                        : x.percentChange.direction == "downwards"
                        ? "red.500"
                        : "#fff",
                    fontSize: "14px",
                    fontWeight: "400",
                    lineHeight: "120%",
                  },
                },
              ]}
            />
          ))}
        </Box>
      </Show>

      <Hide below="lgp">
        <Box mt="60px">
          <Text
            fontWeight="400"
            fontSize="14px"
            lineHeight="120%"
            color="contrast.200"
          >
            {t("investAssetClass.title")}
          </Text>

          {selectedData?.results.map((item) => (
            <>
              <Text
                fontWeight="400"
                fontSize="14px"
                lineHeight="120%"
                color="contrast.200"
                mt="40px"
              >
                {t(`common:client.assetClasses.${item.holdingType}`)}
              </Text>
              <DesktopMultiRowTable
                isGrid
                isHeader
                tableHeader={[
                  {
                    name: "",
                    size: 6,
                    style: {
                      textAlign: "left",
                      fontWeight: "400",
                      fontSize: "14px",
                      lineHeight: "120%",
                      color: "#C7C7C7",
                      paddingRight: "0",
                    },
                  },
                  {
                    name: t("table.header.total"),
                    size: 1,
                    style: {
                      textAlign: lang.includes("ar") ? "left" : "right",
                      fontWeight: "400",
                      fontSize: "14px",
                      lineHeight: "120%",
                      color: "#C7C7C7",
                      paddingRight: "0",
                    },
                  },
                  {
                    name: t("table.header.relative"),
                    size: 1,
                    style: {
                      textAlign: lang.includes("ar") ? "left" : "right",
                      fontWeight: "400",
                      fontSize: "14px",
                      lineHeight: "120%",
                      color: "#C7C7C7",
                      paddingRight: "10px",
                    },
                  },
                ]}
                tableGridSize={8}
                tableBody={item.results?.map((resultItem) => {
                  return {
                    data: [
                      {
                        value: t(`table.body.${resultItem.result}`),
                        size: 6,
                        style: {
                          textAlign: "left",
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "120%",
                          color: "white",
                          paddingRight: "0",
                        },
                      },
                      {
                        value: `${
                          absoluteConvertCurrencyWithDollar(
                            resultItem.value.money,
                          ) || "$0"
                        }`,
                        size: 1,
                        style: {
                          textAlign: lang.includes("ar") ? "left" : "right",
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "120%",
                          color: "white",
                          paddingRight: "0",
                        },
                      },

                      {
                        value: `${percentTwoDecimalPlace(
                          resultItem.percentChange.percent,
                        )}%`,
                        size: 1,
                        isArrow: true,
                        arrowType: resultItem.percentChange.direction,
                        style: {
                          textAlign: "end",
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "120%",
                          color:
                            resultItem.percentChange.direction == "upwards"
                              ? "green.500"
                              : resultItem.percentChange.direction ==
                                "downwards"
                              ? "red.500"
                              : "#fff",
                          paddingRight: "10px",
                        },
                      },
                    ],
                  }
                })}
              />
            </>
          ))}
        </Box>
      </Hide>

      <Show below="lgp">
        <Box mt="60px">
          <Text
            fontWeight="400"
            fontSize="14px"
            lineHeight="120%"
            color="contrast.200"
          >
            {t("investAssetClass.title")}
          </Text>
          {selectedData?.results.map((item, z) => (
            <>
              <Text key={z} mt="24px" mb="16px">
                {t(`common:client.assetClasses.${item.holdingType}`)}
              </Text>
              {item.results?.map((resultItem, i) => (
                <ResponsiveTable
                  key={i}
                  header={t(`table.body.${resultItem.result}`)}
                  isHeader
                  tableItem={[
                    {
                      key: t("table.header.total"),
                      style: {
                        color: "#aaa",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "120%",
                      },
                      value: `${
                        absoluteConvertCurrencyWithDollar(
                          resultItem.value.money,
                        ) || "$0"
                      }`,
                      valueStyle: {
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "120%",
                      },
                    },
                    {
                      key: t("table.header.relative"),
                      style: {
                        color: "#aaa",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "120%",
                      },
                      isArrow: true,
                      arrowType: resultItem.percentChange.direction,
                      value: `${percentTwoDecimalPlace(
                        resultItem.percentChange.percent,
                      )}%`,
                      valueStyle: {
                        color:
                          resultItem.percentChange.direction == "upwards"
                            ? "green.500"
                            : resultItem.percentChange.direction == "downwards"
                            ? "red.500"
                            : "#fff",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "120%",
                      },
                    },
                  ]}
                />
              ))}
            </>
          ))}
        </Box>
      </Show>
    </Box>
  )
}
