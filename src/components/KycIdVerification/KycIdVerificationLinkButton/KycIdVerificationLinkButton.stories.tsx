import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import { KycIdVerificationLinkButton } from "~/components"
import {
  kycIdVerificationLinkButtonSampleData,
  kycIdVerificationLinkButtonVerifyMobileSampleData,
} from "~/components/KycIdVerification/KycIdVerificationLinkButton/mocks"

export default {
  title: "Experiments/KycIdVerification/KycIdVerificationLinkButton",
  component: KycIdVerificationLinkButton,
  argTypes: {
    orText: {
      name: "orText",
      defaultValue: "Or",
      description: "Optional text to show before children",
      control: "text",
    },
    children: {
      name: "children",
      defaultValue: "Upload picture",
      description: "Text to show as children of the button",
      control: "text",
    },
    tooltipText: {
      name: "tooltipText",
      defaultValue: "",
      description: "Text to show inside tooltip",
      control: "text",
    },
  },
} as ComponentMeta<typeof KycIdVerificationLinkButton>

const Template: ComponentStory<typeof KycIdVerificationLinkButton> = (args) => {
  return <KycIdVerificationLinkButton {...args} />
}

export const Default = Template.bind({})
Default.args = {
  children: kycIdVerificationLinkButtonSampleData.children,
}

export const WithOrAndTooltip = Template.bind({})
WithOrAndTooltip.args = kycIdVerificationLinkButtonSampleData

export const VerifyMobile = Template.bind({})
VerifyMobile.args = kycIdVerificationLinkButtonVerifyMobileSampleData
