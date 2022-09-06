import { FlexProps } from "@chakra-ui/layout"
import React from "react"

import ProposalTitleWithIndicater from "../ProposalTitleWithIndicater"
import { useInvestorProfileFormContext } from "./InvestorProfileFormContext"

export type ProposalTitleWithIndicaterProps = Pick<FlexProps, "children"> & {
  heading: string
  description?: string
  infoHeading?: string
  infoDescription?: string
}

const InvesterProfileTitleBox = (props: ProposalTitleWithIndicaterProps) => {
  const { pages, currentPageIndex } = useInvestorProfileFormContext()

  return (
    <ProposalTitleWithIndicater
      pages={pages}
      currentPageIndex={currentPageIndex}
      {...props}
    />
  )
}

export default InvesterProfileTitleBox
