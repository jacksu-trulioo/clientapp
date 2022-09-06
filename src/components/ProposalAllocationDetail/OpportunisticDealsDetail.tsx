import {
  Box,
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
  AllocationCategory,
  ProposalDealsGridObj,
  Strategy,
  YOUR_ALLOCATION_DETAIL,
} from "~/services/mytfo/types"

import AbsoluteReturnOpportunisticDealsGrid from "./AbsoluteReturnOpportunisticDealsGrid"
import AllocationPieChart from "./AllocationPieChart"
import CapitalDealsGrid from "./CapitalDealsGrid"

interface OpportunisticDetailProps {
  opportunisticDetails: Strategy
  dealsGridList?: ProposalDealsGridObj[]
  pdfGenerating?: boolean
}

const OpportunisticDealsDetail: React.FC<OpportunisticDetailProps> = (
  props,
) => {
  const { pdfGenerating = false } = props
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const { t, lang } = useTranslation("personalizedProposal")

  const { data: proposalDealsList, error: proposalDealsListError } = useSWR<
    ProposalDealsGridObj[]
  >([`/api/portfolio/proposal/deals?id=Opportunistic`, lang], (url, lang) =>
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

      filteredFundsArr.push({
        assetClass: value?.assetClass,
        assets: newFilteredArr,
      })
    })

  const opportunisticDealsArr = filteredDealsArr.filter(
    (val) => val?.assets.length > 0,
  )

  const isLoading = !proposalDealsList && !proposalDealsListError
  const isLoadingDealsArr = !filteredDealsArr && !proposalDealsListError

  return (
    <Fragment>
      <Flex flexDirection="row" alignItems="flex-end" mb={6}>
        <Box minW="111px" h="111px" flex="1" me="10">
          <AllocationPieChart
            pieChartData={[
              {
                value: Number(
                  props.opportunisticDetails.percentageAllocation * 100,
                ),
                allocationCategory: YOUR_ALLOCATION_DETAIL.OPPORTUNISTIC,
              },
              {
                value:
                  100 -
                  Number(props.opportunisticDetails.percentageAllocation * 100),
                allocationCategory: "Default",
              },
            ]}
          />
        </Box>
        <VStack
          display="flex"
          w="full"
          {...(!isMobileView && {
            alignSelf: "flex-start",
          })}
        >
          <Flex
            flexDirection={{ base: "column", md: "row" }}
            justifyContent="space-between"
            w="100%"
            mb={4}
          >
            <VStack alignItems="flex-start">
              <Heading fontSize="md" color="gray.400">
                {t("yourAllocationDetail.opportunistic.title")}
              </Heading>
              <Text fontSize={{ base: "md", md: "md" }} color="white">
                {(
                  props.opportunisticDetails.percentageAllocation * 100
                ).toFixed(0)}
                {t("yourAllocationDetail.opportunistic.percentageOfAllocation")}
              </Text>
            </VStack>
          </Flex>
          {!isMobileView && (
            <Text fontSize="sm" color="gray.400" alignSelf="flex-start">
              {t("yourAllocationDetail.opportunistic.opportunisticDescription")}
            </Text>
          )}
        </VStack>
      </Flex>
      {isMobileView && (
        <Text fontSize="sm" mb={8} color="gray.400">
          {t("yourAllocationDetail.opportunistic.opportunisticDescription")}
        </Text>
      )}

      {!isLoading && filteredFundsArr?.length > 0 && (
        <AbsoluteReturnOpportunisticDealsGrid
          componentName={YOUR_ALLOCATION_DETAIL.OPPORTUNISTIC}
          gridDealsList={filteredFundsArr || []}
          strategy={AllocationCategory.Opportunistic}
          pdfGenerating={pdfGenerating}
        />
      )}

      {!isLoadingDealsArr && opportunisticDealsArr?.length > 0 && (
        <CapitalDealsGrid
          componentName={YOUR_ALLOCATION_DETAIL.CAPITAL_YIELD_DEALS}
          gridDealsList={opportunisticDealsArr || []}
          pdfGenerating={pdfGenerating}
        />
      )}
    </Fragment>
  )
}
export default OpportunisticDealsDetail
