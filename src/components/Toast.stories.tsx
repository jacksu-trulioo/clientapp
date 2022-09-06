import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import Toast from "./Toast"

export default {
  title: "Basics/Toast",
  component: Toast,
  argTypes: {
    title: {
      name: "title",
      type: "string",
      defaultValue: "Toast Title",
    },
    description: {
      name: "description",
      type: "string",
      defaultValue: "Toast Description",
    },
  },
} as ComponentMeta<typeof Toast>

export const Default = createStory((args) => <Toast {...args} />)
