import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import StepsWithTitle from "./StepsWithTitle"

export default {
  title: "Basics / Steps With Title",
  component: StepsWithTitle,
} as ComponentMeta<typeof StepsWithTitle>

export const Default = createStory<typeof StepsWithTitle>((args) => (
  <StepsWithTitle {...args}></StepsWithTitle>
))

export const Primary = Default.bind({})

Primary.args = {
  Title: "hello",
  Process: "100%",
}
