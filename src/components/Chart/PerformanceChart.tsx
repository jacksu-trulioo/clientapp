import { Box, useMediaQuery } from "@chakra-ui/react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useRef, useState } from "react"

import { SkeletonCard } from "~/components"
import useStore from "~/hooks/useStore"

export type PerformanceChartProps = {
  chartData: {
    months: string[]
    cumulativeData: []
    periodicData: []
    minMaxValue: {
      max: number
      min: number
    }
  }
  valuationDate?: string
}

type TooltipType = {
  x?: string
  y?: number
  points?: []
  shared: boolean
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

const PerformanceChart: React.FC<PerformanceChartProps> = ({ chartData }) => {
  const { t, lang } = useTranslation("performance")
  const [isChartLoading, setIsChartLoading] = useState(true)
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)
  const [isDrawerOpen] = useStore((state) => [state.isDrawerOpen])

  const getTooltip = (tooltip: TooltipType) => {
    return `<span>
    <strong>${tooltip?.y?.toFixed(1)}%</strong> ${tooltip.x}</span>`
  }
  const isMobView = useMediaQuery([
    "(max-width: 767px)",
    "(display-mode: browser)",
  ])

  const isTabView = useMediaQuery([
    "(max-width: 1023px)",
    "(display-mode: browser)",
  ])

  const getMobView = () => {
    var mobView = false
    isMobView.forEach((item, index) => {
      if (index == 0 && item) {
        mobView = item
      }
    })
    return mobView
  }

  const getTabView = () => {
    var tabView = false
    isTabView.forEach((item, index) => {
      if (index == 0 && item) {
        tabView = item
      }
    })
    return tabView
  }

  useEffect(() => {
    setTimeout(() => {
      setIsChartLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      chartComponentRef?.current?.chart.reflow()
    }, 500)
  }, [isDrawerOpen, isMobView, isTabView])

  return (
    <>
      <Box zIndex="1" style={{ width: "100%", height: "100%" }} id="chart">
        {!isChartLoading ? (
          <HighchartsReact
            ref={chartComponentRef}
            allowChartUpdate={true}
            updateArgs={[true, true, true]}
            containerProps={{ className: "chartContainer" }}
            highcharts={Highcharts}
            options={{
              chart: {
                type: "area",
                zoomType: false,
                backgroundColor: "rgba(0,0,0,0)",
                height: getMobView() ? 600 : getTabView() ? 400 : 338,
                spacingLeft: getMobView() ? 0 : 5,
                spacingRight: getMobView() ? 0 : 5,
                spacingTop: 75,
                reflow: true,
                scrollablePlotArea: {
                  minWidth: getMobView() ? 200 : 300,
                },
              },
              credits: {
                enabled: false,
              },
              title: {
                text: "",
                align: "left",
              },
              plotOptions: {
                area: {
                  stacking: "normal",
                  lineColor: "#666666",
                  lineWidth: 1,
                  marker: {
                    lineWidth: 1,
                    lineColor: "#666666",
                  },
                  fillColor: {
                    linearGradient: {
                      x1: 0,
                      y1: 0,
                      x2: 0,
                      y2: 1,
                    },
                    stops: [
                      [0, "rgba(255, 255, 255, 0.2)"],
                      [1, "rgba(255, 255, 255, 0)"],
                    ],
                    threshold: null,
                  },
                },
              },
              xAxis: [
                {
                  reversed: false,
                  index: 0,
                  isX: true,
                  gridLineWidth: 1,
                  gridLineColor: "rgb(255, 255, 255, 0.05)",
                  categories: chartData.months,
                  crosshair: {
                    width: 2,
                    color: "#C7C7C7",
                    dashStyle: "dot",
                    zIndex: 2,
                  },
                  labels: {
                    style: {
                      color: "#C7C7C7",
                      fontSize: "12px",
                      textOverflow: "none",
                      fontFamily: "var(--chakra-fonts-body)",
                    },
                  },
                  tickLength: 0,
                  lineColor: "rgba(0,0,0,0)",
                },
              ],

              yAxis: [
                {
                  opposite: false,
                  gridLineWidth: 1,
                  gridLineColor: "rgb(255, 255, 255, 0.05)",
                  min: chartData.minMaxValue.min,
                  max: chartData.minMaxValue.max,
                  alignTicks: false,
                  labels: {
                    format: "{value}%",
                    style: {
                      color: "#C7C7C7",
                      fontSize: "14px",
                      fontFamily: "var(--chakra-fonts-body)",
                    },
                  },
                  title: {
                    text: "",
                  },
                  plotLines: [
                    {
                      color: "#AAA",
                      dashStyle: "solid",
                      value: 0,
                      width: 1,
                    },
                  ],
                },
                {
                  opposite: lang.includes("en") ? false : true,
                  gridLineWidth: 1,
                  gridLineColor: "rgb(255, 255, 255, 0.05)",
                  min: chartData.minMaxValue.min,
                  max: chartData.minMaxValue.max,
                  alignTicks: false,
                  title: {
                    text: "",
                  },
                  labels: {
                    enabled: false,
                    format: "{value}%",
                    style: {
                      color: "rgb(102, 102, 102)",
                    },
                  },
                },
              ],

              legend: {
                layout: "vertical",
                enabled: false,
                align: "left",
                borderWidth: 0,
                x: 20,
                verticalAlign: "top",
                y: 55,
                floating: true,
                color: "blue",
                itemHoverStyle: { color: "#FFFFFF" },
                itemStyle: {
                  color: "gray.600",
                  fontWeight: "100",
                  fontSize: "14px",
                  fontFamily: "var(--chakra-fonts-body)",
                },
                itemMarginBottom: 10,
              },
              tooltip: {
                shared: true,
                backgroundColor: "#222",
                borderWidth: 0,
                borderRadius: 6,
                style: {
                  color: "#C7C7C7",
                  fontWeight: 500,
                  fontSize: "15px",
                  padding: "12px",
                  boxShadow: "0px 11px 10px rgba(0, 0, 0, 0.4)",
                  fontFamily: "var(--chakra-fonts-body)",
                },
                formatter: function () {
                  return getTooltip(this)
                },
              },
              series: [
                {
                  enableMouseTracking: true,
                  name: t("labels.cumulativePerformance"),
                  type: "area",
                  color: "#ffffff",
                  data: chartData.cumulativeData,
                  marker: {
                    enabled: true,
                  },
                  showInLegend: true,
                },
                {
                  enableMouseTracking: true,
                  name: t("labels.periodPerformance"),
                  type: "column",
                  color: "rgb(191, 197, 244)",
                  yAxis: 1,
                  data: chartData.periodicData,
                  showInLegend: true,
                  pointWidth: 25,
                },
              ],
            }}
          />
        ) : (
          <SkeletonCard />
        )}
      </Box>
    </>
  )
}
export default PerformanceChart
