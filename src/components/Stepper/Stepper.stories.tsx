import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import Step from "./Step"
import Stepper from "./Stepper"

export default {
  title: "Stepper/Stepper",
  component: Stepper,
  argTypes: {
    numberOfSteps: {
      type: "number",
      defaultValue: 1,
    },
    activeStep: {
      type: "number",
      defaultValue: 1,
    },
    orientation: {
      defaultValue: "horizontal",
    },
  },
} as ComponentMeta<typeof Stepper>

export const Default = createStory((args) => (
  <Stepper {...args}>
    {[...Array(args.numberOfSteps)].map((v, i) => {
      return <Step key={i} index={i} />
    })}
  </Stepper>
))
