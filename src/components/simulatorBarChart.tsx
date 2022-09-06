import { Box, useToken } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { PortfolioProposalBarChart } from "~/services/mytfo/types"

export interface SimulatorBarChartProps {
  data?: PortfolioProposalBarChart[]
  height?: string
}

export default function SimulatorBarChart(props: SimulatorBarChartProps) {
  const { data, height: chartHeight } = props
  const { locale } = useRouter()
  const direction = locale === "ar" ? "rtl" : "ltr"

  const [gray400, gray700, gunmetal550, gunmetal300, gunmetal100, primary600] =
    useToken("colors", [
      "gray.400",
      "gray.700",
      "gunmetal.550",
      "gunmetal.300",
      "gunmetal.100",
      "primary.600",
    ])

  function formatYAxisLabel(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      compactDisplay: "short",
    }).format(value)
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  function CustomizedLabel(props: {
    x: number
    y: number
    width: number
    height: number
    value: number
  }) {
    const { x, y, width, height, value } = props

    return (
      <text
        x={x + width / 2}
        // this height is calculated based on the bar height we have, as we need to show text just after the bar
        y={
          height < -150
            ? y - height / 12
            : height < -100
            ? y - height / 5
            : height < -70
            ? y - height / 4
            : height < -50
            ? y - height / 3
            : height < -30
            ? y - height / 2
            : y - height + 10
        }
        dy={-6}
        fontSize="12"
        fontFamily="Gotham"
        fill={gray400}
        textAnchor="middle"
        direction="ltr"
      >
        {value}%
      </text>
    )
  }

  return (
    <Box aria-label="barChart" h={chartHeight} w="220px">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart
          data={data}
          margin={{
            left: locale === "ar" ? 0 : -60,
            right: locale === "ar" ? -60 : 0,
            top: locale === "ar" ? 6 : 10,
            bottom: 10,
          }}
          barGap={30}
        >
          <CartesianGrid vertical={false} horizontal={false} stroke={gray700} />

          <XAxis
            axisLine={false}
            reversed={direction === "rtl"}
            orientation="top"
            dataKey="name"
            tick={false}
            tickSize={-10}
            tickMargin={20}
            fontSize="12px"
          />

          <YAxis
            orientation={direction === "rtl" ? "right" : "left"}
            tick={false}
            axisLine={false}
            tickMargin={direction === "rtl" ? 70 : 20}
            tickFormatter={formatYAxisLabel}
          />

          <Bar
            type="monotone"
            stackId="a"
            dataKey="sp"
            fill={gunmetal550}
            strokeWidth="2"
            label={
              <CustomizedLabel x={0} y={0} width={0} height={0} value={0} />
            }
            isAnimationActive={false}
          />

          <Bar
            type="monotone"
            stackId="b"
            dataKey="nikkei"
            fill={gunmetal300}
            strokeWidth="2"
            label={
              <CustomizedLabel x={0} y={0} width={0} height={0} value={0} />
            }
            isAnimationActive={false}
          />

          <Bar
            type="monotone"
            stackId="c"
            dataKey="euro"
            fill={gunmetal100}
            strokeWidth="2"
            label={
              <CustomizedLabel x={0} y={0} width={0} height={0} value={0} />
            }
            isAnimationActive={false}
          />
          <Bar
            type="monotone"
            stackId="d"
            dataKey="tfo"
            fill={primary600}
            strokeWidth="2"
            label={
              <CustomizedLabel x={0} y={0} width={0} height={0} value={0} />
            }
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}
