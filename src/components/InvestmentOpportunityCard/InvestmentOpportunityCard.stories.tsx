import { ComponentMeta } from "@storybook/react"

import InvestmentOpportunityCard from "~/components/InvestmentOpportunityCard/InvestmentOpportunityCard"
import {
  AllocationCategory,
  UserQualificationStatus,
} from "~/services/mytfo/types"
import { createStory } from "~/utils/storybook-util/createStory"

export default {
  title: "InvestmentOpportunityCard",
  component: InvestmentOpportunityCard,
  decorators: [
    (Story) => (
      <div style={{ width: "290px" }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof InvestmentOpportunityCard>

const Template = createStory<typeof InvestmentOpportunityCard>((args) => (
  <InvestmentOpportunityCard {...args} />
))
export const Default = Template.bind({})
Default.args = {
  data: {
    id: "mock id",
    title: "Mock Title",
    titleSanitized: "Mocked Sanitized Title",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat\n",
    image: "/../public/images/continent.svg",
    assetClass: "Equities",
    country: "United States",
    document: "pdf url",
    sector: "Financials",
    isShariahCompliant: true,
    sponsor: "Mock Sponsor",
    expectedExit: "Mock exit",
    component: "",
    expectedReturn: "XX%",
    videoLink: "",
    isNewOpportunity: true,
    strategy: AllocationCategory.CapitalGrowth,
    isOpportunityClosed: false,
  },
  variant: "detailed",
  status: UserQualificationStatus.Verified,
  hasOverlay: false,
}

export const MinimalInvestmentOpportunityCard = Default.bind({})
MinimalInvestmentOpportunityCard.args = {
  ...Default.args,
  variant: "summary",
  hasOverlay: false,
}

export const UnverifiedUserInvestmentOpportunityCard = Default.bind({})
UnverifiedUserInvestmentOpportunityCard.args = {
  ...Default.args,
  status: UserQualificationStatus.Unverified,
  hasOverlay: true,
}
