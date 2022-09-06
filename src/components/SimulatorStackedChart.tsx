import {
  Box,
  Button,
  chakra,
  HStack,
  Text,
  useBreakpointValue,
  useToken,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { PortfolioProposal } from "~/services/mytfo/types"

import { CaretLeftIcon, CaretRightIcon } from "."

export interface SimulatorStackedChartProps {
  data?: PortfolioProposal[]
  onOpen: () => void
}
export default function SimulatorStackedChart(
  props: SimulatorStackedChartProps,
) {
  const { data, onOpen } = props
  const { locale } = useRouter()
  const direction = locale === "ar" ? "rtl" : "ltr"
  const isMobileView = useBreakpointValue({ base: true, md: false, lg: false })
  const isDesktopView = useBreakpointValue({ base: false, md: false, lg: true })
  const { t } = useTranslation("personalizedProposal")

  const [
    darkLava500,
    purpleTaupe500,
    lightSlateGrey800,
    shinyShamrock700,
    gray500,
  ] = useToken("colors", [
    "darkLava.500",
    "purpleTaupe.500",
    "lightSlateGrey.800",
    "shinyShamrock.700",
    "gray.500",
  ])
  function formatYAxisLabel(value: number) {
    if (value === 0) return "Years"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      compactDisplay: "short",
    }).format(value)
  }

  function formatXAxisLabel(value: number) {
    return value
  }

  return (
    <Box h="200px" {...(isMobileView && { mb: 12 })} id="stacked__chart">
      <HStack justifyContent="space-between" alignItems="center">
        <Text
          ms={{ base: "0", md: "5" }}
          mb="5"
          mt={{ base: "8", md: "0" }}
          fontSize={{ base: "sm", md: "sm" }}
        >
          {t("investmentWork.labels.deploymentSchedule")}
        </Text>
        {isMobileView && (
          <Button
            colorScheme="primary"
            role="link"
            onClick={() => onOpen()}
            variant="link"
            size="sm"
            pt="2"
            rightIcon={
              direction === "rtl" ? (
                <CaretLeftIcon w="6" h="6" />
              ) : (
                <CaretRightIcon w="6" h="6" />
              )
            }
          >
            {t("investmentWork.labels.viewDetails")}
          </Button>
        )}
      </HStack>
      <ResponsiveContainer height="100%" width="100%">
        <BarChart
          data={data}
          margin={{
            left: isMobileView ? 0 : 20,
            right: 0,
            top: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid vertical={false} stroke={gray500} />
          <XAxis
            reversed={direction === "rtl"}
            dataKey="name"
            // @ts-ignore
            tickFormatter={formatXAxisLabel}
            tickSize={-10}
            tickMargin={20}
            fontSize="12px"
          />
          <YAxis
            orientation={direction === "rtl" ? "right" : "left"}
            axisLine={false}
            tickMargin={direction === "rtl" ? 50 : 20}
            tickFormatter={formatYAxisLabel}
            fontSize="12px"
            {...(!isDesktopView && {
              dy: 12,
              dx: direction === "ltr" ? 18 : -20,
            })}
            {...(isDesktopView && {
              dy: 12,
              dx: direction === "rtl" ? -40 : 48,
            })}
          />
          {isMobileView && (
            <Legend
              align="left"
              iconType="square"
              wrapperStyle={{
                display: "block",
                position: "relative",
                width: "80%",
                marginLeft: direction === "ltr" ? 45 : 90,
              }}
              formatter={(value: string) => (
                <chakra.span color="white" ms="4" fontSize="10px">
                  {t(`investmentWork.legends.${value}`)}
                </chakra.span>
              )}
            />
          )}
          <Bar
            type="monotone"
            stackId="a"
            dataKey="absoluteReturn"
            fill={darkLava500}
            strokeWidth="2"
          />
          <Bar
            type="monotone"
            stackId="a"
            dataKey="opportunistic"
            fill={purpleTaupe500}
            strokeWidth="2"
          />
          <Bar
            type="monotone"
            stackId="a"
            dataKey="capitalYielding"
            fill={lightSlateGrey800}
            strokeWidth="2"
          />
          <Bar
            type="monotone"
            stackId="a"
            dataKey="capitalGrowth"
            fill={shinyShamrock700}
            strokeWidth="2"
          />
          <ReferenceLine y={0} stroke="#fff" alwaysShow></ReferenceLine>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}
