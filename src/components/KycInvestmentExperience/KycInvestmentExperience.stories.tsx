import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import KycInvestmentExperience from "./KycInvestmentExperience"

export default {
  title: "Kyc/Investment Experience",
  component: KycInvestmentExperience,
} as ComponentMeta<typeof KycInvestmentExperience>

const Template: ComponentStory<typeof KycInvestmentExperience> = (args) => {
  return <KycInvestmentExperience {...args} />
}

export const Default = Template.bind({})

Default.args = {}
