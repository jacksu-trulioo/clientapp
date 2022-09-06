import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import AllocationChart from "./PortfolioAllocationChart"

export default {
  title: "Basics/AllocationChart",
  component: AllocationChart,
  argTypes: {
    allocationChartData: {
      defaultValue: [],
    },
  },
} as ComponentMeta<typeof AllocationChart>
export const Default = createStory<typeof AllocationChart>((args) => (
  <AllocationChart {...args} />
))
