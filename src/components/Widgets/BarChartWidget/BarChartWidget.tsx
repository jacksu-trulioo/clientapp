import { Box, Flex, IconButton, Text } from "@chakra-ui/react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import MenuIcon from "~/components/Icon/MenuIcon"
import { colors } from "~/styles/foundations/colors"
import nFormatter from "~/utils/nFormatter"

const DATA_COLOR = {
  assetColor: colors["opal"]["900"],
  liabilityColor: colors["salmon"]["500"],
}

type BarChartWidgetDataItem = {
  year: string
  asset: number
  liability: number
}

type BarChartWidgetProps = {
  title: string
  data: BarChartWidgetDataItem[]
}

const BarChartWidget = ({ title, data }: BarChartWidgetProps) => {
  return (
    <Box
      backgroundColor="gray.800"
      pt={1}
      paddingEnd={1}
      pb={5}
      paddingStart={5}
    >
      <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Text flexGrow={1} order={1} color="gray.600" as="h2" fontSize="sm">
          {title}
        </Text>
        <IconButton
          order={[2, 3]}
          variant="ghost"
          transform="rotate(90deg)"
          aria-label="menu"
          color="gray.600"
          icon={<MenuIcon w={4} h={4} />}
        />
        <Flex mt={[2, 0]} order={[3, 2]} flexShrink={0} mr={4}>
          <Flex alignItems="baseline" flexShrink={0} mr={5}>
            <Box
              borderRadius="50%"
              w={2.5}
              h={2.5}
              background={DATA_COLOR.assetColor}
              mr={3}
            />
            <Text fontSize="sm" color="gray.600">
              Asset
            </Text>
          </Flex>
          <Flex alignItems="baseline" flexShrink={0}>
            <Box
              w={2.5}
              h={2.5}
              borderRadius="50%"
              background={DATA_COLOR.liabilityColor}
              mr={3}
            />
            <Text fontSize="sm" color="gray.600">
              Liability
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Box mt={10} transform="translateX(-30px)">
        <ResponsiveContainer width="100%" height={150}>
          <BarChart
            margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
            data={data}
          >
            <CartesianGrid stroke={colors["gray"]["700"]} vertical={false} />
            <YAxis
              tickFormatter={(value, _index) => nFormatter(value, 3)}
              tickLine={false}
              tickSize={10}
              axisLine={false}
              tick={{ fontSize: "12px", fill: colors["gray"]["600"] }}
            />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickSize={12}
              stroke={colors["gray"]["700"]}
              tick={{
                fontSize: "12px",
                fill: colors["gray"]["600"],
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: 0,
                borderRadius: "4px",
                fontWeight: 700,
              }}
              labelStyle={{
                color: colors["gray"]["800"],
                fontWeight: 700,
                marginBottom: 10,
              }}
              cursor={{ fill: "transparent" }}
            />
            <Bar
              dataKey="asset"
              name="Asset"
              stackId="a"
              barSize={35}
              fill={DATA_COLOR.assetColor}
            />
            <Bar
              barSize={35}
              radius={[2, 2, 0, 0]}
              dataKey="liability"
              name="Liability"
              stackId="a"
              fill={DATA_COLOR.liabilityColor}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}

export default BarChartWidget
