import { Box, Container, Flex, HStack, Text, VStack } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/media-query"
import { chakra, Circle, Divider, useToken } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { ArrowRightIcon, Link, SimulatorPieChart } from "~/components"
import { MyProposal, SimulatedAllocation } from "~/services/mytfo/types"
import { strategyAllocationDetail } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

interface AllocationProps {
  data: MyProposal
  selectedProposal: number
  proposalData: MyProposal
}

function MyAllocation(props: AllocationProps) {
  let { data, proposalData, selectedProposal } = props

  const { t, lang } = useTranslation("personalizedProposal")

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lg: false,
  })

  if (!data) {
    data = { ...proposalData }
    selectedProposal = 0
  }

  let allArr: SimulatedAllocation[] = [] as SimulatedAllocation[]

  const absoluteReturn: SimulatedAllocation = {
    text: "absoluteReturn",
    description: t(
      `yourAllocation.proposalPostulates.absoluteReturn.description`,
    ),
    categorization: "Absolute return",
    percentage:
      (data?.strategies &&
        data?.strategies?.absoluteReturn &&
        Number(data?.strategies?.absoluteReturn?.percentageAllocation) &&
        Number(data?.strategies?.absoluteReturn?.percentageAllocation)) ||
      0,
    spv: "absoluteReturn",
  }

  const capitalYielding: SimulatedAllocation = {
    text: "capitalYielding",
    description: t(
      `yourAllocation.proposalPostulates.capitalYielding.description`,
    ),
    categorization: "Capital Yielding",
    percentage:
      (data?.strategies &&
        data?.strategies?.capitalYielding &&
        Number(data?.strategies?.capitalYielding?.percentageAllocation) &&
        Number(data?.strategies?.capitalYielding?.percentageAllocation)) ||
      0,
    spv: "capitalYielding",
  }

  const capitalGrowth: SimulatedAllocation = {
    text: "capitalGrowth",
    description: t(
      `yourAllocation.proposalPostulates.capitalGrowth.description`,
    ),
    categorization: "Capital Growth",
    percentage:
      (data?.strategies &&
        data?.strategies?.capitalGrowth &&
        Number(data?.strategies?.capitalGrowth?.percentageAllocation) &&
        Number(data?.strategies?.capitalGrowth?.percentageAllocation)) ||
      0,
    spv: "absoluteReturn",
  }

  const opportunistic: SimulatedAllocation = {
    text: "opportunistic",
    description: t(
      `yourAllocation.proposalPostulates.opportunistic.description`,
    ),
    categorization: "Opportunistic",
    percentage:
      (data?.strategies &&
        data?.strategies?.opportunistic &&
        Number(data?.strategies?.opportunistic?.percentageAllocation) &&
        Number(data?.strategies?.opportunistic?.percentageAllocation)) ||
      0,
    spv: "absoluteReturn",
  }

  allArr = [absoluteReturn, capitalYielding, capitalGrowth, opportunistic]
  allArr = allArr.filter((val) => val?.percentage !== 0)

  allArr.sort(function (a, b) {
    return b.percentage - a.percentage
  })

  const [shinyShamrock700, lightSlateGrey800, cyberGrape500, darkLava500] =
    useToken("colors", [
      "shinyShamrock.700",
      "lightSlateGrey.800",
      "cyberGrape.500",
      "darkLava.500",
    ])

  function getColor(categorization: string | undefined) {
    if (categorization === "absoluteReturn") {
      return darkLava500
    }
    if (categorization === "capitalGrowth") {
      return shinyShamrock700
    }
    if (categorization === "opportunistic") {
      return cyberGrape500
    }
    if (categorization === "capitalYielding") {
      return lightSlateGrey800
    }
  }

  const createRoute = (text: string) => {
    if (text === "absoluteReturn") {
      return "/personalized-proposal/absolute-return"
    }
    if (text === "capitalYielding") {
      return "/personalized-proposal/capital-yielding"
    }
    if (text === "capitalGrowth") {
      return "/personalized-proposal/capital-growth"
    }
    if (text === "opportunistic") {
      return "/personalized-proposal/opportunistic"
    }
  }

  return (
    <Container
      as="section"
      maxW={{ base: "md", md: "full" }}
      px={{ base: 0, md: 0 }}
    >
      <Flex
        my={{ base: "12", md: "10" }}
        flexDirection={{ base: "column", md: "row" }}
        ms={{ base: 0 }}
        justifyContent={{ base: "flex-start", md: "space-between" }}
        alignItems={{ base: "center", md: "flex-start" }}
      >
        <Box
          {...(isDesktopView && { me: 10 })}
          {...(isMobileView && { ps: 0, pe: 4, mb: 8 })}
          minW="220px"
          maxW="300px"
          flex="1"
        >
          <SimulatorPieChart data={allArr} isAnimationActive={false} />
        </Box>

        <VStack
          flexDirection="column"
          ms={{ base: 0 }}
          maxW={{ base: "lg", md: "full" }}
          mb={{ base: 10 }}
          pe={isMobileView && lang !== "ar" ? "35px" : "0"}
        >
          {allArr.map((proposal, index) => {
            return (
              <Box
                aria-label="yourAllocations"
                backgroundColor="gray.800"
                p="4"
                key={index}
                w="full"
              >
                <HStack spacing={3} alignItems="flex-start">
                  <Circle size="4" bg={getColor(proposal.text)} />
                  {isDesktopView && (
                    <Text color="contrast.200" fontSize="sm" fontWeight="bold">
                      {proposal &&
                        proposal?.percentage &&
                        (proposal.percentage * 100).toFixed(0)}
                      %
                    </Text>
                  )}

                  <VStack
                    alignItems="flex-start"
                    spacing={{ base: 4, md: 1 }}
                    maxW="full"
                  >
                    <Text fontSize="sm" color="contrast.200">
                      {(isMobileView || isTabletView) &&
                        !isDesktopView &&
                        proposal &&
                        proposal?.percentage && (
                          <chakra.span fontWeight="extrabold">
                            {(proposal.percentage * 100).toFixed(0)}%{" "}
                          </chakra.span>
                        )}
                      {t(
                        `yourAllocation.proposalPostulates.${proposal.text}.label`,
                      )}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {proposal.description}
                    </Text>
                    {isMobileView && (
                      <HStack spacing="2">
                        <Link
                          onClick={() => {
                            event({
                              ...strategyAllocationDetail,
                              // @ts-ignore
                              label: `Click on the tab of  ${proposal.text} available in the proposal`,
                            })
                          }}
                          // @ts-ignore
                          href={{
                            pathname: createRoute(proposal.text || ""),
                            query: {
                              selectedProposal: selectedProposal,
                            },
                          }}
                          color="primary"
                          fontSize="xs"
                          textDecoration="primary.500"
                        >
                          {t("yourAllocation.links.viewDetails")}
                        </Link>
                        <ArrowRightIcon
                          color="primary.500"
                          {...(lang === "ar" && {
                            transform: "rotate(180deg)",
                          })}
                        />
                      </HStack>
                    )}
                  </VStack>
                </HStack>
              </Box>
            )
          })}
        </VStack>
        {isMobileView && (
          <Divider
            orientation="horizontal"
            borderColor="gray.400"
            border="1px solid"
          ></Divider>
        )}
      </Flex>
    </Container>
  )
}

export default MyAllocation
