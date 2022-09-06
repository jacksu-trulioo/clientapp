import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import ChartAssets from "~/components/PortfolioAllocationChart/ChartAssets"

export default {
  title: "Allocation Chart/ChartAssets",
  component: ChartAssets,
} as ComponentMeta<typeof ChartAssets>

const Default: ComponentStory<typeof ChartAssets> = (args) => {
  return <ChartAssets {...args} />
}

export const Empty = Default.bind({})
Empty.args = {
  color: "#ffffff",
  text: "string",
}
