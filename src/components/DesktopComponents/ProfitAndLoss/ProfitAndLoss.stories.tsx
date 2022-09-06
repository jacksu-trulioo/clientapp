import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import ProfitAndLoss from "./ProfitAndLoss"

export default {
  title: "Basics/ProfitAndLoss",
  component: ProfitAndLoss,
  argTypes: {
    ProfitAndLossTitle: {
      name: "View Type",
      description: "Test Description",
      type: "string",
      control: "text",
      options: [],
      defaultValue: "ProfitAndLoss",
    },
  },
} as ComponentMeta<typeof ProfitAndLoss>

export const Default = createStory<typeof ProfitAndLoss>((args) => (
  <ProfitAndLoss {...args} />
))
