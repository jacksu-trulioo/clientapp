import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import { Checkbox } from "./Checkbox"

export default {
  title: "Basics/Checkbox",
  component: Checkbox,
  argTypes: {
    colorScheme: {
      type: "string",
      control: "select",
      options: ["primary", "secondary"],
    },
    label: {
      name: "label",
      type: "string",
      defaultValue: "Label",
    },
  },
} as ComponentMeta<typeof Checkbox>

export const Default = createStory((args) => (
  <Checkbox {...args}>{args.label}</Checkbox>
))
