import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import AssetAndLiabilityWizard from "./AssetAndLiabilityWizard"
import { assets, bankAccountTypes } from "./mocks"

export default {
  title: "Sections/Assets And Liabilities",
  component: AssetAndLiabilityWizard,
} as ComponentMeta<typeof AssetAndLiabilityWizard>

const Template: ComponentStory<typeof AssetAndLiabilityWizard> = (args) => {
  return <AssetAndLiabilityWizard {...args} />
}

export const Default = Template.bind({})

Default.args = {
  assets,
  bankAccountTypes,
}
