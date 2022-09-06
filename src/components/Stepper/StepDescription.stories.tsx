import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import StepDescription from "./StepDescription"

export default {
  title: "Stepper/Step Description",
  argTypes: {
    label: {
      type: "string",
      defaultValue: "Stepper Description",
    },
  },
  component: StepDescription,
} as ComponentMeta<typeof StepDescription>

export const Default = createStory((args) => (
  <StepDescription>{args.label}</StepDescription>
))
