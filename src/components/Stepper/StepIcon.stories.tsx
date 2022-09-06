import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import StepIcon from "./StepIcon"

export default {
  title: "Stepper/Step Icon",
  component: StepIcon,
} as ComponentMeta<typeof StepIcon>

export const Default = createStory(() => <StepIcon />)
