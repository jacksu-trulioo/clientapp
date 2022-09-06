import { Container } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment } from "react"
import useSWR from "swr"

import { Layout } from "~/components"
import AbsoluteReturnDealsDetail from "~/components/ProposalAllocationDetail/AbsoluteReturnDealsDetail"
import CapitalGrowthDealsDetail from "~/components/ProposalAllocationDetail/CapitalGrowthDealsDetail"
import CapitailYieldingDealsDetail from "~/components/ProposalAllocationDetail/CapitalYieldingDealsDetail"
import OpportunisticDealsDetail from "~/components/ProposalAllocationDetail/OpportunisticDealsDetail"
import siteConfig from "~/config"
import {
  AllocationCategory,
  MyProposal,
  ProposalDealsGridObj,
} from "~/services/mytfo/types"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function MyProposalScreen() {
  const { lang } = useTranslation("personalizedProposal")
  const router = useRouter()
  let allocationDetailCategory = router.query?.id
  /**
   * @param allocationDetailCategory<String>
   * @desc It's used to select the allocation category type
   */
  switch (allocationDetailCategory) {
    case "capital-yielding":
      allocationDetailCategory = AllocationCategory.CapitalYielding
      break
    case "capital-growth":
      allocationDetailCategory = AllocationCategory.CapitalGrowth
      break
    case "opportunistic":
      allocationDetailCategory = AllocationCategory.Opportunistic
      break
    case "absolute-return":
      allocationDetailCategory = AllocationCategory.AbsoluteReturn
      break
    default:
      router.push("/404")
  }
  /**
   * @desc it's used for fetching proposal details from server
   */
  const {
    data: personalizedProposalData,
    error: personalizedProposalDataError,
  } = useSWR<MyProposal[]>("/api/user/proposals")
  /**
   * @desc it's used for fetching proposal deals details from server
   */
  const { data: proposalDeals, error: proposalDealsError } = useSWR<
    ProposalDealsGridObj[]
  >(
    [`/api/portfolio/proposal/deals?id=${allocationDetailCategory}`, lang],
    (url, lang) =>
      fetch(url, {
        headers: {
          "Accept-Language": lang,
        },
      }).then((res) => res.json()),
  )
  const isLoading =
    (!personalizedProposalData && !personalizedProposalDataError) ||
    (!proposalDeals && !proposalDealsError)
  return (
    <Layout title={""} description={""}>
      <Container as="section" maxW="full" px="0" pt={4}>
        {!isLoading &&
          personalizedProposalData &&
          personalizedProposalData[0].strategies &&
          allocationDetailCategory && (
            <Fragment>
              {allocationDetailCategory === AllocationCategory.CapitalGrowth &&
                proposalDeals && (
                  <CapitalGrowthDealsDetail
                    capitalGrowthDetails={
                      personalizedProposalData[
                        Number(router.query?.selectedProposal)
                      ].strategies.capitalGrowth
                    }
                    dealsGridList={proposalDeals}
                  />
                )}
              {allocationDetailCategory ===
                AllocationCategory.CapitalYielding &&
                proposalDeals && (
                  <CapitailYieldingDealsDetail
                    capitalYieldingDetails={
                      personalizedProposalData[
                        Number(router.query?.selectedProposal)
                      ].strategies.capitalYielding
                    }
                    dealsGridList={proposalDeals}
                  />
                )}
              {allocationDetailCategory === AllocationCategory.Opportunistic &&
                proposalDeals && (
                  <OpportunisticDealsDetail
                    opportunisticDetails={
                      personalizedProposalData[
                        Number(router.query?.selectedProposal)
                      ].strategies.opportunistic
                    }
                    dealsGridList={proposalDeals}
                  />
                )}
              {allocationDetailCategory === AllocationCategory.AbsoluteReturn &&
                proposalDeals && (
                  <AbsoluteReturnDealsDetail
                    absoluteReturnDetails={
                      personalizedProposalData[
                        Number(router.query?.selectedProposal)
                      ].strategies.absoluteReturn
                    }
                    dealsGridList={proposalDeals}
                  />
                )}
            </Fragment>
          )}
      </Container>
    </Layout>
  )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { res } = ctx
  const { personalizedProposalEnabled } = siteConfig?.featureFlags
  if (!personalizedProposalEnabled) {
    res.writeHead(302, { Location: "/" })
    res.end()
  }
  return {
    props: {},
  }
}
export default withPageAuthRequired(MyProposalScreen)
