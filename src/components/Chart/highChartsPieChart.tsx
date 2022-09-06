import { useMediaQuery } from "@chakra-ui/react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import React from "react"
type HighChartPieChartProps = {
  pieChartData: { name: string; y: number }[]
  lang: string
}
const HighChartPieChart = ({ pieChartData, lang }: HighChartPieChartProps) => {
  const pieChartColors = [
    "#4B5473",
    "#554712",
    "#55ADB9",
    "#5DA683",
    "#664B73",
    "#6BBF73",
    "#6D8A96",
    "#7F4A6A",
    "#838940",
    "#8AA65D",
    "#8AB9DB",
    "#8ADBD6",
    "#8B8ADB",
    "#966D81",
    "#A5BFC5",
    "#B99855",
    "#BFC5F4",
    "#C5A5C4",
    "#CBDDAA",
    "#DCB214",
    "#DCD2A4",
    "#DDBCAE",
    "#DDBFF4",
    "#DDD8C9",
    "#F7B198",
  ]
  const isMobView = useMediaQuery([
    "(max-width: 768px)",
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
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie",
          backgroundColor: "transparent",
          height: getMobView() ? 600 : getTabView() ? 400 : 338,
          width: getMobView() ? 300 : getTabView() ? 600 : 900,
          borderWidth: 0,
          className: "totalInvestmentChart",
        },
        credits: {
          enabled: false,
        },
        title: {
          text: "",
          style: { textAlign: "left" },
        },
        colors: pieChartColors,
        accessibility: {
          point: {
            valueSuffix: "%",
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: false,
            width: "100%",
            point: {
              events: {
                legendItemClick: function (e: Event) {
                  e.preventDefault()
                },
              },
            },
            cursor: "pointer",
            borderWidth: 0,
            dataLabels: [
              {
                enabled: false,
                backgroundColor: "#000",
                className: "chartDataLabel",
              },
            ],
            showInLegend: true,
            states: {
              hover: {
                shadow: false,
                halo: {
                  size: 0,
                },
              },
            },
          },
        },
        series: [
          {
            colorByPoint: true,
            data: pieChartData,
          },
        ],
        tooltip: {
          followPointer: false,
          backgroundColor: "#263134",
          borderWidth: 0,
          distance: 20,
          style: {
            color: "#FFFFFF",
            cursor: "default",
            fontSize: "12px",
            whiteSpace: "nowrap",
          },
          headerFormat: "",
          pointFormat: " <b>{point.percentage:.1f}%</b> {point.name}",
          split: false,
        },
        legend: {
          lineHeight: 22,
          margin: 10,
          layout: getMobView() ? "vertical" : "horizontal",
          align: getMobView() ? "center" : lang == "en" ? "right" : "left",
          verticalAlign: getMobView() ? "bottom" : "middle",
          maxHeight: 300,
          itemMarginTop: 10,
          itemMarginBottom: 10,
          borderWidth: 0,
          itemStyle: {
            color: "#C7C7C7",
            fontSize: "14px",
            fontWeight: "normal",
            textTransform: "capitalize",
          },
          itemHoverStyle: { color: "#FFFFFF" },
          rtl: lang.includes("ar") ? true : false,
          navigation: {
            activeColor: "#FFFFFF",
            inactiveColor: "#FFFFFF",
            style: {
              color: "#FFFFFF",
            },
          },
        },
      }}
    />
  )
}
export default HighChartPieChart
