import { useMediaQuery } from "@chakra-ui/react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useRef } from "react"

type HighChartsLineChartProps = {
  series: SeriesDataProps[]
  startAndEndDate: string[]
  chartHeight?: number
}

type SeriesDataProps = {
  color: string
  showInLegend: boolean
  name?: string
  data: number[]
}

const HighChartsLineChart = ({
  series,
  startAndEndDate,
  chartHeight,
}: HighChartsLineChartProps) => {
  const isMobView = useMediaQuery([
    "(max-width: 767px)",
    "(display-mode: browser)",
  ])

  const isTabView = useMediaQuery([
    "(max-width: 1200px)",
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

  const { lang } = useTranslation("insights")

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)

  useEffect(() => {
    setTimeout(() => {
      chartComponentRef?.current?.chart.reflow()
    }, 1000)
  }, [])

  return (
    <HighchartsReact
      highcharts={Highcharts}
      ref={chartComponentRef}
      allowChartUpdate={true}
      options={{
        chart: {
          type: "spline",
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: "transparent",
          height: chartHeight
            ? chartHeight
            : getMobView()
            ? 100
            : getTabView()
            ? 100
            : 80,
          borderWidth: 0,
        },
        title: {
          text: "",
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          reversed: lang.includes("en") ? false : true,
          lineWidth: 0,
          categories: [startAndEndDate[1], "", "", startAndEndDate[0]],
          labels: {
            style: {
              textOverflow: "none",
              color: "#c7c7c7",
              fontSize: getTabView() ? "12px" : "14px",
              fontWeight: "normal",
              fontStyle: "normal",
              fontFamily: lang.includes("en")
                ? "'Gotham', sans-serif"
                : "'Almarai', sans-serif",
              textAlign: "center",
            },
          },
        },
        yAxis: {
          opposite: lang.includes("en") ? false : true,
          title: "",
          labels: {
            enabled: false,
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
          spline: {
            lineWidth: 3,
            states: {
              hover: {
                enabled: false,
              },
            },
            marker: {
              enabled: false,
            },
          },
        },
        series,
      }}
    />
  )
}

export default HighChartsLineChart
