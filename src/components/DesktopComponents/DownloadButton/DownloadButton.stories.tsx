import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import DownloadButton from "./DownloadButton"

export default {
  title: "Basics/Download Button",
  component: DownloadButton,
  argTypes: {
    onDownloadClick: {
      name: "onDownloadClick",
      description: "Action to be done on click of button",
      type: "function",
      defaultValue: () => {
        alert("Button Clicked")
      },
    },
  },
} as ComponentMeta<typeof DownloadButton>
export const Default = createStory<typeof DownloadButton>((args) => (
  <DownloadButton {...args} />
))
