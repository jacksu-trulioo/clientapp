import { BoxProps, useToken } from "@chakra-ui/react"
import React from "react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import {
  AllocationPieChartObj,
  YOUR_ALLOCATION_DETAIL,
} from "~/services/mytfo/types"

interface AllocationPieChartProps extends BoxProps {
  pieChartData: AllocationPieChartObj[]
}
const AllocationPieChart: React.FC<AllocationPieChartProps> = ({
  pieChartData,
}: AllocationPieChartProps) => {
  const [
    shinyShamrock700,
    gray800,
    lightSlateGrey800,
    cyberGrape500,
    darkLava500,
  ] = useToken("colors", [
    "shinyShamrock.700",
    "gray.800",
    "lightSlateGrey.800",
    "cyberGrape.500",
    "darkLava.500",
  ])

  function getColor(categorization: string) {
    switch (categorization) {
      case YOUR_ALLOCATION_DETAIL.CAPITAL_YIELDING:
        return lightSlateGrey800
      case YOUR_ALLOCATION_DETAIL.CAPITAL_GROWTH:
        return shinyShamrock700
      case YOUR_ALLOCATION_DETAIL.OPPORTUNISTIC:
        return cyberGrape500
      case YOUR_ALLOCATION_DETAIL.ABSOLUTE_RETURN:
        return darkLava500

      default:
        return gray800
    }
  }
  return (
    <ResponsiveContainer width="100%" aspect={1}>
      <PieChart>
        <Pie
          dataKey="value"
          nameKey="allocationCategory"
          data={pieChartData}
          cx="50%"
          cy="50%"
          outerRadius="100%"
          innerRadius="45%"
        >
          {pieChartData.map((item, index: number) => {
            const color = getColor(item.allocationCategory)
            return (
              <Cell key={`cell-${index}`} fill={color} stroke={color}></Cell>
            )
          })}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
export default AllocationPieChart
