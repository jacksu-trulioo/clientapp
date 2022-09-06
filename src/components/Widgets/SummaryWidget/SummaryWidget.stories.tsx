import { Box } from "@chakra-ui/react"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import { SummaryWidget } from "~/components"

import { title, value } from "./mocks"

export default {
  title: "Experiments/Widgets/SummaryWidget",
  component: SummaryWidget,
  argTypes: {
    title: {
      name: "title",
      type: { name: "string", required: true },
      defaultValue: "Widget summary title",
      description: "Title of the widget always shown in header",
      control: "text",
    },
    value: {
      name: "value",
      type: { name: "string", required: false },
      defaultValue: "$100,000",
      description: "Widget value shown on the right",
      control: "text",
    },
  },
} as ComponentMeta<typeof SummaryWidget>

const Template: ComponentStory<typeof SummaryWidget> = (args) => {
  return (
    <Box>
      <SummaryWidget {...args} />
    </Box>
  )
}

export const NetWorth = Template.bind({})
NetWorth.args = {
  title,
  value,
}
