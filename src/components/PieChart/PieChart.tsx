import { Box, Flex, Text } from "@chakra-ui/react"
// import useTranslation from "next-translate/useTranslation"
import { useCallback } from "react"
import {
  Cell,
  Pie,
  PieChart as PieChartWrapper,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

import { colors } from "~/styles/foundations/colors"

const CustomTooltip = ({
  payload,
}: {
  payload?: Payload<ValueType, NameType>[]
}) => {
  if (payload && payload.length) {
    return (
      <Box
        bgColor="#263134" // Legacy color, Alternate 9. To be changed.
        rounded="md"
        p="3"
      >
        <Flex justify="space-between">
          <Text color="contrast.200" fontWeight="bold" mr="3">
            {Number(payload[0]?.value).toFixed(1)}%{" "}
          </Text>
          <Text color="contrast.200">{payload[0].name}</Text>
        </Flex>
      </Box>
    )
  }

  return null
}

type PieChartDataItem = {
  name: string
  value: number
  color: string
}

export type PieChartProps = {
  data: PieChartDataItem[]
  callBackFunc?: (color: string) => void
}

const DEFAULT_VALUE = {
  name: "",
  value: 100,
}

const PieChart = ({ data = [], callBackFunc }: PieChartProps) => {
  // const isMobileView = useBreakpointValue({ base: true, md: false })
  const getFillColor = useCallback((entryColor?) => {
    if (!entryColor) return colors["opal"]["900"]

    if (entryColor.includes(".")) {
      const values = entryColor.split(".")

      return colors[values[0]][values[1]]
    }
    return entryColor
  }, [])

  return (
    <Box textAlign="center" width="100%">
      <Box display="inline-block" pr={{ base: 0, lg: "7" }}>
        <ResponsiveContainer width={300} height={300}>
          <PieChartWrapper>
            <Pie
              onClick={(callback) => {
                if (callBackFunc) {
                  callBackFunc(callback.fill)
                }
              }}
              data={data && !!data?.length ? data : [DEFAULT_VALUE]}
              innerRadius={80}
              outerRadius={150}
              // blendStroke={false}
              dataKey="value"
              // stroke="#111111"
              strokeWidth="0"
              width={300}
              height={300}
            >
              {data && !!data.length ? (
                data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getFillColor(entry.color)}
                  />
                ))
              ) : (
                <Cell fill={getFillColor()} />
              )}
            </Pie>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#FFFFFF",
                strokeWidth: 1,
              }}
              // offset={20}
              // {...(isMobileView && {
              //   position: { x: 0, y: -230 },
              //   // wrapperStyle: { width: "100%" },
              // })}
            />
          </PieChartWrapper>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}

export default PieChart
