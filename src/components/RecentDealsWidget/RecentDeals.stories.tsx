import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import RecentDealsCard from "./RecentDealsCard"

export default {
  title: "Basics/RecentDeals",
  component: RecentDealsCard,
  argTypes: {
    viewType: {
      name: "View Type",
      description: "Test Description",
      type: "string",
      control: "radio",
      options: ["all", "moneyInvested", "distribution"],
      defaultValue: "all",
    },
    activityData: {
      name: "Activity Data",
      description: "Test Description",
      defaultValue: {
        month: 3,
        moneyInvested: 1000,
        recentFunding: 1000,
        distribution: {
          capitalGain: 1000,
          incomeDistribution: 1000,
        },
      },
    },
  },
} as ComponentMeta<typeof RecentDealsCard>

export const Default = createStory<typeof RecentDealsCard>((args) => (
  <RecentDealsCard {...args}></RecentDealsCard>
))
