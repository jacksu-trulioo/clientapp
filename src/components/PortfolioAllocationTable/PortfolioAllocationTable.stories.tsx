import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import PortfolioAllocationTable from "./PortfolioAllocationTable"

export default {
  title: "Basics/AllocationChart",
  component: PortfolioAllocationTable,
  argTypes: {
    allocationTableData: {
      defaultValue: [],
    },
    tablePage: {
      Title: "Page",
      Description: "Page where table used",
      defaultValue: "",
    },
  },
} as ComponentMeta<typeof PortfolioAllocationTable>
export const Default = createStory<typeof PortfolioAllocationTable>((args) => (
  <PortfolioAllocationTable {...args} />
))
