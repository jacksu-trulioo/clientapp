import {
  Box,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/layout"
import { chakra, Tooltip, useBreakpointValue } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import { InfoIcon } from "~/components"
import { MyProposal, ProposalsStatus } from "~/services/mytfo/types"

interface AllocationProps {
  data: MyProposal
  proposalData: MyProposal
  isRmView?: string
}

interface ProposalPost {
  label?: string
  percent?: string
  description?: string
}

function ProposalOverview(props: AllocationProps) {
  let { data, proposalData, isRmView } = props
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isTabletView = useBreakpointValue({ base: false, md: true, lg: false })
  const isDesktopView = useBreakpointValue({ base: false, md: false, lg: true })
  const { t } = useTranslation("personalizedProposal")

  const { data: proposalStatusData } = useSWR<ProposalsStatus>(
    "/api/user/proposals/status",
  )

  if (!data) {
    data = { ...proposalData }
  }

  const postulates = React.useMemo(() => {
    if (data) {
      return Object.keys(data).reduce<ProposalPost[]>((acc, val) => {
        if (
          val === "expectedReturn" ||
          val === "expectedYield" ||
          val === "forecastedVolatility" ||
          val === "sharpeRatio"
        ) {
          acc.push({
            label: val,
            percent: data[val],
            description: t(`yourAllocation.proposalFacts.${val}.description`),
          })
        }
        return acc
      }, [])
    }
  }, [t, data])

  return (
    <Container as="section" maxW={{ base: "md", md: "full" }} px="0" mb="10">
      <Text
        mb={{ base: 8, md: isRmView ? 7 : 2 }}
        fontSize={isMobileView ? "xl" : "2xl"}
        color="contrast.200"
        fontWeight="500"
        {...((isMobileView || isTabletView) && { mt: 8 })}
      >
        {isRmView
          ? `#${isRmView} ${t("yourAllocation.rmHeading")}`
          : t("yourAllocation.heading")}
      </Text>
      {!isRmView && proposalStatusData && proposalStatusData?.modifiedByRm && (
        <Box
          border="1px solid"
          borderColor="secondary.500"
          borderRadius="20px"
          maxWidth="250px"
          mb="8"
        >
          <Text fontSize="sm" pl="7px">
            {t("yourAllocation.rmUpdate")}
          </Text>
        </Box>
      )}
      <Box maxW={{ base: "full", md: "3xl" }}>
        <Heading
          mb={{ base: 8, md: 4 }}
          textAlign="start"
          fontSize={isDesktopView ? "xl" : "lg"}
        >
          {t("yourAllocation.subHeading")}
        </Heading>

        {(data?.strategies &&
          data?.strategies.capitalGrowth &&
          data?.strategies.capitalYielding &&
          (data?.strategies.capitalGrowth?.percentageAllocation ||
            data?.strategies.capitalYielding?.percentageAllocation) &&
          data?.strategies.capitalGrowth?.percentageAllocation >=
            data?.strategies.capitalYielding?.percentageAllocation) ||
        (data?.strategies &&
          data?.strategies.capitalGrowth &&
          data?.strategies.capitalGrowth?.percentageAllocation &&
          data?.strategies.capitalGrowth?.percentageAllocation === 1) ? (
          <>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.400">
              {t("yourAllocation.description.startingText")}{" "}
              <Text
                as="span"
                color="primary.500"
                fontSize={{ base: "md", md: "lg" }}
              >
                {t("yourAllocation.description.capitalGrowth.label")}
              </Text>
            </Text>
            <br />
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.400">
              {t("yourAllocation.description.capitalGrowth.description.text1")}{" "}
              <Text
                as="span"
                color="primary.500"
                fontSize={{ base: "md", md: "lg" }}
              >
                {t(
                  "yourAllocation.description.capitalGrowth.description.text2",
                )}
              </Text>{" "}
              <Text
                as="span"
                fontSize={{ base: "md", md: "lg" }}
                color="gray.400"
              >
                {t(
                  "yourAllocation.description.capitalGrowth.description.text3",
                )}
              </Text>{" "}
              <Text
                as="span"
                fontSize={{ base: "md", md: "lg" }}
                color="primary.500"
              >
                {t(
                  "yourAllocation.description.capitalGrowth.description.text4",
                )}
              </Text>{" "}
              <Text
                as="span"
                fontSize={{ base: "md", md: "lg" }}
                color="gray.400"
              >
                {t(
                  "yourAllocation.description.capitalGrowth.description.text5",
                )}
              </Text>
            </Text>
          </>
        ) : (
          <>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.400">
              {t("yourAllocation.description.startingText")}{" "}
              <Text as="span" color="primary.500">
                {t("yourAllocation.description.capitalYield.label")}
              </Text>
            </Text>
            <br />
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.400">
              {t("yourAllocation.description.capitalYield.description.text1")}{" "}
              <Text
                as="span"
                fontSize={{ base: "md", md: "lg" }}
                color="primary.500"
              >
                {t("yourAllocation.description.capitalYield.description.text2")}
              </Text>{" "}
              <Text
                as="span"
                fontSize={{ base: "md", md: "lg" }}
                color="gray.400"
              >
                {t("yourAllocation.description.capitalYield.description.text3")}
              </Text>{" "}
              <Text as="span" color="primary.500">
                {t("yourAllocation.description.capitalYield.description.text4")}
              </Text>{" "}
              <Text
                as="span"
                fontSize={{ base: "md", md: "lg" }}
                color="gray.400"
              >
                {t("yourAllocation.description.capitalYield.description.text5")}
              </Text>
            </Text>
          </>
        )}
      </Box>

      <SimpleGrid
        columns={{ base: 2, md: 4 }}
        spacing={{ base: 1, md: 3 }}
        mt={{ base: 6, md: 12 }}
        maxW={{ base: "sm", md: "full" }}
      >
        {(postulates || []).map((val, index) => {
          return (
            <Box aria-label="summaryMetrics" bg="gray.800" key={index}>
              <VStack
                spacing="1"
                ps="6"
                pe={{ base: 0, md: 4 }}
                alignItems="start"
                pb={{ base: 0, md: 6 }}
                py={{ base: "4", md: "6" }}
              >
                <HStack
                  alignItems={{ base: "baseline", md: "flex-start" }}
                  flexWrap={{ base: "nowrap" }}
                  spacing="2"
                  pe={{ base: 6, md: 2 }}
                  w={{ base: "full", md: "full" }}
                  justifyContent={{ base: "space-between", md: "flex-start" }}
                >
                  <Text
                    fontSize="xs"
                    color="gray.400"
                    pt={{ base: "2px", md: "1" }}
                  >
                    {t(`yourAllocation.proposalFacts.${val.label}.label`)}
                  </Text>
                  <Tooltip
                    id={t(`yourAllocation.proposalFacts.${val.label}.label`)}
                    hasArrow
                    label={val.description}
                    placement="bottom"
                    textAlign="center"
                    sx={{
                      whiteSpace: "pre-line",
                    }}
                  >
                    <chakra.span
                      id={t(`yourAllocation.proposalFacts.${val.label}.label`)}
                    >
                      <InfoIcon
                        aria-label="Info icon"
                        color="primary.500"
                        cursor="pointer"
                      />
                    </chakra.span>
                  </Tooltip>
                </HStack>
                <Text fontSize="lg">
                  {val.label !== "sharpeRatio"
                    ? (Number(val?.percent) * 100).toFixed(1)
                    : Number(val?.percent).toFixed(2)}
                  {val.label !== "sharpeRatio" && "%"}
                </Text>
              </VStack>
            </Box>
          )
        })}
      </SimpleGrid>
    </Container>
  )
}

export default ProposalOverview
