import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import BankIcon from "~/components/Icon/BankIcon"

import AssetCard from "./AssetCard"
import { description, title } from "./mocks"

export default {
  title: "Experiments/Assets/AssetCard",
  component: AssetCard,
  argTypes: {
    title: {
      name: "title",
      type: { name: "string", required: true },
      defaultValue: "Asset title",
      description: "The name of the asset",
      control: "text",
    },
    description: {
      name: "AssetCard",
      type: { name: "string", required: false },
      defaultValue: "Lorem ipsum dolor sit amet",
      description: "A description of the asset",
      control: "text",
    },
  },
} as ComponentMeta<typeof AssetCard>

const Template: ComponentStory<typeof AssetCard> = (args) => {
  return <AssetCard {...args} />
}

export const Default = Template.bind({})
export const NoIcon = Template.bind({})
export const NoCTA = Template.bind({})

Default.args = {
  title,
  description,
  icon: <BankIcon opacity={0.5} h={4} w={4} />,
  onClick: () => alert("Item clicked"),
}

NoCTA.args = {
  title,
  description,
  icon: <BankIcon opacity={0.5} h={4} w={4} />,
}

NoIcon.args = {
  title,
  description,
  onClick: () => alert("Item clicked"),
}
