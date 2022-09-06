import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import ComboBox from "./ComboBox"

export default {
  title: "Basics/ComboBox",
  component: ComboBox,
  argTypes: {
    comboBoxItem: {
      name: "Combobox",
      control: { type: "array" },
      defaultValue: [
        {
          term: "00000",
        },
      ],
    },
  },
} as ComponentMeta<typeof ComboBox>

export const Default = createStory<typeof ComboBox>((args) => (
  <ComboBox {...args} />
))
