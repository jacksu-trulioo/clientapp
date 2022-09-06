import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import OpportunityCard from "./OpportunityCard"

export default {
  title: "Basics/OpportunityImgCard",
  component: OpportunityCard,
  argTypes: {
    OpportunityImgCardType: {
      name: "OpportunityImgCard Type",
      description: "Test Description",
      type: "string",
    },
  },
} as ComponentMeta<typeof OpportunityCard>
export const Default = createStory<typeof OpportunityCard>((args) => (
  <OpportunityCard {...args} />
))
