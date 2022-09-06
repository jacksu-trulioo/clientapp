import { Button } from "@chakra-ui/button"
import { Text } from "@chakra-ui/react"
import { ComponentMeta, ComponentStory } from "@storybook/react"

import {
  KycIdVerificationLinkButton,
  KycIdVerificationModal,
} from "~/components"

import { kycIdVerificationModalSampleData } from "./mocks"

export default {
  title: "Experiments/KycIdVerification/KycIdVerificationModal",
  component: KycIdVerificationModal,
  argTypes: {
    title: {
      name: "title",
      defaultValue: "Verification Modal",
      description: "Title of the modal",
      control: "text",
    },
    content: {
      name: "content",
      description: "Content of the modal",
    },
    isOpen: {
      name: "isOpen",
      defaultValue: true,
      description: "Set if the modal is open",
      control: "boolean",
    },
    footerComponent: {
      name: "footerComponent",
      description: "Content of the modal footer",
    },
  },
} as ComponentMeta<typeof KycIdVerificationModal>

const Template: ComponentStory<typeof KycIdVerificationModal> = (args) => {
  return <KycIdVerificationModal {...args} />
}

export const Default = Template.bind({})
Default.args = {
  title: kycIdVerificationModalSampleData.title,
  isOpen: true,
  content: (
    <>
      <Text color="gray.400" textAlign="center" mb={6}>
        {kycIdVerificationModalSampleData.content[0]}
      </Text>
      <Text color="gray.400" textAlign="center">
        {kycIdVerificationModalSampleData.content[1]}
      </Text>
    </>
  ),
  footerComponent: (
    <>
      <Button
        colorScheme="primary"
        onClick={() => console.log("Get Started")}
        mb={6}
      >
        {kycIdVerificationModalSampleData.getStarted}
      </Button>
      <KycIdVerificationLinkButton
        size="md"
        orText={kycIdVerificationModalSampleData.orText}
      >
        {kycIdVerificationModalSampleData.verifyOnMobile}
      </KycIdVerificationLinkButton>
    </>
  ),
}
