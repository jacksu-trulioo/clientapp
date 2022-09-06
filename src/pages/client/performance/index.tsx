import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { Box, Flex, Show, Text, useDisclosure } from "@chakra-ui/react"
import ky from "ky"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR from "swr"

import {
  Card,
  CardContent,
  ClientLayout,
  DetailedPerformanceStats,
  FeedbackModal,
  ModalBox,
  PageContainer,
  PerformanceChart,
  PolygonDownIcon,
  PolygonIcon,
  QuarterTabs,
  StepsWithTitle,
  TopMovers,
} from "~/components"
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import { MyTfoClient } from "~/services/mytfo"
import {
  FeedbackSubmissionScreen,
  OptionsProps,
  PerformanceDetails,
} from "~/services/mytfo/types"
import {
  formatShortDate,
  getQuarterDate,
} from "~/utils/clientUtils/dateUtility"
import { getPerformanceData } from "~/utils/clientUtils/detailedPerformance"
import {
  getFeedbackCookieStatus,
  setFeedbackCookieStatus,
} from "~/utils/clientUtils/feedbackCookieUtilities"
import {
  percentTwoDecimalPlace,
  roundCurrencyValue,
} from "~/utils/clientUtils/globalUtilities"
import { downloadBlob } from "~/utils/downloadBlob"
import { errorHandler } from "~/utils/errorHandler"
import { downloadedExcel, screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type TopMover = {
  valuationProgress: number
  deals: DealData[]
}

type DealData = {
  name: string
  performanceObj: {
    direction: string
    percent: number
  }
  id: number
}

type PerformanceProps = {
  performanceDetail: QuarterData[]
  errorrResponse?: { statusCode: number; message: string }
  accountSummarydata: {
    accountCreationDate: string
    lastValuationDate: string
  }
}

type QuarterData = {
  detailedPerformance: {
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
  monthlyPerformance: []
  performanceChartData: ChartDataType
  year: number
  quarter: number | string
  valuationProgress: number
}

type ChartDataType = {
  months: string[]
  cumulativeData: []
  periodicData: []
  minMaxValue: {
    max: number
    min: number
  }
}

type TimePeriodType = {
  quarter: number | string
  year: number
}

type DatesObj = {
  fromDate: string
  toDate: string
}

const Performance = ({
  performanceDetail,
  accountSummarydata,
  errorrResponse,
}: PerformanceProps) => {
  const { t, lang } = useTranslation("performance")
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [error, setError] = useState(true)
  const [selectedData, setSelectedData] = useState(
    !errorrResponse ? performanceDetail[performanceDetail.length - 1] : null,
  )
  const [selectedQuarter, setSelectedQuarter] = useState(
    !errorrResponse
      ? performanceDetail[performanceDetail.length - 1].quarter
      : null,
  )
  const [timePeriod, setTimePeriod] = useState<OptionsProps[]>([])
  const { user } = useUser()
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()

  const [ITDData] = useState(
    performanceDetail?.find((data) => {
      return data.quarter == "ITD"
    }),
  )

  useEffect(() => {
    if (errorrResponse && !performanceDetail && !accountSummarydata) {
      setError(true)
    }
    setIsPageLoading(false)
  }, [performanceDetail, accountSummarydata])

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Performance",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  useEffect(() => {
    if (!errorrResponse) {
      var timePeriodArray: OptionsProps[] = []
      performanceDetail.forEach(({ quarter, year }: TimePeriodType) => {
        if (quarter != "ITD") {
          timePeriodArray.push({
            value: `${quarter}`,
            label: `${t(`common:client.quarters.quarter_${quarter}`)} ${year}`,
          })
        }
      })
      if (
        performanceDetail.find(({ quarter }: TimePeriodType) => {
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
    }
  }, [])

  const { data: deals } = useSWR<TopMover>(
    selectedData?.quarter != "ITD" && !errorrResponse
      ? `/api/client/performance/get-top-deals?year=${selectedData?.year}&quarter=${selectedData?.quarter}`
      : "",
  )

  const changeActiveFilter = (value: string | number) => {
    var findData = performanceDetail.find((data) => {
      return data.quarter == value
    })
    if (findData) {
      setSelectedQuarter(findData.quarter)
      setSelectedData(findData)
    }
  }

  const rendeSubTitle = () => {
    var getDates: DatesObj

    if (selectedData?.quarter == "ITD") {
      getDates = {
        fromDate: formatShortDate(
          accountSummarydata?.accountCreationDate,
          lang,
        ),
        toDate: formatShortDate(accountSummarydata?.lastValuationDate, lang),
      }
    } else {
      var quarterDates = getQuarterDate(
        selectedData?.quarter as number,
        selectedData?.year || 0,
      )

      let differenceChecker = moment(
        accountSummarydata?.lastValuationDate,
      ).diff(moment(quarterDates?.toDate), "days")

      getDates = {
        fromDate: formatShortDate(quarterDates?.fromDate as string, lang),
        toDate:
          differenceChecker < 0
            ? formatShortDate(accountSummarydata.lastValuationDate, lang)
            : formatShortDate(quarterDates?.toDate as string, lang),
      }
    }

    return t(`description`, {
      fromDate: getDates.fromDate,
      toDate: getDates.toDate,
    })
  }

  const downloadTableDataInExcel = async () => {
    let response = await ky.post("/api/client/generate-excel-file", {
      json: {
        type: "performance",
        quarter: selectedQuarter,
      },
    })
    let fileData = await response.blob()
    let fileName = `${user?.mandateId}-Performance`
    downloadBlob(window.URL.createObjectURL(fileData), fileName)
    clientEvent(
      downloadedExcel,
      "Performance",
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
    <ClientLayout title={t(`page.title`)} description={t(`page.description`)}>
      {error && !performanceDetail && !accountSummarydata && !isPageLoading ? (
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
          <Fragment>
            <Box>
              <Text
                fontSize="30px"
                pb="8px"
                color="contrast.200"
                fontWeight="400"
                lineHeight="120%"
                mt={{ base: "20px", md: "20px", lgp: "0" }}
              >
                {t("heading")}
              </Text>
            </Box>
            <Box>
              <Text fontSize="18px" color="gray.400" fontWeight="400">
                {rendeSubTitle()}
              </Text>
            </Box>
            <Box mt="40px" mb={{ base: "16px", md: "40px" }}>
              <Box
                d={{ base: "block", md: "flex" }}
                justifyContent="space-between"
                alignItems="center"
                w={{
                  base: lang === "ar" ? "97%" : "100%",
                  md: lang === "ar" ? "99%" : "100%",
                  lgp: "auto",
                }}
              >
                <Box
                  maxW={{ base: "100%", lgp: "270px" }}
                  w={{ base: "100%", md: "70%", lgp: "35%" }}
                  me={{ base: "8px", md: "0", lgp: "0" }}
                  mb={{ base: "16px", md: "0" }}
                >
                  {deals?.deals?.length && selectedData?.quarter != "ITD" ? (
                    <StepsWithTitle
                      Process={`${Math.round(deals?.valuationProgress || 0)}`}
                      Title={t("labels.ofInvestment")}
                    />
                  ) : (
                    false
                  )}
                </Box>
                <Box w={{ lgp: "auto" }}>
                  <Show above="lgp">
                    <Flex justifyContent="space-between" ml="72px">
                      <QuarterTabs
                        changeActiveFilter={changeActiveFilter}
                        activeOption={selectedData?.quarter}
                        options={timePeriod}
                        viewType="desktop"
                      />
                    </Flex>
                  </Show>
                  <Show below="lgp">
                    <QuarterTabs
                      changeActiveFilter={changeActiveFilter}
                      activeOption={selectedData?.quarter}
                      options={timePeriod}
                      viewType="mobile"
                    />
                  </Show>
                </Box>
              </Box>
            </Box>

            {selectedData ? (
              <Card
                bg="linear-gradient(270deg, var(--chakra-colors-gray-850) 16.67%, var(--chakra-colors-gray-800) 50.52%, var(--chakra-colors-gray-850) 81.77%)"
                p={{ base: "2", md: "5" }}
              >
                <Box pt="5" pl="5">
                  <Box
                    as="header"
                    fontWeight="400"
                    fontSize="18px"
                    color="#fff"
                  >
                    {t("labels.overallPerformance")}
                    <Box
                      as="span"
                      fontWeight="400"
                      fontSize="14px"
                      color="#b99855"
                      marginLeft={{ base: "0", lgp: "8px", md: "8px" }}
                      display={{
                        base: "block",
                        lgp: "inline-block",
                        md: "inline-block",
                      }}
                      mt={{ base: "4px", md: "0" }}
                    >
                      {t("labels.inceptionToDate")}
                    </Box>
                  </Box>
                  {ITDData ? (
                    <Box>
                      <Box
                        as="header"
                        fontSize="30px"
                        margin="20px 0"
                        fontWeight="400"
                        style={{
                          color:
                            ITDData?.detailedPerformance?.netChangeValue
                              ?.direction == "downwards"
                              ? "rgb(199, 61, 61)"
                              : "#B5E361",
                        }}
                      >
                        <Box
                          as="span"
                          style={{
                            marginRight: lang.includes("ar") ? "0px" : "15px",
                            marginLeft: lang.includes("ar") ? "15px" : "0px",
                          }}
                        >
                          $
                          {roundCurrencyValue(
                            Math.abs(
                              ITDData.detailedPerformance?.netChangeValue
                                ?.money,
                            ),
                          )}
                        </Box>

                        <Box
                          as="span"
                          fontSize="20px"
                          fontWeight="400"
                          alignItems="center"
                          style={{
                            color:
                              ITDData?.detailedPerformance?.netChangePercent
                                ?.direction == "downwards"
                                ? "rgb(199, 61, 61)"
                                : "#B5E361",

                            display: "inline-flex",
                            direction: "ltr",
                          }}
                        >
                          {ITDData.detailedPerformance?.netChangePercent
                            ?.direction == "downwards" ? (
                            <PolygonDownIcon
                              width={"13.33px"}
                              height={"10px"}
                              style={{
                                marginRight: "4px",
                              }}
                            />
                          ) : (
                            <PolygonIcon
                              width={"13.33px"}
                              height={"10px"}
                              style={{
                                marginRight: "4px",
                              }}
                            />
                          )}
                          <Box display="contents">
                            {percentTwoDecimalPlace(
                              ITDData.detailedPerformance?.netChangePercent
                                ?.percent,
                            )}
                            %
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    false
                  )}
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
                    {t("labels.cumulativePerformance")}
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
                      backgroundColor="rgb(191, 197, 244)"
                      borderRadius="50%"
                      mr="8px"
                    ></Box>
                    {t("labels.periodPerformance")}
                  </Box>
                </Box>
                <CardContent p="0">
                  <Box
                    h="full"
                    ml={{ base: "0", md: "8", lgp: "8" }}
                    zIndex="1"
                  >
                    <PerformanceChart
                      chartData={selectedData.performanceChartData}
                    />
                  </Box>
                </CardContent>
              </Card>
            ) : (
              false
            )}

            {selectedData ? (
              <DetailedPerformanceStats
                selectedQuarterDetailedPerformance={
                  selectedData.detailedPerformance
                }
                selectedQuarterMonthlyPerformance={
                  selectedData.monthlyPerformance
                }
                selectedQuarter={selectedData.quarter}
                downloadTableDataInExcel={downloadTableDataInExcel}
              />
            ) : (
              false
            )}

            {deals?.deals?.length && selectedData?.quarter != "ITD" ? (
              <TopMovers deals={deals?.deals} />
            ) : (
              false
            )}
          </Fragment>
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

export default Performance

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const sesison = getSession(ctx.req, ctx.res)
    if (sesison?.mandateId) {
      try {
        const client = new MyTfoClient(ctx.req, ctx.res, {
          authRequired: true,
          msType: "maverick",
        })
        const data = await client.clientPerformance.getPerformanceDetails()
        let filteredDetailedPerformanceJSON = await getPerformanceData(
          data as PerformanceDetails,
          ctx?.locale || "en",
        )
        filteredDetailedPerformanceJSON = JSON.stringify(
          filteredDetailedPerformanceJSON,
        )

        const accountSummarydata =
          await client.clientAccount.getAccountSummaries()

        return {
          props: {
            performanceDetail: JSON.parse(
              filteredDetailedPerformanceJSON as string,
            ),
            accountSummarydata,
          },
        }
      } catch (error) {
        let errorrResponse = await errorHandler(error)
        return {
          props: {
            errorrResponse,
          },
        }
      }
    }
    return {
      notFound: true,
    }
  },
})
