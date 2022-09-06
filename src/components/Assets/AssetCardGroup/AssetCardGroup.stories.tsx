import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import AssetCardGroup from "./AssetCardGroup"
import { assets } from "./mocks"

export default {
  title: "Experiments/Assets/AssetCardGroup",
  component: AssetCardGroup,
  argTypes: {},
} as ComponentMeta<typeof AssetCardGroup>

const Template: ComponentStory<typeof AssetCardGroup> = (args) => {
  return <AssetCardGroup {...args} />
}

export const Default = Template.bind({})

Default.args = {
  assets: assets.map((asset) => ({
    ...asset,
    onClick: () => alert(`${asset.title} clicked`),
  })),
}
