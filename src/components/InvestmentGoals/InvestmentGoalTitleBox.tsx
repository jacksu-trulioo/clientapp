import { FlexProps } from "@chakra-ui/layout"
import React, { ReactElement } from "react"
import useSWR from "swr"

import { InvestorProfileGoals } from "~/services/mytfo/types"

import ProposalTitleWithIndicater from "../ProposalTitleWithIndicater"
import { useInvestmentGoalsFormContext } from "./InvestmentGoalsFormContext"

export type InvestmentGoalTitleBoxProps = Pick<FlexProps, "children"> & {
  heading: string
  description?: string
  infoHeading?: string
  infoDescription?: string
  isValueWithIcon?: boolean
  infoCard?: ReactElement | boolean
}

const InvestmentGoalTitleBox = (props: InvestmentGoalTitleBoxProps) => {
  const { pages, currentPageIndex } = useInvestmentGoalsFormContext()
  const { data: investmentGoals } = useSWR<InvestorProfileGoals>(
    "/api/user/investment-goals",
  )
  const getTotalPages = () => {
    if ((investmentGoals?.investmentAmountInUSD || 0) < 10000000) {
      return pages.filter((item) => item !== "8")
    }
    return pages
  }
  const getCurrentPageIndex = () => {
    if ((investmentGoals?.investmentAmountInUSD || 0) < 10000000) {
      if (currentPageIndex === 6) return 5
      if (currentPageIndex === 7) return 6
    }
  }
  return (
    <ProposalTitleWithIndicater
      pages={getTotalPages()}
      currentPageIndex={getCurrentPageIndex() || currentPageIndex}
      {...props}
    />
  )
}

export default InvestmentGoalTitleBox
