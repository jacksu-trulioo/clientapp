import {
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment } from "react"
import useSWR from "swr"

import {
  ProposalDealsGridObj,
  Strategy,
  YOUR_ALLOCATION_DETAIL,
} from "~/services/mytfo/types"

import AbsoluteReturnOpportunisticDealsGrid from "./AbsoluteReturnOpportunisticDealsGrid"
import AllocationPieChart from "./AllocationPieChart"
import CapitalDealsGrid from "./CapitalDealsGrid"

interface CapitalGrowthDetailProps {
  capitalGrowthDetails: Strategy
  dealsGridList?: ProposalDealsGridObj[]
  pdfGenerating?: boolean
}

const CapitailGrowthDealsDetail: React.FC<CapitalGrowthDetailProps> = (
  props,
) => {
  const { pdfGenerating = false } = props
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const { t, lang } = useTranslation("personalizedProposal")

  const { data: proposalDealsList, error: proposalDealsListError } = useSWR<
    ProposalDealsGridObj[]
  >([`/api/portfolio/proposal/deals?id=Capital Growth`, lang], (url, lang) =>
    fetch(url, {
      headers: {
        "Accept-Language": lang,
      },
    }).then((res) => res.json()),
  )

  let filteredDealsArr = [] as ProposalDealsGridObj[]

  proposalDealsList &&
    proposalDealsList.map((value) => {
      const newFilteredArr = value.assets.filter(
        (val) => val.assetType !== "fund",
      )
      filteredDealsArr.push({
        assetClass: value?.assetClass,
        assets: newFilteredArr,
      })
    })

  let filteredFundsArr = [] as ProposalDealsGridObj[]

  proposalDealsList &&
    proposalDealsList.map((value) => {
      const newFilteredArr = value.assets.filter(
        (val) => val.assetType !== "deal",
      )

      // @ts-ignore
      if (newFilteredArr?.length > 0)
        filteredFundsArr.push({
          assetClass: value?.assetClass,
          assets: newFilteredArr,
        })
    })

  const capitalGrowthDeals = filteredDealsArr.filter(
    (val) => val?.assets?.length > 0,
  )

  const isLoading = !filteredDealsArr && !proposalDealsListError
  const isLoadingFundsArr = !filteredFundsArr && !proposalDealsListError
  return (
    <Fragment>
      <Flex flexDirection="row" alignItems="flex-end" mb={6}>
        <Box minW="111px" h="111px" flex="1" me="10">
          <AllocationPieChart
            pieChartData={[
              {
                value:
                  Number(props.capitalGrowthDetails.percentageAllocation) * 100,
                allocationCategory: YOUR_ALLOCATION_DETAIL.CAPITAL_GROWTH,
              },
              {
                value:
                  100 -
                  Number(props.capitalGrowthDetails.percentageAllocation * 100),
                allocationCategory: "Default",
              },
            ]}
          />
        </Box>
        <VStack display="flex" w="full" alignItems="start">
          <Flex
            align="center"
            flexDirection={{ base: "column", md: "row" }}
            justifyContent="space-between"
            w="100%"
            mb={4}
          >
            <VStack alignItems="flex-start">
              <Heading fontSize="md" color="gray.400">
                {t("yourAllocationDetail.capitalGrowth.title")}
              </Heading>
              <Text fontSize="md" color="white">
                {(
                  props.capitalGrowthDetails.percentageAllocation * 100
                ).toFixed(0)}
                {t("yourAllocationDetail.capitalGrowth.percentageOfAllocation")}
              </Text>
            </VStack>
          </Flex>
          {!isMobileView && (
            <Text fontSize="sm" color="gray.400">
              {t("yourAllocationDetail.capitalGrowth.capitalGrowthDesc")}
            </Text>
          )}
        </VStack>
      </Flex>
      {isMobileView && (
        <Text fontSize="sm" mb={8} color="gray.400">
          {t("yourAllocationDetail.capitalGrowth.capitalGrowthDesc")}
        </Text>
      )}
      <Divider></Divider>
      <Text mt={{ base: "8", md: "3" }} fontSize="md" color="white">
        {t("yourAllocationDetail.capitalGrowth.assetClassTitle")}
      </Text>
      <Text mt={6} fontSize="md" color="gray.400" mb={6}>
        {t("yourAllocationDetail.capitalGrowth.assetClassDesc")}
      </Text>
      {!isLoading && (
        <CapitalDealsGrid
          componentName={YOUR_ALLOCATION_DETAIL.CAPITAL_GROWTH_DEALS}
          gridDealsList={capitalGrowthDeals || []}
          pdfGenerating={pdfGenerating}
        />
      )}

      {!isLoadingFundsArr && filteredFundsArr.length > 0 && (
        <AbsoluteReturnOpportunisticDealsGrid
          gridDealsList={filteredFundsArr || []}
          componentName={YOUR_ALLOCATION_DETAIL.CAPITAL_GROWTH_DEALS}
          strategy=""
          pdfGenerating={pdfGenerating}
        />
      )}
    </Fragment>
  )
}
export default CapitailGrowthDealsDetail
