import { BoxProps, useToken } from "@chakra-ui/react"
import React from "react"
import { Cell, LabelList, Pie, PieChart, ResponsiveContainer } from "recharts"

import { AllocationCategory, SimulatedAllocation } from "~/services/mytfo/types"
import formatPercentage from "~/utils/formatPercentage"

interface SimulatorPieChartProps extends BoxProps {
  data: SimulatedAllocation[]
  isAnimationActive?: boolean
}

const SimulatorPieChart = (props: SimulatorPieChartProps) => {
  const { data, isAnimationActive } = props

  const [shinyShamrock700, lightSlateGrey800, cyberGrape500, darkLava500] =
    useToken("colors", [
      "shinyShamrock.700",
      "lightSlateGrey.800",
      "cyberGrape.500",
      "darkLava.500",
    ])

  function getColor(categorization: string) {
    switch (categorization) {
      case AllocationCategory.CapitalYielding:
        return lightSlateGrey800
      case AllocationCategory.CapitalGrowth:
        return shinyShamrock700
      case AllocationCategory.Opportunistic:
        return cyberGrape500
      case AllocationCategory.AbsoluteReturn:
        return darkLava500
      default:
        return "#40412F"
    }
  }

  return (
    <ResponsiveContainer width="100%" aspect={1}>
      <PieChart>
        <Pie
          dataKey="percentage"
          nameKey="categorization"
          data={data}
          cx="50%"
          cy="50%"
          outerRadius="100%"
          innerRadius="45%"
          isAnimationActive={isAnimationActive}
        >
          <LabelList
            dataKey="percentage"
            position="insideTop"
            style={{ fill: "white", stroke: "white", fontSize: "14px" }}
            formatter={formatPercentage}
          />

          {data.map((item, index: number) => {
            const color = getColor(item.categorization)
            return (
              <Cell key={`cell-${index}`} fill={color} stroke={color}></Cell>
            )
          })}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export default SimulatorPieChart
