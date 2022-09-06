import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import StepButton from "./StepButton"

export default {
  title: "Stepper/StepButton",
} as ComponentMeta<typeof StepButton>

export const Default = createStory<typeof StepButton>(() => (
  <StepButton>Click Me</StepButton>
))
