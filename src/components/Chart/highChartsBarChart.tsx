import { useMediaQuery } from "@chakra-ui/react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import useTranslation from "next-translate/useTranslation"
import { useEffect, useRef, useState } from "react"

import { SkeletonCard } from "~/components"
import { convertToMillions } from "~/utils/clientUtils/globalUtilities"

type HighChartBarChartProps = {
  colors: string[]
  categories: []
  series: ChartSeriesProps[]
  height?: string
  showXAxis?: boolean
  showYAxis?: boolean
  chartHeight?: number
}

type ChartSeriesProps = {
  name: string
  data: number[]
  showInLegend?: boolean
}

const HighChartBarChart = ({
  colors,
  categories,
  series,
  showXAxis = true,
  showYAxis = true,
  chartHeight,
}: HighChartBarChartProps) => {
  const { lang } = useTranslation()
  const [isChartLoading, setIsChartLoading] = useState(true)

  const isMobView = useMediaQuery([
    "(max-width: 767px)",
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

  const isTabView = useMediaQuery([
    "(max-width: 1200px)",
    "(display-mode: browser)",
  ])

  const getTabView = () => {
    var tabView = false
    isTabView.forEach((item, index) => {
      if (index == 0 && item) {
        tabView = item
      }
    })
    return tabView
  }

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)

  useEffect(() => {
    setTimeout(() => {
      setIsChartLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      chartComponentRef?.current?.chart.reflow()
    }, 500)
  }, [isMobView, isTabView])

  return (
    <>
      {!isChartLoading ? (
        <HighchartsReact
          highcharts={Highcharts}
          ref={chartComponentRef}
          allowChartUpdate={true}
          options={{
            chart: {
              type: "column",
              height: chartHeight ? chartHeight : 160,
              spacingRight: 0,
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              backgroundColor: "transparent",
              borderWidth: 0,
            },
            credits: {
              enabled: false,
            },
            colors,
            title: {
              text: "",
            },
            xAxis: {
              reversed: lang.includes("en") ? false : true,
              visible: showXAxis,
              lineWidth: 0,
              categories,
              labels: {
                useHTML: true,
                formatter: (e: { value: { toString: () => string } }) => {
                  return `<br/>${e.value.toString().replace("\n", "<br/>")}`
                },
                style: {
                  color: getMobView() ? "#AAAAAA" : "#C7C7C7",
                  fontSize: getTabView() ? "12px" : "14px",
                  fontWeight: "normal",
                  fontStyle: "normal",
                  textAlign: "center",
                  textOverflow: "none",
                  whiteSpace: "nowrap",
                  fontFamily: "var(--chakra-fonts-body)",
                },
              },
            },
            yAxis: {
              title: "",
              opposite: lang.includes("en") ? false : true,
              labels: {
                enabled: showYAxis,
                useHTML: true,
                formatter: (e: { value: number }) => {
                  if (Math.sign(e.value) == 1) {
                    return `$${convertToMillions(e.value)}`
                  } else if (Math.sign(e.value) == -1) {
                    return `- $${convertToMillions(Math.abs(e.value))}`
                  } else {
                    return `${e.value}`
                  }
                },
                style: {
                  color: getMobView() ? "#AAAAAA" : "#C7C7C7",
                  fontSize: getTabView() ? "12px" : "14px",
                  fontWeight: "normal",
                  fontStyle: "normal",
                  fontFamily: "var(--chakra-fonts-body)",
                },
              },
              gridLineWidth: 0,
              plotLines: [
                {
                  color: "#ffffff7d",
                  dashStyle: "solid",
                  value: 0,
                  width: 1,
                },
              ],
            },
            tooltip: {
              enabled: false,
            },
            plotOptions: {
              column: {
                stacking: "normal",
                borderWidth: 0,
              },
              series: {
                pointWidth: 32,
                cursor: "pointer",
                states: {
                  inactive: {
                    opacity: 1,
                  },
                },
              },
            },
            series,
          }}
        />
      ) : (
        <SkeletonCard h="100px" />
      )}
    </>
  )
}

export default HighChartBarChart
