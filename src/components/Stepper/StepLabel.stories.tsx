import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import StepLabel from "./StepLabel"

export default {
  title: "Stepper/Step Label",
  component: StepLabel,
  argTypes: {
    label: {
      type: "string",
      defaultValue: "Step Label",
    },
  },
} as ComponentMeta<typeof StepLabel>

export const Default = createStory((args) => (
  <StepLabel>{args.label}</StepLabel>
))
