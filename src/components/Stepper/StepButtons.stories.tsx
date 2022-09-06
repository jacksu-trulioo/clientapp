import { ComponentMeta } from "@storybook/react"

import { StepButtons } from "~/components"
import { createStory } from "~/utils/storybook-util/createStory"

export default {
  title: "Stepper/StepButtons",
  component: StepButtons,
  argTypes: {
    buttonsConfig: [],
  },
  args: {
    buttonsConfig: [{ href: "#", text: "Button 1", variant: "solid" }],
  },
} as ComponentMeta<typeof StepButtons>

export const Default = createStory<typeof StepButtons>((args) => (
  <StepButtons {...args} />
))

export const TwoStepButtons = Default.bind({})
TwoStepButtons.args = {
  buttonsConfig: [
    { href: "#", text: "Button 1", variant: "solid" },
    { href: "#", text: "Button 2", variant: "outline" },
  ],
}

export const ThreeStepButtons = Default.bind({})
ThreeStepButtons.args = {
  buttonsConfig: [
    { href: "#", text: "Button 1", variant: "solid" },
    { href: "#", text: "Button 2", variant: "outline" },
    { href: "#", text: "Button 3", variant: "solid" },
  ],
}
