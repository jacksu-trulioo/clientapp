import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import Modal from "./ModalBox"

export default {
  title: "Model Box/Data Alert Modal",
  component: Modal,
  argTypes: {
    modalTitle: {
      Title: "Model title",
      Description: "Model title",
      defaultValue: "Model title",
    },
    modalDescription: {
      Title: "Model Description",
      Description: "Model Description",
      defaultValue: "Model Description",
    },
    primaryButtonText: {
      Title: "Model Primary Button",
      Description: "Model Primary Button",
      defaultValue: "Primary Button",
    },
    isSecondaryButton: {
      Title: "Is Secondary Button",
      Description: "Is Secondary Button",
      defaultValue: true,
    },
    secondaryButtonText: {
      Title: "Model Secondary Button",
      Description: "Model Secondary Button",
      defaultValue: "Secondary Button",
    },
  },
} as ComponentMeta<typeof Modal>

const Default: ComponentStory<typeof Modal> = (args) => {
  return <Modal {...args} />
}

export const AssetAllocationModel = Default.bind({})
AssetAllocationModel.args = {}
