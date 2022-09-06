import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { useMediaQuery } from "@chakra-ui/react"
import { Box } from "@chakra-ui/react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import { Fragment, useEffect, useRef, useState } from "react"

import {
  AssetAllocationHeader,
  AssetAllocationOverYear,
  AssetAllocationYearByClass,
  ClientLayout,
  ModalBox,
  PageContainer,
  SkeletonCard,
  TargetAssetAllocation,
} from "~/components"
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import { MyTfoClient } from "~/services/mytfo"
import { getFeedbackCookieStatus } from "~/utils/clientUtils/feedbackCookieUtilities"
import { screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type AssetAllocationProps = {
  assetAllocation: {
    finalData: {
      metaData: {}
      targetAssetAllocation: {
        illiquid: {
          data: [
            {
              subStrategy: string
              targetAssetAllocationPercent: number
              currentAssetAllocationPercent: number
              deviation: number
            },
          ]
          illiquidPercentage: number
          strategyPerc: number
        }
        liquid: {
          liquidPercentage: number
          strategyPerc: number
          data: [
            {
              subStrategy: string
              targetAssetAllocationPercent: number
              currentAssetAllocationPercent: number
              deviation: number
            },
          ]
        }
      }
      assetAllocationOverYears: {
        assetClassValues: []
        years: []
        liquidAtBeginning: number
        illiquidAtBeginning: number
        illiquidAfterCommitments: number
        liquidAfterCommitments: number
      }
      detailedPerformance: {}
      overallPerformance: {}
      maximumDrawDown: {}
    }
    isSourceExists: boolean
    nonAA: boolean
  }
}

type SelectedYearType = {
  year: never | undefined
  data: { name: string; value: []; color: string; assetDescription: string }[]
}

type TooltipType = {
  x?: string
  y?: number
  series: {
    name?: string
  }
  points?: []
  shared: true
  backgroundColor: string
  borderWidth: number
  borderRadius: number
  style: {
    color: string
    fontWeight: number
    fontSize: string
    padding: string
    boxShadow: string
  }
  formatter: () => void
}

const AssetAllocationDashboard = ({
  assetAllocation,
}: AssetAllocationProps) => {
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isChartLoading, setIsChartLoading] = useState(true)
  const { t, lang } = useTranslation("assetAllocation")
  const [selectedData, setSelectedData] = useState<SelectedYearType>()
  const [isMobileView] = useMediaQuery("(max-width: 767px)")

  const chartColorArry = [
    "#E2F1F5",
    "#AED1DA",
    "#738995",
    "#624D70",
    "#6FA485",
    "#B4985F",
    "#9DCE62",
    "#4B5473",
    "#554712",
  ]

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)
  const { user } = useUser()

  const handleResize = () => {
    setTimeout(() => {
      chartComponentRef?.current?.chart.reflow()
    }, 100)
  }

  useEffect(() => {
    if (assetAllocation) {
      setIsPageLoading(false)
    } else {
      setIsPageLoading(true)
    }
  }, [assetAllocation])

  useEffect(() => {
    const openTime = moment(new Date())
    getTargetAssetAllocationData(null)
    setTimeout(() => {
      setIsChartLoading(false)
    }, 1000)

    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Asset Allocation",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  const handleRouteChange = () => {
    if (
      !assetAllocation.nonAA &&
      getFeedbackCookieStatus(siteConfig.clientFeedbackSessionVariableName) ==
        "true" &&
      router.asPath == "/client/asset-allocation"
    ) {
      sessionStorage.setItem("showFeedbackModalForAAScreen", "true")
    }
  }

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChange)

    return () => {
      router.events.off("routeChangeStart", handleRouteChange)
    }
  }, [router.events])

  useEffect(() => {
    window.addEventListener("resize", handleResize)
  }, [handleResize])

  const getTooltip = (tooltip: TooltipType) => {
    return `<span>
    <strong>${tooltip?.y?.toFixed(1)}% </strong> ${tooltip.series.name} - ${
      tooltip.x
    }</span>`
  }

  const getTargetAssetAllocationData = (year: number | null) => {
    var selectedYearIndex
    if (!year) {
      selectedYearIndex =
        assetAllocation?.finalData?.assetAllocationOverYears?.years?.length - 1
    } else {
      selectedYearIndex =
        assetAllocation?.finalData?.assetAllocationOverYears?.years?.findIndex(
          (x) => {
            return x == year
          },
        )
    }
    getCurrentYearAssetClasses(selectedYearIndex)
  }

  const getCurrentYearAssetClasses = (selectedYearIndex: number) => {
    var yearIndex: number
    if (selectedYearIndex || selectedYearIndex == 0) {
      yearIndex = selectedYearIndex
    } else {
      yearIndex =
        assetAllocation.finalData?.assetAllocationOverYears?.years?.length - 1
    }
    var obj = {
      year: assetAllocation?.finalData?.assetAllocationOverYears?.years[
        yearIndex
      ],
      data: assetAllocation?.finalData?.assetAllocationOverYears?.assetClassValues?.map(
        ({ values, type }, index) => {
          return {
            name: t(`assetName.${type}.title`),
            value: values[yearIndex],
            color: chartColorArry[index],
            assetDescription: t(`assetName.${type}.description`),
          }
        },
      ),
    }
    setSelectedData(obj)
  }

  return (
    <Fragment>
      <ClientLayout
        title={t("page.title")}
        description={t("page.description")}
        footerRequired={false}
      >
        {" "}
        {assetAllocation.nonAA && (
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
        )}
        {!assetAllocation.nonAA && (
          <PageContainer
            isLoading={isPageLoading}
            as="section"
            maxW="full"
            px="0"
            mt={{ base: 8, md: 8, lgp: 0 }}
            filter={isPageLoading ? "blur(3px)" : "none"}
          >
            <Box>
              <AssetAllocationHeader />
            </Box>
            <Box>
              <TargetAssetAllocation assetAllocation={assetAllocation} />
            </Box>
            <Box>
              <AssetAllocationOverYear assetAllocation={assetAllocation} />
            </Box>
            {!isChartLoading ? (
              <Fragment>
                <Box>
                  <Box
                    style={{ direction: "initial" }}
                    className="highChartColumn assetAllocationChart"
                    position="relative"
                  >
                    <HighchartsReact
                      highcharts={Highcharts}
                      ref={chartComponentRef}
                      allowChartUpdate={true}
                      className="chartContainer"
                      options={{
                        chart: {
                          renderTo: "chart",
                          plotBackgroundColor: null,
                          plotBorderWidth: null,
                          plotShadow: false,
                          backgroundColor: "transparent",
                          borderWidth: 0,
                          height: isMobileView ? "200px" : "400px",
                          type: "column",
                          padding: "25px",
                          scrollablePlotArea: {
                            minWidth: isMobileView ? 1500 : "auto",
                            scrollPositionX: lang.includes("ar") ? 1 : 0,
                          },
                        },
                        colors: [
                          "#E2F1F5",
                          "#AED1DA",
                          "#738995",
                          "#624D70",
                          "#6FA485",
                          "#B4985F",
                          "#9DCE62",
                          "#4B5473",
                          "#554712",
                        ],
                        title: {
                          text: "",
                        },
                        credits: {
                          enabled: false,
                        },
                        xAxis: {
                          categories:
                            assetAllocation.finalData.assetAllocationOverYears
                              ?.years,
                          labels: {
                            style: {
                              color: "#AAAAAA",
                              fontWeight: "400",
                              fontSize: "12px",
                              lineHeight: "120%",
                              fontFamily: "var(--chakra-fonts-body)",
                            },
                          },
                          lineWidth: 0,
                          reversed: lang.includes("ar") ? true : false,
                        },
                        yAxis: {
                          labels: {
                            enabled: true,
                            style: {
                              color: "#AAAAAA",
                              fontWeight: "400",
                              fontSize: "12px",
                              lineHeight: "120%",
                              fontFamily: "var(--chakra-fonts-body)",
                            },
                          },
                          gridLineColor: "#4D4D4D",
                          gridLineWidth: 1,
                          min: 0,
                          title: {
                            text: "",
                          },
                          opposite: lang.includes("ar") ? true : false,
                        },
                        tooltip: {
                          backgroundColor: "#263134",
                          borderWidth: 0,
                          distance: 20,
                          style: {
                            color: "#FFFFFF",
                            cursor: "default",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                            boxShadow: "0px 11px 10px rgba(0, 0, 0, 0.4)",
                            borderRadius: "6px",
                            fontFamily: "var(--chakra-fonts-body)",
                          },
                          formatter: function (this: TooltipType) {
                            return getTooltip(this)
                          },
                          useHTML: true,
                          split: false,
                        },
                        plotOptions: {
                          column: {
                            stacking: "percent",
                            borderWidth: 0,
                          },
                          series: {
                            cursor: "pointer",
                            point: {
                              events: {
                                click: function (event: {
                                  point: { category: number }
                                }) {
                                  getTargetAssetAllocationData(
                                    event?.point?.category,
                                  )
                                },
                              },
                            },
                            states: {
                              inactive: {
                                opacity: 1,
                              },
                            },
                          },
                        },
                        series:
                          assetAllocation?.finalData?.assetAllocationOverYears?.assetClassValues.map(
                            ({ type, values }) => {
                              return {
                                name: t(`assetName.${type}.title`),
                                data: values,
                                showInLegend: false,
                              }
                            },
                          ),
                      }}
                    />
                  </Box>
                  <Box
                    bg={
                      lang.includes("ar")
                        ? "linear-gradient(90deg, #111111 100%, #4D4D4D 50%, #111111 100%)"
                        : "linear-gradient(90deg, #111111 0%, #4D4D4D 50%, #111111 100%)"
                    }
                    h="1px"
                    my="10"
                    position="relative"
                    _after={{
                      content: "''",
                      backgroundColor: "#101010",
                      border: "1px solid #4D4D4D",
                      borderTop: "0",
                      borderLeft: "0",
                      position: "absolute",
                      width: "42px",
                      height: "42px",
                      left: "50%",
                      transform: lang.includes("ar")
                        ? "translateX(-50%) rotate(-45deg)"
                        : "translateX(-50%) rotate(45deg)",
                      top: "-20px",
                      zIndex: "1",
                    }}
                  />
                </Box>
                <Box>
                  {selectedData ? (
                    <AssetAllocationYearByClass selectedData={selectedData} />
                  ) : (
                    false
                  )}
                </Box>
              </Fragment>
            ) : (
              <SkeletonCard flex="1" mb="25px" mt="20px" />
            )}
          </PageContainer>
        )}
      </ClientLayout>
    </Fragment>
  )
}

export default AssetAllocationDashboard

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const sesison = getSession(ctx.req, ctx.res)
    if (sesison?.mandateId) {
      const client = new MyTfoClient(ctx.req, ctx.res, {
        authRequired: true,
        msType: "maverick",
        additionalHeader: [
          {
            key: "ask",
            value: "crrdata",
          },
        ],
      })
      const assetAllocation = await client.clientMiscellaneous.crrAsset()
      return {
        props: {
          assetAllocation,
        },
      }
    }
    return {
      notFound: true,
    }
  },
})
