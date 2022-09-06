import {
  Box,
  chakra,
  Heading,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { SimulatorLineChart } from "~/components"
import { useUser } from "~/hooks/useUser"
import { SimulatedPortfolio } from "~/services/mytfo/types"
import formatCurrency, {
  formatCurrencyWithoutSymbol,
} from "~/utils/formatCurrency"
import formatPercentage from "~/utils/formatPercentage"
import formatYearName from "~/utils/formatYearName"

interface PortfolioProjectionProps {
  portfolio: SimulatedPortfolio
  onAnimationStart?: () => void
  onAnimationEnd?: () => void
}

function PortfolioProjection(props: PortfolioProjectionProps) {
  const { portfolio, onAnimationEnd, onAnimationStart } = props
  const { t, lang } = useTranslation()
  const { user } = useUser()

  const isDesktopView = useBreakpointValue({ base: false, md: false, lg: true })

  const graphDataLength = portfolio?.graphData?.length

  const lastYearData = portfolio?.graphData[graphDataLength - 1]

  return (
    <>
      <Box
        mb="12"
        id="bottom"
        {...(!isDesktopView && {
          mt: "16",
        })}
      >
        <Box maxW="4xl" fontSize="2xl">
          <Heading
            color="gray.400"
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            mb="8"
          >
            {t("simulator:projections.heading")}
          </Heading>
          <Trans
            i18nKey={
              formatPercentage(portfolio.expectedYield) === "0%"
                ? "simulator:projections.summaryWithZeroYield"
                : "simulator:projections.summary"
            }
            components={[
              <Text key="0" fontSize={{ base: "md", md: "lg", lg: "lg" }} />,
              <chakra.span
                key="1"
                color="primary.500"
                fontSize={{ base: "md", md: "lg", lg: "lg" }}
              />,
              <br key="2" />,
              <chakra.span
                key="3"
                display={portfolio.expectedYield === 0 ? "none" : "initial"}
                fontSize={{ base: "md", md: "lg", lg: "lg" }}
              />,
            ]}
            values={{
              firstName: user?.profile.firstName || "",
              years: portfolio.graphData.length - 1, // Ignore 0th year.
              yearsText: formatYearName(portfolio.graphData.length - 1, lang),
              projectedValue:
                lang === "ar"
                  ? `${formatCurrencyWithoutSymbol(
                      lastYearData.portfolioValue,
                    )} ${t("common:generic.dollar")}`
                  : formatCurrency(lastYearData.portfolioValue),
              averageIncome:
                lang === "ar"
                  ? `${formatCurrencyWithoutSymbol(
                      portfolio.averageIncome,
                    )} ${t("common:generic.dollar")}`
                  : formatCurrency(portfolio.averageIncome),
              roi: formatPercentage(portfolio.roi),
              expectedYield: formatPercentage(portfolio.expectedYield),
              expectedReturn: formatPercentage(portfolio.expectedReturn),
              cumulativeYieldPaidOut:
                lang === "ar"
                  ? `${formatCurrencyWithoutSymbol(
                      lastYearData?.cumulativeYieldPaidOut,
                    )} ${t("common:generic.dollar")}`
                  : formatCurrency(lastYearData?.cumulativeYieldPaidOut),
            }}
          />
        </Box>
      </Box>

      <SimulatorLineChart
        data={portfolio}
        onAnimationStart={onAnimationStart}
        onAnimationEnd={onAnimationEnd}
      />
    </>
  )
}

export default React.memo(PortfolioProjection)
