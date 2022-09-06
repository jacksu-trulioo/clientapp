import { Box } from "@chakra-ui/react"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import { PieChart } from "~/components"

const fakeData = [
  { name: "Group A", value: 400, color: "opal.600" },
  { name: "Group B", value: 300, color: "opal.700" },
  { name: "Group C", value: 300, color: "opal.800" },
  { name: "Group D", value: 200, color: "opal.900" },
]

export default {
  title: "Experiments/PieChart",
  component: PieChart,
  argTypes: {
    data: {
      name: "data",
      type: { name: "array", required: true },
      description: "Items for showing data",
    },
  },
} as ComponentMeta<typeof PieChart>

const Template: ComponentStory<typeof PieChart> = (args) => {
  return (
    <Box>
      <PieChart {...args} />
    </Box>
  )
}

export const Default = Template.bind({})
Default.args = {
  data: fakeData,
}

export const Empty = Template.bind({})
Empty.args = {
  data: [],
}
