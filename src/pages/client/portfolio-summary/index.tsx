import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import {
  Box,
  Button,
  Flex,
  Hide,
  Show,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import ky from "ky"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR from "swr"

import {
  AllocationChart,
  ClientLayout,
  CRRSynthesiaVideo,
  DownloadButton,
  FeedbackModal,
  InvestmentDealsTable,
  ModalBox,
  PageContainer,
  PortfolioOverview,
  QuarterTabs,
  RecentDealsCard,
  SkeletonCard,
  SummaryIlliquidInvestment,
} from "~/components"
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import {
  AccountSummaries,
  Deals,
  DistributionCapital,
  FeedbackSubmissionScreen,
} from "~/services/mytfo/types"
import { formatShortDate } from "~/utils/clientUtils/dateUtility"
import {
  getFeedbackCookieStatus,
  setFeedbackCookieStatus,
} from "~/utils/clientUtils/feedbackCookieUtilities"
import { downloadBlob } from "~/utils/downloadBlob"
import { downloadedExcel, screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type PortfolioSummaryProps = {
  recentDealActivityData: []
  mandate: string | number
  accountSummary: AccountSummaries
  synthesiaVideoURL: {
    url: string
    createdDate: string
  }
  portfolioOverviewDetails: {
    lastFourQuarters: []
    cashflowChartValues: []
    cashflowChartValuesCapitalCall: []
    cashFlowProjections: number
    profitLossChartValues: []
    profitLoss: {
      money: number
      direction: string
    }
    performanceChartValues: []
  }
  distributionCapital: DistributionCapital
  deals: Deals
  holdingDeals: []
}

type AllocationData = {
  allocationChartData: []
  assetTableData: AssetTableDataType[]
  isShowMoreData?: boolean
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

type RecentActivity = {
  month: number
  recentFunding: number
  moneyInvested: number
  distribution: {
    capitalGain: number
    incomeDistribution: number
  }
}[]

const PortfolioSummaryDashboard = ({ mandate }: PortfolioSummaryProps) => {
  const [isPageLoading, setIsPageLoading] = useState(true)
  const { t, lang } = useTranslation("portfolioSummary")
  const [activeState, setActiveState] = useState<string | number>(3)

  const { data: lastValuationDate, error: lastValuationDateError } = useSWR(
    `/api/client/get-last-valuation-date`,
  )

  const { data: recentDealActivityData, error } = useSWR<RecentActivity>(
    `/api/client/deals/recent-activities`,
  )

  const isLoading =
    !recentDealActivityData &&
    !error &&
    !lastValuationDate &&
    !lastValuationDateError

  const { user } = useUser()

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Portfolio Summary",
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

  const [options] = useState([
    {
      value: 3,
      label: `3 ${t("common:client.months")}`,
    },
    {
      value: 6,
      label: `6 ${t("common:client.months")}`,
    },
  ])

  const changeActiveFilter = (value: number | string) => {
    setActiveState(value)
  }

  const renderActivity = () => {
    var currentSelectedData = recentDealActivityData?.find(({ month }) => {
      return activeState == month
    })
    var sixMonthsData = recentDealActivityData?.find(({ month }) => {
      return month == 6
    })
    var viewType = ""

    if (
      currentSelectedData?.moneyInvested ||
      sixMonthsData?.moneyInvested ||
      currentSelectedData?.recentFunding ||
      sixMonthsData?.recentFunding ||
      currentSelectedData?.distribution.capitalGain ||
      sixMonthsData?.distribution.capitalGain ||
      sixMonthsData?.distribution.incomeDistribution ||
      sixMonthsData?.distribution.incomeDistribution
    ) {
      if (
        currentSelectedData?.moneyInvested &&
        (currentSelectedData?.distribution?.capitalGain ||
          currentSelectedData?.distribution?.incomeDistribution)
      ) {
        viewType = "all"
      } else if (
        currentSelectedData?.moneyInvested &&
        !currentSelectedData?.distribution?.capitalGain &&
        !currentSelectedData?.distribution?.incomeDistribution
      ) {
        viewType = "moneyInvested"
      } else if (
        (!currentSelectedData?.moneyInvested &&
          currentSelectedData?.distribution?.capitalGain) ||
        currentSelectedData?.distribution?.incomeDistribution
      ) {
        viewType = "distribution"
      } else if (
        !currentSelectedData?.moneyInvested &&
        !currentSelectedData?.distribution?.capitalGain &&
        !currentSelectedData?.distribution?.incomeDistribution &&
        (!sixMonthsData?.moneyInvested ||
          sixMonthsData?.distribution?.capitalGain ||
          sixMonthsData?.distribution.incomeDistribution)
      ) {
        viewType = "distribution"
      } else if (
        !currentSelectedData?.moneyInvested &&
        !currentSelectedData?.distribution?.capitalGain &&
        !currentSelectedData?.distribution?.incomeDistribution &&
        (sixMonthsData?.moneyInvested ||
          !sixMonthsData?.distribution?.capitalGain ||
          !sixMonthsData?.distribution.incomeDistribution)
      ) {
        viewType = "moneyInvested"
      } else if (
        !currentSelectedData?.moneyInvested &&
        !currentSelectedData?.distribution?.capitalGain &&
        !currentSelectedData?.distribution?.incomeDistribution &&
        sixMonthsData?.moneyInvested &&
        (sixMonthsData?.distribution?.capitalGain ||
          sixMonthsData?.distribution.incomeDistribution)
      ) {
        viewType = "all"
      }
    }

    if (currentSelectedData) {
      return (
        <Fragment>
          {viewType ? (
            <Fragment>
              <Box
                justifyContent={{
                  base: "center",
                  lgp: "space-between",
                  md: "space-between",
                }}
                flexDirection={{ base: "column", lgp: "row", md: "row" }}
                display="flex"
                marginTop="30px"
                marginBottom="24px"
              >
                <Box>
                  <Text
                    fontStyle="normal"
                    // fontSize="18px"
                    fontSize={{ base: "14px", md: "20px", lgp: "18px" }}
                    color="white"
                    fontWeight="700"
                    textAlign={{ base: "center", lgp: "left", md: "left" }}
                  >
                    {t("recentActivity.title")}
                  </Text>
                </Box>

                <Box
                  paddingTop={{ base: "15px", lgp: "0px", md: "0px" }}
                  d={{ base: "flex", lgp: "initial", md: "initial" }}
                  justifyContent="center"
                >
                  <QuarterTabs
                    viewType="desktop"
                    options={options}
                    activeOption={activeState}
                    changeActiveFilter={changeActiveFilter}
                  />
                </Box>
              </Box>
              <RecentDealsCard
                activityData={currentSelectedData}
                viewType={viewType}
                valutionDate={formatShortDate(
                  lastValuationDate.lastValuationDate,
                  lang,
                )}
              />
            </Fragment>
          ) : (
            false
          )}
        </Fragment>
      )
    } else {
      return <SkeletonCard flex="1" mb="25px" mt="20px" />
    }
  }

  return (
    <Fragment>
      <ClientLayout title={t("page.title")} description={t("page.description")}>
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
              {lastValuationDate ? (
                <Fragment>
                  <Box>
                    <Text
                      fontStyle="normal"
                      fontSize="30px"
                      color="white"
                      fontWeight="400"
                      marginBottom="8px"
                    >
                      {t("heading", { clientId: mandate })}
                    </Text>
                    <Text
                      fontStyle="normal"
                      fontSize="18px"
                      color="#c7c7c7"
                      fontWeight="400"
                      marginBottom={{ lgp: "48px", base: "24px", md: "24px" }}
                    >
                      {t("description", {
                        valuationDate: formatShortDate(
                          lastValuationDate?.lastValuationDate,
                          lang,
                        ),
                      })}
                    </Text>
                  </Box>
                  {recentDealActivityData?.length ? renderActivity() : <></>}
                  <AllocationSection />
                  <PortfolioOverviewSection
                    lastValuationDate={lastValuationDate.lastValuationDate}
                  />
                  <CrrVideo />
                  <Box onClick={() => router.push("/client/illiquid-stages")}>
                    <SummaryIlliquidInvestment />
                  </Box>{" "}
                </Fragment>
              ) : (
                <ModalBox
                  isOpen={true}
                  modalDescription={t(
                    "common:client.errors.noDate.description",
                  )}
                  modalTitle={t("common:client.errors.noDate.title")}
                  primaryButtonText={t("common:client.errors.noDate.button")}
                  onClose={() => {
                    router.push("/client/portfolio-summary")
                  }}
                  onPrimaryClick={() => {
                    router.push("/client")
                  }}
                />
              )}
            </Fragment>
          )}
        </PageContainer>
      </ClientLayout>
    </Fragment>
  )
}

const CrrVideo = () => {
  const { data: crr, error } = useSWR(`/api/client/miscellaneous/synthesia`, {
    revalidateOnFocus: false,
  })
  const isLoading = !crr && !error
  if (isLoading) {
    return <SkeletonCard flex="1" mb="25px" mt="20px" />
  }

  if (crr?.isSourceExists) {
    return (
      <Box>
        <CRRSynthesiaVideo url={crr?.url} createdDate={crr?.createdDate} />
      </Box>
    )
  } else {
    return <Fragment />
  }
}

const AllocationSection = () => {
  const { lang } = useTranslation("portfolioSummary")

  const { data: deals, error } = useSWR<AllocationData>(
    `/api/client/deals/portfolio-summary-allocation?langCode=${lang}&type=HOLDING`,
  )

  const isLoading = !deals && !error

  if (isLoading) {
    return <SkeletonCard flex="1" mb="25px" mt="20px" />
  }

  if (deals) {
    return (
      <AllocationChartAndTableSection
        allocationChartData={deals?.allocationChartData || []}
        assetTableData={deals?.assetTableData as AssetTableDataType[]}
        isShowMoreData={deals?.isShowMoreData}
      />
    )
  }
  return <Fragment />
}

const AllocationChartAndTableSection = ({
  allocationChartData,
  assetTableData,
  isShowMoreData,
}: AllocationData) => {
  const { user } = useUser()
  const { t, lang } = useTranslation("portfolioSummary")
  const [allocationData, setAllocationData] = useState<AssetTableDataType[]>([])
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()

  const downloadTableDataInExcel = async () => {
    let response = await ky.post("/api/client/generate-excel-file", {
      json: {
        type: "portfolioSummary",
        headerType: "HOLDING",
      },
    })
    let fileData = await response.blob()
    let fileName = `${user?.mandateId}-Portfolio-Summary`
    downloadBlob(window.URL.createObjectURL(fileData), fileName)
    clientEvent(
      downloadedExcel,
      "Portfolio Summary",
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

  useEffect(() => {
    setAllocationData(assetTableData)
  }, [assetTableData])

  const getChartValue = (color: string) => {
    var index: number =
      allocationData?.findIndex((data: { color: string }) => {
        return color == data?.color
      }) || -1

    var tableData = allocationData
    if (index >= 0) {
      var topData = tableData?.splice(index, 1)
      if (topData?.length) {
        tableData?.unshift(topData[0])
      }
    }
    setAllocationData([...tableData])
  }

  return (
    <Fragment>
      <AllocationChart
        getChartValue={getChartValue}
        allocationChartData={allocationChartData || []}
      />
      {allocationData ? (
        <Flex
          justifyContent="flex-end"
          display={{ base: "none", lgp: "flex" }}
          mb="20px"
        >
          <DownloadButton onDownloadClick={downloadTableDataInExcel} />
        </Flex>
      ) : (
        false
      )}
      <Box>
        {allocationData ? (
          <Box>
            <Hide below="lgp">
              <Box
                border="1px solid #222222"
                borderRadius="8px"
                maxH="670px"
                overflow="auto"
                css={{
                  "&::-webkit-scrollbar-thumb": {
                    background: "#4d4d4d",
                  },
                }}
              >
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
              {isShowMoreData ? (
                <Box m="60px 0" textAlign="center">
                  <Button
                    onClick={() => {
                      router.push(
                        "/client/portfolio-summary/allocation-details",
                      )
                    }}
                    colorScheme="primary"
                    size="md"
                    variant="outline"
                    fontWeight="700"
                    fontSize="16px"
                  >
                    {t("portfolioAllocation.button.viewAll")}
                  </Button>
                </Box>
              ) : (
                false
              )}
            </Hide>
            <Show below="lgp">
              <Box m="60px 0" textAlign="center">
                <Button
                  onClick={() => {
                    router.push("/client/portfolio-summary/allocation-details")
                  }}
                  colorScheme="primary"
                  size="md"
                  variant="outline"
                  fontWeight="700"
                  fontSize="16px"
                >
                  {t("portfolioAllocation.button.viewAllocationDtl")}
                </Button>
              </Box>
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

type PortfolioOverviewDataProps = {
  lastValuationDate: string
}

const PortfolioOverviewSection = ({
  lastValuationDate,
}: PortfolioOverviewDataProps) => {
  const { lang } = useTranslation()
  const { data: accountSummary, error } = useSWR(
    `/api/client/account/portfolio-overview?langCode=${lang}`,
  )
  const isLoading = !accountSummary && !error
  if (isLoading) {
    return <SkeletonCard flex="1" mb="25px" mt="20px" />
  }

  if (accountSummary && lastValuationDate) {
    return (
      <PortfolioOverview
        getLastMonth={[
          moment(lastValuationDate).format("MMM YYYY"),
          moment(lastValuationDate).subtract("11", "months").format("MMM YYYY"),
        ]}
        portfolioOverviewDetails={accountSummary}
        viewOverViewTitle="Portfolio Overview"
      />
    )
  }

  return <Fragment />
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

export default PortfolioSummaryDashboard
