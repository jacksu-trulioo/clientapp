/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface CapitalYieldingDetailProps {
  capitalYieldingDetails: Strategy
  dealsGridList?: ProposalDealsGridObj[]
  pdfGenerating?: boolean
}
const CapitailYieldingDealsDetail: React.FC<CapitalYieldingDetailProps> = (
  props,
) => {
  const { pdfGenerating = false } = props
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const { t, lang } = useTranslation("personalizedProposal")

  const { data: proposalDealsList, error: proposalDealsListError } = useSWR<
    ProposalDealsGridObj[]
  >([`/api/portfolio/proposal/deals?id=Capital Yielding`, lang], (url, lang) =>
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

  const capitalYieldDeals = filteredDealsArr.filter(
    (val) => val?.assets?.length > 0,
  )

  const isLoading = !proposalDealsList && !proposalDealsListError
  const isLoadingFundsArr = !filteredFundsArr && !proposalDealsListError

  return (
    <Fragment>
      <Flex
        flexDirection={"row"}
        alignItems={{ base: "center", md: "flex-end" }}
        mb={6}
      >
        <Box minW="111px" h="111px" flex="1" me={"10"}>
          <AllocationPieChart
            pieChartData={[
              {
                value: Number(
                  props.capitalYieldingDetails.percentageAllocation * 100,
                ),
                allocationCategory: YOUR_ALLOCATION_DETAIL.CAPITAL_YIELDING,
              },
              {
                value:
                  100 -
                  Number(
                    props.capitalYieldingDetails.percentageAllocation * 100,
                  ),
                allocationCategory: "Default",
              },
            ]}
          />
        </Box>
        <VStack
          display={"flex"}
          w="full"
          alignItems={{ base: "inherit", md: "self-end" }}
        >
          <Flex
            justifyContent="space-between"
            w="100%"
            mb={4}
            flexDirection={{ base: "column", md: "row" }}
          >
            <VStack alignItems="flex-start">
              <Heading fontSize={{ base: "md", md: "md" }} color="gray.400">
                {t("yourAllocationDetail.capitalYielding.title")}
              </Heading>
              <Text fontSize={{ base: "md", md: "md" }} color="white">
                {(
                  props.capitalYieldingDetails.percentageAllocation * 100
                ).toFixed(0)}
                {t("yourAllocationDetail.capitalGrowth.percentageOfAllocation")}
              </Text>
            </VStack>
          </Flex>
          {!isMobileView && (
            <Text fontSize="14px" color="gray.400">
              {t("yourAllocationDetail.capitalYielding.capitalYieldingDesc")}
            </Text>
          )}
        </VStack>
      </Flex>
      {isMobileView && (
        <Text fontSize="14px" mb={8} color="gray.400">
          {t("yourAllocationDetail.capitalYielding.capitalYieldingDesc")}
        </Text>
      )}
      <Divider></Divider>
      <Text mt={3} fontSize={"md"} color={"white"}>
        {t("yourAllocationDetail.capitalYielding.assetClassTitle")}
      </Text>
      <Text mt={6} fontSize={"md"} color={"gray.400"} mb={6}>
        {t("yourAllocationDetail.capitalYielding.assetClassDesc")}
      </Text>
      {!isLoading && (
        <CapitalDealsGrid
          componentName={YOUR_ALLOCATION_DETAIL.CAPITAL_YIELD_DEALS}
          gridDealsList={capitalYieldDeals || []}
          pdfGenerating={pdfGenerating}
        />
      )}
      {!isLoadingFundsArr && filteredFundsArr.length > 0 && (
        <AbsoluteReturnOpportunisticDealsGrid
          gridDealsList={filteredFundsArr || []}
          componentName={YOUR_ALLOCATION_DETAIL.CAPITAL_YIELD_DEALS}
          strategy=""
          pdfGenerating={pdfGenerating}
        />
      )}
    </Fragment>
  )
}
export default CapitailYieldingDealsDetail
