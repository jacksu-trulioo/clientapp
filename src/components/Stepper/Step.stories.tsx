import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import Step from "./Step"

export default {
  title: "Stepper/Step",
  component: Step,
  argTypes: {
    index: {
      type: "number",
      defaultValue: 0,
    },
    beingVerified: {
      type: "boolean",
      defaultValue: false,
    },
    completed: {
      type: "boolean",
      defaultValue: false,
    },
  },
} as ComponentMeta<typeof Step>

export const Default = createStory((args) => <Step {...args} />)
