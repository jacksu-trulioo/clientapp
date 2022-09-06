import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import AllocationStep from "./AllocationSteps"

export default {
  title: "Allocation Chart/Steps",
  component: AllocationStep,
} as ComponentMeta<typeof AllocationStep>

const Default: ComponentStory<typeof AllocationStep> = (args) => {
  return <AllocationStep {...args} />
}

export const rounded = Default.bind({})
rounded.args = {
  index: 1,
}
