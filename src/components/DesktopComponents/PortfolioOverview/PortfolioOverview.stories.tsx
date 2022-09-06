import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import PortfolioOverview from "./PortfolioOverview"

export default {
  title: "Basics/PortfolioOverview",
  component: PortfolioOverview,
  argTypes: {
    viewOverViewTitle: {
      name: "View Type",
      description: "Test Description",
      type: "string",
      control: "text",
      options: [],
      defaultValue: "Portfolio Overview",
    },
  },
} as ComponentMeta<typeof PortfolioOverview>

export const Default = createStory<typeof PortfolioOverview>((args) => (
  <PortfolioOverview {...args}></PortfolioOverview>
))
