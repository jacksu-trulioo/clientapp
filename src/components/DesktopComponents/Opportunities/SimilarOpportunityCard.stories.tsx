import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import OpportunityCard from "./OpportunityCard"

export default {
  title: "Basics/OpportunityCard",
  component: OpportunityCard,
  argTypes: {
    isShariah: {
      name: "Shariah Tag",
      description: "Shariah Tag",
      type: "boolean",
      defaultValue: true,
    },
    title: {
      name: "Title",
      description: "Title",
      type: "string",
      defaultValue: "Name of the deal",
    },
    subTitle: {
      name: "Sub-Title",
      description: "Sub-Title",
      type: "string",
      defaultValue: "Sub-Title of the deal",
    },
    isCTA: {
      name: "Is CTA",
      description: "Is CTA",
      type: "boolean",
      defaultValue: true,
    },
    ctaText: {
      name: "CTA Link Text",
      description: "CTA Link Text",
      type: "string",
      defaultValue: "View Details",
    },
    ctaLink: {
      name: "CTA Link",
      description: "CTA Link",
      type: "string",
      defaultValue: "https://google.com/",
    },
  },
} as ComponentMeta<typeof OpportunityCard>
export const Default = createStory<typeof OpportunityCard>((args) => (
  <OpportunityCard {...args} />
))
