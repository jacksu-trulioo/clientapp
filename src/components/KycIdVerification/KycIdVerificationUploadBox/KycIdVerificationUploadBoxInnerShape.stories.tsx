import { ComponentMeta, ComponentStory } from "@storybook/react"

import { KycIdVerificationUploadBoxInnerShape } from "~/components"
import { KYC_UPLOAD_INNER_SHAPE } from "~/components/KycIdVerification/KycIdVerificationUploadBox/KycIdVerificationUploadBoxInnerShape"

export default {
  title: "Experiments/KycIdVerification/KycIdVerificationUploadBoxInnerShape",
  component: KycIdVerificationUploadBoxInnerShape,
  argTypes: {
    type: {
      name: "type",
      description: "Type of shape to show",
      options: ["none", "image", "oval", "default"],
      control: "select",
      defaultValue: "default",
      mapping: {
        none: KYC_UPLOAD_INNER_SHAPE.none,
        default: KYC_UPLOAD_INNER_SHAPE.default,
        image: KYC_UPLOAD_INNER_SHAPE.document,
        oval: KYC_UPLOAD_INNER_SHAPE.oval,
      },
    },
  },
} as ComponentMeta<typeof KycIdVerificationUploadBoxInnerShape>

const Template: ComponentStory<typeof KycIdVerificationUploadBoxInnerShape> = (
  args,
) => {
  return <KycIdVerificationUploadBoxInnerShape {...args} />
}

export const Default = Template.bind({})
Default.args = {}
