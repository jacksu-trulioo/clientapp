import {
  Box,
  chakra,
  Circle,
  Flex,
  Heading,
  HStack,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { SimulatorPieChart } from "~/components"
import { AllocationCategory, SimulatedAllocation } from "~/services/mytfo/types"
import formatPercentage from "~/utils/formatPercentage"

interface PortfolioAllocationProps {
  allocations: SimulatedAllocation[]
}

function PortfolioAllocation(props: PortfolioAllocationProps) {
  const { allocations } = props
  const { t } = useTranslation()

  const isMobileView = useBreakpointValue({ base: true, md: false, lg: false })
  const isDesktopView = useBreakpointValue({ base: false, md: false, lg: true })

  const strategies = React.useMemo(() => {
    const sortedAllocations = allocations?.sort((a, b) => {
      return b.percentage - a.percentage
    })
    return sortedAllocations?.map((value) => {
      const classes = value?.sampleDeals?.map((info) => info?.assetClass) || []
      return {
        category: value?.categorization,
        deals: [...classes],
      }
    })
  }, [allocations])

  function getAllocationDescription(categorization: string) {
    switch (categorization) {
      case AllocationCategory.CapitalYielding:
        return t("simulator:allocations.capitalYielding.description")
      case AllocationCategory.CapitalGrowth:
        return t("simulator:allocations.capitalGrowth.description")
      case AllocationCategory.Opportunistic:
        return t("simulator:allocations.opportunistic.description")
      case AllocationCategory.AbsoluteReturn:
        return t("simulator:allocations.absoluteReturn.description")
    }
  }

  function getAllocationColorIdentifier(categorization: string) {
    switch (categorization) {
      case AllocationCategory.CapitalYielding:
        return "lightSlateGrey.800"
      case AllocationCategory.CapitalGrowth:
        return "shinyShamrock.700"
      case AllocationCategory.Opportunistic:
        return "cyberGrape.500"
      case AllocationCategory.AbsoluteReturn:
        return "darkLava.500"
    }
  }

  const getRecommendedStrategy = React.useCallback(
    (items: SimulatedAllocation[]) => {
      let isBalanced = false

      // Return allocations that have the max percentage.
      const allocWithHighestPercentage = items.reduce((max, item) => {
        if (max.percentage === item.percentage) isBalanced = true
        return max.percentage > item.percentage ? max : item
      })

      if (isBalanced) {
        return t("simulator:allocations.strategy.balanced")
      }

      switch (allocWithHighestPercentage.categorization) {
        case AllocationCategory.CapitalGrowth:
          return t("simulator:allocations.strategy.capitalGrowth")
        case AllocationCategory.CapitalYielding:
          return t("simulator:allocations.strategy.capitalYielding")
        case AllocationCategory.AbsoluteReturn:
          return t("simulator:allocations.strategy.absoluteReturn")
        default:
          return t("simulator:allocations.strategy.opportunistic")
      }
    },
    [t],
  )

  const getClasses = (val: string) => {
    const classes = (strategies || [])
      ?.filter((value: { category: string }) => value?.category === val)
      .map((info) => info?.deals)[0]

    return Array.from(new Set(classes)).join("  |  ")
  }

  function renderAllocationItem(allocation: SimulatedAllocation) {
    return (
      <>
        <Flex
          aria-label="allocationCategory"
          bgColor="gray.850"
          w={["xs", "sm"]}
          px="5"
          py="4"
        >
          <HStack spacing={3} me="4" alignSelf="flex-start">
            <Circle
              size="4"
              bg={getAllocationColorIdentifier(allocation.categorization)}
            />
            {!isMobileView && (
              <Text fontSize="sm" fontWeight="bold">
                {formatPercentage(allocation.percentage)}
              </Text>
            )}
          </HStack>

          <Flex
            flex="1"
            flexDirection="column"
            alignItems="flex-start"
            textAlign="start"
          >
            <HStack>
              {isMobileView && (
                <Text fontSize="sm" fontWeight="bold">
                  {formatPercentage(allocation.percentage)}
                </Text>
              )}{" "}
              <Text fontSize="sm" mb="2">
                {t(
                  `simulator:allocations.categorization.${allocation.categorization}`,
                )}
              </Text>
            </HStack>

            <Text fontSize="xs" color="gray.400" mb="3">
              {getAllocationDescription(allocation.categorization)}
            </Text>
            {getClasses(allocation?.categorization) && (
              <Text fontSize="xs" color="gray.400" mb="3">
                {t("simulator:allocations.assetClassHeading")}
              </Text>
            )}
            <Text fontSize="xs" color="contrast.200" fontWeight="extrabold">
              {getClasses(allocation?.categorization)}
            </Text>
          </Flex>
        </Flex>
      </>
    )
  }

  return (
    <>
      <VStack id="right__side" maxW="3xl" spacing="8">
        <Heading
          color="contrast.200"
          fontSize={{ base: "lg", md: "lg", lg: "xl" }}
          alignSelf="flex-start"
        >
          {t("simulator:allocations.heading")}
        </Heading>

        <Trans
          i18nKey={
            allocations.length === 1
              ? "simulator:allocations.summary"
              : "simulator:allocations.summaries"
          }
          components={[
            <Text key="0" fontSize="lg" color="gray.400" />,
            <chakra.span key="1" color="primary.500" fontSize="lg" />,
            <br key="2" />,
          ]}
          values={{
            recommendedStrategy: getRecommendedStrategy(allocations),
            count: allocations.length,
          }}
        />
      </VStack>

      <Flex
        my={"12"}
        flexDirection="row"
        justifyContent="center"
        {...(isMobileView && { flexWrap: "wrap" })}
      >
        <Box
          minW="220px"
          maxW="300px"
          flex="1"
          {...(isDesktopView && { me: "10" })}
          {...(isMobileView && { px: "0", mb: "14" })}
        >
          <SimulatorPieChart data={allocations} />
        </Box>

        <VStack>{allocations.map(renderAllocationItem)}</VStack>
      </Flex>
    </>
  )
}

export default React.memo(PortfolioAllocation)
