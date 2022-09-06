import { Button } from "@chakra-ui/button"
import { Box } from "@chakra-ui/react"
import { ComponentMeta, ComponentStory } from "@storybook/react"

import {
  KycIdVerificationLinkButton,
  KycIdVerificationUploadBox,
} from "~/components"
import { KYC_UPLOAD_INNER_SHAPE } from "~/components/KycIdVerification/KycIdVerificationUploadBox/KycIdVerificationUploadBoxInnerShape"
import { kycIdVerificationUploadBoxSampleData } from "~/components/KycIdVerification/KycIdVerificationUploadBox/mocks"

export default {
  title: "Experiments/KycIdVerification/KycIdVerificationUploadBox",
  component: KycIdVerificationUploadBox,
  argTypes: {
    title: {
      name: "title",
      defaultValue: "",
      description: "Title of the box",
      control: "text",
    },
    children: {
      name: "children",
      description: "Content of the box",
    },
    innerShapeType: {
      name: "innerShapeType",
      description: "Used for showing a shape of the document",
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
    footerComponent: {
      name: "footerComponent",
      type: { summary: "React.ReactElement", name: "other", value: "value" },
      description: "Example of custom footer you can insert.",
      options: [
        "Footer example with two buttons",
        "Footer example with one button",
      ],
      control: "select",
      defaultValue: "Footer example with two buttons",
      mapping: {
        "Footer example with two buttons": (
          <>
            <Button
              mb={[4, 0]}
              colorScheme="primary"
              onClick={() => console.log("Take a photo")}
            >
              {kycIdVerificationUploadBoxSampleData.takeAPhoto}
            </Button>
            <KycIdVerificationLinkButton
              orText="Or"
              tooltipText={kycIdVerificationUploadBoxSampleData.tooltipText}
            >
              {kycIdVerificationUploadBoxSampleData.uploadAPicture}
            </KycIdVerificationLinkButton>
          </>
        ),
        "Footer example with one button": (
          <Box marginStart="auto" mt={5}>
            <KycIdVerificationLinkButton
              orText="Or"
              tooltipText={kycIdVerificationUploadBoxSampleData.tooltipText}
            >
              {kycIdVerificationUploadBoxSampleData.uploadAPicture}
            </KycIdVerificationLinkButton>
          </Box>
        ),
      },
    },
  },
} as ComponentMeta<typeof KycIdVerificationUploadBox>

const Template: ComponentStory<typeof KycIdVerificationUploadBox> = (args) => {
  return <KycIdVerificationUploadBox {...args} />
}

export const Default = Template.bind({})
Default.args = {
  title: kycIdVerificationUploadBoxSampleData.title,
}
