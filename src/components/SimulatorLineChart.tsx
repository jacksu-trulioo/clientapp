import {
  Box,
  Divider,
  Flex,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"
import { scrollIntoView } from "seamless-scroll-polyfill"

import { ChevronSingleLeftIcon, ChevronSingleRightIcon } from "~/components"
import { SimulatedPortfolio } from "~/services/mytfo/types"
import formatCurrency from "~/utils/formatCurrency"
import formatPercentage from "~/utils/formatPercentage"

interface LegendPayload {
  activeDot?: boolean
  animationBegin?: number
  animationDuration?: number
  animationEasing?: string
  connectNulls?: boolean
  dataKey: string
  dot?: boolean
  fill?: string
  fillOpacity?: number
  hide?: boolean
  isAnimationActive?: boolean
  legendType?: string
  points?: number[]
  stroke?: string
  type?: string
  xAxisId?: number
  yAxisId?: number
}

interface LegendAllTypes {
  color?: string
  dataKey: string
  inactive?: boolean
  payload?: LegendPayload
  type?: string
  value?: string
}

interface ToolTipDetailProps {
  cumulativeYieldPaidOut: number
  initialInvestment: number
  name: string
  portfolioValue: number
  relativeReturn: number
  totalValue: number
  yearValue: string
  yieldPaidOut: number
}

export interface SimulatorLineChartProps {
  data?: SimulatedPortfolio
  onAnimationStart?: () => void
  onAnimationEnd?: () => void
}

const CustomTooltip = ({
  active,
  payload,
  label,
  numberOfYears,
  annualYield,
}: {
  active?: boolean
  payload?: Payload<ValueType, NameType>[]
  label?: string
  numberOfYears: number
  annualYield: number
}) => {
  const { t } = useTranslation("simulator")
  const isMobileView = useBreakpointValue({ base: true, md: false, lg: false })
  const isTabletView = useBreakpointValue({ base: false, md: true, lg: false })
  if ((isMobileView || isTabletView) && numberOfYears > 8) return <></>
  if (active && payload && payload.length) {
    return (
      <Box bgColor="#263134" rounded="md" p="6" minW="250px">
        <Text mb="6" fontSize="sm" fontWeight="extrabold">
          {payload[0].payload.yearValue} - {t(`tooltip.year.${label}`)}
        </Text>

        <Box fontSize="xs">
          <Flex mb="4" justify="space-between">
            <Text>{t("tooltip.portfolioValue")}</Text>
            <Text color="vodka.100" fontWeight="extrabold">
              {formatCurrency(payload[0].payload.portfolioValue)}
            </Text>
          </Flex>

          <Flex mb="4" justify="space-between">
            <Text>{t("tooltip.yieldThisYear")}</Text>
            <Text color="vodka.100" fontWeight="extrabold">
              {formatCurrency(payload[0].payload.yieldPaidOut)}
            </Text>
          </Flex>
          <Flex justify="space-between">
            <Text>{t("tooltip.cumulativeYield")}</Text>
            <Text color="vodka.100">
              {formatCurrency(payload[0].payload.cumulativeYieldPaidOut)}
            </Text>
          </Flex>
        </Box>
        <Divider my="4" orientation="horizontal" />
        <Flex justify="space-between">
          <Text>{t("tooltip.annualYield")}</Text>
          <Text color="vodka.100">{formatPercentage(annualYield)}</Text>
        </Flex>
      </Box>
    )
  }

  return null
}

export default function SimulatorLineChart(props: SimulatorLineChartProps) {
  const { locale } = useRouter()
  const direction = locale === "ar" ? "rtl" : "ltr"
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = useBreakpointValue({ base: false, md: false, lg: true })
  const isTabletView = useBreakpointValue({ base: false, md: true, lg: false })
  const { t } = useTranslation("simulator")
  const chartRef = React.useRef<HTMLDivElement>(null)
  const [tooltipState, setToolTipState] = React.useState({})

  const tooltipCard = (tooltipDetails: ToolTipDetailProps) => {
    if (tooltipDetails?.yearValue) {
      return (
        <Box
          bgColor="#263134"
          rounded="md"
          p="6"
          minW="250px"
          mb="5"
          position="absolute"
          id="custom_tooltip"
          zIndex={1}
          bottom={isMobileView ? "80%" : "78%"}
          left={isMobileView ? "18%" : "38%"}
        >
          <Text mb="6" fontSize="sm" fontWeight="extrabold">
            {tooltipDetails?.yearValue} - {tooltipDetails?.name}
          </Text>

          <Box fontSize="xs">
            <Flex mb="4" justify="space-between">
              <Text>{t("tooltip.portfolioValue")}</Text>
              <Text color="vodka.100" fontWeight="extrabold">
                {formatCurrency(tooltipDetails?.portfolioValue)}
              </Text>
            </Flex>

            <Flex mb="4" justify="space-between">
              <Text>{t("tooltip.yieldThisYear")}</Text>
              <Text color="vodka.100" fontWeight="extrabold">
                {formatCurrency(tooltipDetails?.yieldPaidOut)}
              </Text>
            </Flex>

            <Flex justify="space-between">
              <Text>{t("tooltip.cumulativeYield")}</Text>
              <Text color="vodka.100">
                {formatCurrency(tooltipDetails?.cumulativeYieldPaidOut)}
              </Text>
            </Flex>
          </Box>
          <Divider my="4" orientation="horizontal" />
          <Flex justify="space-between">
            <Text>{t("tooltip.annualYield")}</Text>
            <Text color="vodka.100">
              {(props &&
                props?.data &&
                formatPercentage(props?.data?.expectedYield)) ||
                0 + "%"}
            </Text>
          </Flex>
        </Box>
      )
    }
  }

  if (!props.data) return null

  const { graphData, expectedYield } = props.data

  function formatXAxisLabel(_value: string, index: number) {
    const year = new Date().getFullYear() + index
    return year.toString()
  }

  const newGraphData = graphData?.map((value, index) => {
    return {
      ...value,
      yearValue: (new Date().getFullYear() + index).toString(),
    }
  })

  function formatYAxisLabel(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      compactDisplay: "short",
    }).format(value)
  }

  function graphWidth(numberOfBars: number) {
    const paddedWidth = Math.round(chartRef?.current?.clientWidth || 0) - 40
    const totalBarWidth = numberOfBars * 50
    const totalWidth = totalBarWidth + paddedWidth
    if (numberOfBars > 8 && isDesktopView) {
      return 1400
    }

    if (numberOfBars <= 8) {
      return 550
    }

    if (isTabletView || isMobileView) {
      return totalWidth
    }
  }

  const getLegendIcon = (val: string) => {
    if (val === "cumulativeYieldPaidOut") {
      return (
        <Box
          bgColor="#DCCCAA"
          width={{ base: "10px", md: "14px" }}
          height="2px"
        />
      )
    }
    if (val === "portfolioValue") {
      return (
        <Box
          bgColor="#C0C5F0"
          width={{ base: "10px", md: "14px" }}
          height="2px"
        />
      )
    }
  }

  const renderLegend: React.FC<LegendAllTypes> = (props) => {
    const { payload } = props
    return (
      <>
        <Stack
          direction="row"
          justifyContent={direction === "rtl" ? "flex-start" : "flex-end"}
          alignItems={{ base: "flex-end" }}
          position="absolute"
          marginStart="4"
        >
          {payload &&
            payload instanceof Array &&
            payload.map((entry, index: number) => (
              <HStack alignItems="center" spacing="2" key={index}>
                {getLegendIcon(entry?.dataKey)}
                <div key={`item-${index}`}> {t(`legends.${entry?.value}`)}</div>
              </HStack>
            ))}
        </Stack>
      </>
    )
  }

  const getInitialPadding = () => {
    const maxWidth = chartRef?.current?.clientWidth || 0

    if (isDesktopView || graphData?.length <= 8) {
      return {
        left: 0,
        right: 0,
      }
    } else {
      return {
        left: Math.round(maxWidth / 2) - 20,
        right: Math.round(maxWidth / 2) - 20,
      }
    }
  }
  const rightAxisChartData = ["0%", "2%", "5%", "8%", "10%"]

  return (
    <>
      {(isMobileView || isTabletView) &&
        graphData?.length > 8 &&
        /* @ts-ignore */
        tooltipCard(tooltipState)}
      <Flex position="relative">
        {!isDesktopView && graphData?.length > 8 && (
          <Box position="absolute" top="90px" left="10px" w="full" h="full">
            <Flex justifyContent="center" alignItems="center" h="full">
              <Flex
                w="10"
                h="10"
                backgroundColor="white"
                id="red__color"
                borderRadius="50%"
                justifyContent="center"
                alignItems="center"
                zIndex={1}
                dir="ltr"
              >
                <ChevronSingleLeftIcon
                  mt="3"
                  w="16px"
                  h="16px"
                  zIndex={1}
                  ms="3"
                  color="black"
                />
                <ChevronSingleRightIcon
                  mt="3"
                  w="16px"
                  h="16px"
                  zIndex={1}
                  color="black"
                />
              </Flex>
            </Flex>
          </Box>
        )}
        <Box className="simulator_rechart" h="400px">
          <ComposedChart
            width={60}
            height={330}
            data={newGraphData}
            margin={{
              right: 20,
              left: 20,
              bottom: 3,
            }}
          >
            <YAxis
              orientation="left"
              axisLine={false}
              tickMargin={direction === "rtl" ? 70 : 20}
              tickFormatter={formatYAxisLabel}
            />
            <XAxis
              reversed={direction === "rtl"}
              dataKey="name"
              tickSize={0}
              tickMargin={20}
              tickFormatter={formatXAxisLabel}
            />
            <Line
              type="monotone"
              dataKey="portfolioValue"
              style={{ display: "none" }}
            />
          </ComposedChart>
        </Box>
        <Box
          h="400px"
          {...(isDesktopView &&
            graphData?.length < 8 && {
              maxW: "xl",
            })}
          className="simulator_line_chart"
          {...((!isDesktopView || graphData?.length > 8) && {
            style: {
              overflowX: "scroll",
              overflowY: "hidden",
            },
          })}
          mt="2px"
          ref={chartRef}
        >
          <ComposedChart
            width={graphWidth(newGraphData?.length)}
            height={330}
            data={newGraphData}
            {...(!isDesktopView && {
              onMouseLeave: () => setToolTipState({}),
            })}
          >
            <XAxis
              reversed={direction === "rtl"}
              interval="preserveStartEnd"
              dataKey="name"
              padding={getInitialPadding()}
              tickSize={0}
              tickMargin={20}
              tickFormatter={formatXAxisLabel}
            />
            <CartesianGrid strokeDasharray="3 0" vertical={false} />
            <Tooltip
              isAnimationActive={false}
              content={(props) => (
                <CustomTooltip
                  {...props}
                  numberOfYears={graphData?.length}
                  annualYield={expectedYield}
                />
              )}
              cursor={{
                stroke: "#FFFFFF",
                strokeWidth: 2,
                strokeDasharray: "3 3",
              }}
              offset={20}
              active={true}
            />
            <Legend
              align="right"
              iconType="plainline"
              wrapperStyle={{
                display: "block",
                position: "relative",
                width: "100%",
                marginTop: 25,
              }}
              // @ts-ignore
              content={renderLegend}
            />

            <Bar
              dataKey="cumulativeYieldPaidOut"
              barSize={30}
              fill="#DCCCAA"
              {...(!isDesktopView && {
                onClick: (positioning) => {
                  setToolTipState(positioning?.payload)
                  // @ts-ignore
                  scrollIntoView(document?.getElementById(positioning?.id), {
                    behavior: "smooth",
                    inline: "center",
                    block: "nearest",
                  })
                },
              })}
            >
              {newGraphData?.map((value, index) => {
                return <Cell key={index} id={`cell-${index}`} />
              })}
            </Bar>
            <Line
              type="monotone"
              dataKey="portfolioValue"
              stroke="#C0C5F0"
              isAnimationActive={false}
              strokeWidth={3}
            />
          </ComposedChart>
        </Box>
        <VStack spacing="52px" px={2}>
          {rightAxisChartData.reverse().map((percentValue) => (
            <Text key={percentValue}>{percentValue}</Text>
          ))}
        </VStack>
      </Flex>
    </>
  )
}
