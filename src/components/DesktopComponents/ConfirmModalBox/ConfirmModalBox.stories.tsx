import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import ConfirmModal from "./ConfirmModalBox"

export default {
  title: "Basics/Confirm Modal Box",
  component: ConfirmModal,
  argTypes: {
    isOpen: {
      name: "isOpen",
      description: "Modal box open state",
      type: "boolean",
      defaultValue: false,
    },
    onClose: {
      name: "onClose",
      description: "On click of close",
      type: "function",
      defaultValue: () => {
        alert("Close Button Called")
      },
    },
    bodyContent: {
      name: "bodyContent",
      description: "Body content of Modal box",
      type: "string",
      defaultValue: "Body Content",
    },
    secondButtonText: {
      name: "secondButtonText",
      description: "Button text of Second Button",
      type: "string",
      defaultValue: "Second Button",
    },
    secondButtonOnClick: {
      name: "secondButtonOnClick",
      description: "On click of second button",
      type: "function",
      defaultValue: () => {
        alert("Second Button Called")
      },
    },
    firstButtonOnClick: {
      name: "firstButtonOnClick",
      description: "On click of first button",
      type: "function",
      defaultValue: () => {
        alert("First Button Called")
      },
    },
    firstButtonText: {
      name: "firstButtonText",
      description: "Button text of First Button",
      type: "string",
      defaultValue: "First Button",
    },
  },
} as ComponentMeta<typeof ConfirmModal>
export const Default = createStory<typeof ConfirmModal>((args) => (
  <ConfirmModal {...args} />
))
