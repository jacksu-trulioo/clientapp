import { Button } from "@chakra-ui/button"
import { Flex } from "@chakra-ui/react"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import {
  KycIdVerificationLinkButton,
  KycIdVerificationUploadBox,
  SideBySideLayout,
} from "~/components"
import { KYC_UPLOAD_INNER_SHAPE } from "~/components/KycIdVerification/KycIdVerificationUploadBox/KycIdVerificationUploadBoxInnerShape"
import { kycIdVerificationUploadBoxSampleData } from "~/components/KycIdVerification/KycIdVerificationUploadBox/mocks"
import {
  sideBySideSampleData,
  sideBySideSampleDataForScan,
  sideBySideTitleAndSubtitleSampleData,
} from "~/components/Layout/SideBySideLayout/mocks"

const uploadBoxComponentProps = {
  title: kycIdVerificationUploadBoxSampleData.title,
  innerShapeType: KYC_UPLOAD_INNER_SHAPE.default,
  footerComponent: (
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
}

export default {
  title: "Basics/SideBySideLayout",
  component: SideBySideLayout,
  argTypes: {
    title: {
      name: "title",
      required: true,
      description: "Title to show in sidebar",
      control: "text",
    },
    subtitle: {
      name: "subtitle",
      description: "Optional subtitle to show under the title for sidebar",
      control: "text",
    },
    description: {
      name: "description",
      description:
        "Optional description to show under the title (or optional subtitle) for sidebar",
      control: "text",
    },
    extraContent: {
      name: "extraContent",
      type: { summary: "React.ReactElement", name: "other", value: "value" },
      description:
        "Optional node to show under the title (or optional subtitle) for sidebar",
      options: ["None", "Sample Box"],
      control: "select",
      defaultValue: "None",
      mapping: {
        None: null,
        "Sample Box": (
          <Flex
            mt={8}
            flexDirection="column"
            p={5}
            borderRadius={6}
            backgroundColor="gray.800"
          >
            Sample Wrapper
          </Flex>
        ),
      },
    },
    children: {
      name: "children",
      type: { summary: "React.ReactElement", name: "other", value: "value" },
      description: "Any react element to show in content side",
      options: [
        "Upload Box (Default)",
        "Upload Box (Document)",
        "Upload Box (Face)",
        "Sample text",
      ],
      control: "select",
      defaultValue: "Upload Box (Default)",
      mapping: {
        "Upload Box (Default)": (
          <KycIdVerificationUploadBox {...uploadBoxComponentProps} />
        ),
        "Upload Box (Document)": (
          <KycIdVerificationUploadBox
            {...uploadBoxComponentProps}
            innerShapeType={KYC_UPLOAD_INNER_SHAPE.document}
          />
        ),
        "Upload Box (Face)": (
          <KycIdVerificationUploadBox
            {...uploadBoxComponentProps}
            innerShapeType={KYC_UPLOAD_INNER_SHAPE.oval}
          />
        ),
        "Sample text": "Sample content",
      },
    },
  },
} as ComponentMeta<typeof SideBySideLayout>

const Template: ComponentStory<typeof SideBySideLayout> = (args) => {
  return <SideBySideLayout {...args} />
}

export const TitleAndDescription = Template.bind({})
TitleAndDescription.args = {
  ...sideBySideSampleData,
  children: "Content",
}

export const WithUploadBox = Template.bind({})
WithUploadBox.args = {
  ...sideBySideSampleDataForScan,
}

export const WithExtraContentInSidebar = Template.bind({})
WithExtraContentInSidebar.args = {
  ...sideBySideTitleAndSubtitleSampleData,
  children: "Content",
  extraContent: (
    <Flex
      mt={8}
      flexDirection="column"
      p={5}
      borderRadius={6}
      backgroundColor="gray.800"
    >
      Sample Wrapper
    </Flex>
  ),
}
