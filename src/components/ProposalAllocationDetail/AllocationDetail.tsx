import {
  Box,
  Container,
  Divider,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment } from "react"

import { Strategies } from "~/services/mytfo/types"
import { strategyAllocationDetail } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

import AbsoluteReturnDealsDetail from "./AbsoluteReturnDealsDetail"
import CapitalGrowthDealsDetail from "./CapitalGrowthDealsDetail"
import CapitailYieldingDealsDetail from "./CapitalYieldingDealsDetail"
import OpportunisticDealsDetail from "./OpportunisticDealsDetail"

interface AllocationDetailProps {
  allocationDetails: Strategies
  selectedProposal: number
  proposalData: Strategies
  pdfGenerating?: boolean
}

export enum AllocationCategory {
  CapitalYielding = "Capital Yielding",
  CapitalGrowth = "Capital Growth",
  Opportunistic = "Opportunistic",
  AbsoluteReturn = "Absolute Return",
}

const AllocationDetail: React.FC<AllocationDetailProps> = (props) => {
  const { t } = useTranslation("personalizedProposal")
  let { allocationDetails, proposalData, pdfGenerating = false } = props

  const isMobileView = useBreakpointValue({ base: true, md: false })

  if (!allocationDetails) {
    allocationDetails = { ...proposalData }
  }

  // @ts-ignore
  let StrategyArr = []

  const capitalGrowthPercentageAllocation =
    allocationDetails?.capitalGrowth?.percentageAllocation
  const capitalYieldPercentageAllocation =
    allocationDetails?.capitalYielding?.percentageAllocation
  const opportunisticPercentageAllocation =
    allocationDetails?.opportunistic?.percentageAllocation
  const absoluteReturnPercentageAllocation =
    allocationDetails?.absoluteReturn?.percentageAllocation

  if (capitalGrowthPercentageAllocation > 0)
    StrategyArr.push({
      title: t("yourAllocationDetail.labels.capitalGrowth"),
      percentage: capitalGrowthPercentageAllocation,
    })
  if (capitalYieldPercentageAllocation > 0)
    StrategyArr.push({
      title: t("yourAllocationDetail.labels.capitalYielding"),
      percentage: capitalYieldPercentageAllocation,
    })
  if (opportunisticPercentageAllocation > 0)
    StrategyArr.push({
      title: t("yourAllocationDetail.labels.opportunistic"),
      percentage: opportunisticPercentageAllocation,
    })
  if (absoluteReturnPercentageAllocation > 0)
    StrategyArr.push({
      title: t("yourAllocationDetail.labels.absoluteReturn"),
      percentage: absoluteReturnPercentageAllocation,
    })

  if (isMobileView && props.pdfGenerating) {
    return (
      <Container as="section" maxW="full" px="0" pt={4}>
        {capitalGrowthPercentageAllocation > 0 && (
          <CapitalGrowthDealsDetail
            pdfGenerating={props.pdfGenerating}
            capitalGrowthDetails={allocationDetails.capitalGrowth}
          />
        )}
        {capitalYieldPercentageAllocation > 0 && (
          <CapitailYieldingDealsDetail
            pdfGenerating={props.pdfGenerating}
            capitalYieldingDetails={allocationDetails.capitalYielding}
          />
        )}
        {opportunisticPercentageAllocation > 0 && (
          <OpportunisticDealsDetail
            pdfGenerating={props.pdfGenerating}
            opportunisticDetails={allocationDetails.opportunistic}
          />
        )}
        {absoluteReturnPercentageAllocation > 0 && (
          <AbsoluteReturnDealsDetail
            pdfGenerating={props.pdfGenerating}
            absoluteReturnDetails={allocationDetails.absoluteReturn}
          />
        )}
      </Container>
    )
  }

  return !isMobileView ? (
    <Fragment>
      <Box>
        <Heading fontSize={{ base: "md", md: "xl" }} color="white" mb={6}>
          {t("yourAllocationDetail.heading")}
        </Heading>
      </Box>

      {pdfGenerating ? (
        <>
          {capitalGrowthPercentageAllocation > 0 && (
            <CapitalGrowthDealsDetail
              pdfGenerating={pdfGenerating}
              capitalGrowthDetails={allocationDetails.capitalGrowth}
            />
          )}
          {capitalYieldPercentageAllocation > 0 && (
            <CapitailYieldingDealsDetail
              pdfGenerating={props.pdfGenerating}
              capitalYieldingDetails={allocationDetails.capitalYielding}
            />
          )}
          {opportunisticPercentageAllocation > 0 && (
            <OpportunisticDealsDetail
              pdfGenerating={props.pdfGenerating}
              opportunisticDetails={allocationDetails.opportunistic}
            />
          )}
          {absoluteReturnPercentageAllocation > 0 && (
            <AbsoluteReturnDealsDetail
              pdfGenerating={props.pdfGenerating}
              absoluteReturnDetails={allocationDetails.absoluteReturn}
            />
          )}
        </>
      ) : (
        <Tabs
          colorScheme="primary"
          isFitted
          defaultIndex={0}
          isLazy
          onChange={(index) => {
            event({
              ...strategyAllocationDetail,
              // @ts-ignore
              label: `Click on the tab of  ${StrategyArr[index]?.title} available in the proposal`,
            })
          }}
        >
          <TabList>
            {StrategyArr?.map((item, index) => {
              return (
                <Tab
                  _selected={{
                    color: "white",
                    borderBottomColor: "primary.500",
                    fontWeight: "bold",
                  }}
                  fontSize="md"
                  _focus={{ boxShadow: "none" }}
                  key={index}
                >
                  {item?.title}
                </Tab>
              )
            })}
          </TabList>

          <TabPanels>
            {capitalGrowthPercentageAllocation > 0 && (
              <TabPanel py={6}>
                <CapitalGrowthDealsDetail
                  pdfGenerating={pdfGenerating}
                  capitalGrowthDetails={allocationDetails.capitalGrowth}
                />
              </TabPanel>
            )}

            {capitalYieldPercentageAllocation > 0 && (
              <TabPanel py={6}>
                <CapitailYieldingDealsDetail
                  pdfGenerating={pdfGenerating}
                  capitalYieldingDetails={allocationDetails.capitalYielding}
                />
              </TabPanel>
            )}

            {opportunisticPercentageAllocation > 0 && (
              <TabPanel py={6}>
                <OpportunisticDealsDetail
                  pdfGenerating={pdfGenerating}
                  opportunisticDetails={allocationDetails.opportunistic}
                />
              </TabPanel>
            )}

            {absoluteReturnPercentageAllocation > 0 && (
              <TabPanel py={6}>
                <AbsoluteReturnDealsDetail
                  pdfGenerating={pdfGenerating}
                  absoluteReturnDetails={allocationDetails.absoluteReturn}
                />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      )}
      <Divider borderColor="gray.400" my="8"></Divider>
    </Fragment>
  ) : null
}

export default AllocationDetail
