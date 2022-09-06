import {
  Box,
  chakra,
  Flex,
  HStack,
  Stack,
  Text,
  Tooltip as InfoToolTip,
  useBreakpointValue,
  useToken,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import {
  Area,
  Bar,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

import { InfoIcon } from "~/components"
import { Earnings } from "~/services/mytfo/types"
import formatCurrency from "~/utils/formatCurrency"

export interface SimulatorComposedChartProps {
  data?: Earnings[]
}

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

export default function SimulatorComposedChart(
  props: SimulatorComposedChartProps,
) {
  const { data } = props
  const { locale } = useRouter()
  const direction = locale === "ar" ? "rtl" : "ltr"
  const isMobileView = useBreakpointValue({ base: true, md: false })

  const isDesktopView = !isMobileView

  const { t } = useTranslation("personalizedProposal")

  const [gray450, gunmetal550] = useToken("colors", [
    "gray.450",
    "gunmetal.550",
  ])

  const CustomTooltip = ({
    payload,
  }: {
    payload?: Payload<ValueType, NameType>[]
  }) => {
    if (payload && payload.length) {
      return (
        <Box bgColor="#263134" rounded="md" p="6" minW="270px">
          <Text mb="3" fontSize="sm" fontWeight="extrabold">
            {payload[0].payload.yearLabel}
          </Text>

          <Box fontSize="xs">
            <Flex mb="2" justify="space-between">
              <Text color="gray.400">
                {t(`earnings.tooltip.incomeDistribution`)}
              </Text>
              <Text color="gray.400" fontWeight="extrabold">
                {formatCurrency(
                  parseInt(
                    (payload[0].payload.income || 0)
                      .toString()
                      .replace(/\D/g, ""),
                  ),
                )}
              </Text>
            </Flex>

            <Flex mb="2" justify="space-between">
              <Text color="gray.400">
                {t(`earnings.tooltip.capitalDistribution`)}
              </Text>
              <Text color="gray.400">
                {formatCurrency(
                  parseInt(
                    (payload[0].payload.capital || 0)
                      .toString()
                      .replace(/\D/g, ""),
                  ),
                )}
              </Text>
            </Flex>

            <Flex mb="4" justify="space-between">
              <Text fontWeight="extrabold">
                {t(`earnings.tooltip.totalDistribution`)}
              </Text>
              <Text fontWeight="extrabold">
                {formatCurrency(
                  parseInt(
                    (payload[0].payload.total || 0)
                      .toString()
                      .replace(/\D/g, ""),
                  ),
                )}
              </Text>
            </Flex>
            <Flex mb="2">
              <Text color="#FFFFFF" fontSize="md">
                {t(`earnings.tooltip.cumulativeTotal`)}
              </Text>
            </Flex>
            <Flex mb="2" justify="space-between">
              <Text color="gray.400">
                {" "}
                {t(`earnings.tooltip.cumulativeDistribution`)}
              </Text>
              <Text color="gray.400">
                {formatCurrency(
                  parseInt(
                    (payload[0].payload.cumulativeDistribution || 0)
                      .toString()
                      .replace(/\D/g, ""),
                  ),
                )}
              </Text>
            </Flex>
            <Flex mb="2" justify="space-between">
              <Text color="gray.400"> {t(`earnings.tooltip.percent`)}</Text>
              <Text color="gray.400">{payload[0].payload.percentage}%</Text>
            </Flex>
          </Box>
        </Box>
      )
    }

    return null
  }

  const getLegendIcon = (val: string) => {
    if (val === "cumulativeDistribution") {
      return (
        <Box
          bgColor="#B99855"
          width={{ base: "10px", md: "14px" }}
          height="2px"
        />
      )
    }
    if (val === "income") {
      return (
        <Box
          bgColor="#526369"
          width={{ base: "10px", md: "14px" }}
          height={{ base: "10px", md: "14px" }}
        />
      )
    }
    if (val === "capital") {
      return (
        <Box
          bgColor="#A4B4B9"
          width={{ base: "10px", md: "14px" }}
          height={{ base: "10px", md: "14px" }}
        />
      )
    }
  }

  const renderLegend: React.FC<LegendAllTypes> = (props: LegendAllTypes) => {
    const { payload } = props
    return (
      <>
        {!isMobileView && (
          <Stack
            direction={{ base: "column", md: "row" }}
            justifyContent={direction === "rtl" ? "flex-start" : "flex-end"}
            alignItems={{ base: "flex-end" }}
          >
            {payload &&
              payload instanceof Array &&
              payload.map((entry: LegendAllTypes, index: number) => (
                <HStack alignItems="center" spacing="2" key={index}>
                  {getLegendIcon(entry?.dataKey)}
                  <div key={`item-${index}`}>
                    {t(`earnings.postulates.${entry.value}.title`)}
                  </div>
                  {isDesktopView && (
                    <InfoToolTip
                      hasArrow
                      label={t(
                        `earnings.postulates.${entry.value}.description`,
                      )}
                      placement="bottom"
                    >
                      <chakra.span>
                        <InfoIcon color="primary.500" w="13" h="13" />
                      </chakra.span>
                    </InfoToolTip>
                  )}
                </HStack>
              ))}
          </Stack>
        )}

        {isMobileView && (
          <Stack
            direction={{ base: "column", md: "row" }}
            justifyContent={locale === "en" ? "flex-end" : "flex-start"}
            alignItems={{ base: "flex-end" }}
          >
            {payload &&
              payload instanceof Array &&
              payload.map((entry: LegendAllTypes, index: number) => (
                <HStack key={index}>
                  {getLegendIcon(entry?.dataKey)}
                  <Text
                    w={direction === "rtl" ? "80px" : "130px"}
                    textAlign="left"
                    fontFamily="Gotham"
                    fontSize="x-small"
                    key={`item-${index}`}
                  >
                    {t(`earnings.postulates.${entry.value}.title`)}
                  </Text>
                  <InfoToolTip
                    hasArrow
                    label={t(`earnings.postulates.${entry.value}.description`)}
                    placement="bottom"
                  >
                    <chakra.span>
                      <InfoIcon color="primary.500" w="13" h="13" />
                    </chakra.span>
                  </InfoToolTip>
                </HStack>
              ))}
          </Stack>
        )}
      </>
    )
  }

  return (
    <Flex
      h="300px"
      {...(isMobileView && {
        maxW: "sm",
      })}
      mb="8"
    >
      <ResponsiveContainer height="100%" width={isMobileView ? "95%" : "100%"}>
        <ComposedChart width={730} height={250} data={data}>
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4A3D22" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4A3D22" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="year" interval="preserveStartEnd" fontSize="12px" />

          <Tooltip
            content={(props) => <CustomTooltip {...props} />}
            cursor={{
              stroke: "#FFFFFF",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
            offset={20}
            {...(isMobileView && {
              position: { x: 0, y: -230 },
              wrapperStyle: { width: "90%" },
            })}
            {...(!isMobileView && {
              position: { y: -230 },
              wrapperStyle: { width: "30%" },
            })}
          />
          <Legend
            align={isMobileView ? "right" : "center"}
            wrapperStyle={{
              display: "block",
              position: "relative",
              width: "100%",
              marginTop: isMobileView ? "-20px" : "10px",
              fontSize: "12px",
            }}
            // @ts-ignore
            content={renderLegend}
          />

          <Area
            type="monotone"
            dataKey="cumulativeDistribution"
            stroke="#B99855"
            fillOpacity={0.5}
            fill="url(#color)"
          />

          <Bar
            dataKey="income"
            barSize={isMobileView ? 20 : 50}
            stackId="a"
            fill={gunmetal550}
          />
          <Bar
            dataKey="capital"
            barSize={isMobileView ? 20 : 50}
            stackId="a"
            fill={gray450}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Flex>
  )
}
