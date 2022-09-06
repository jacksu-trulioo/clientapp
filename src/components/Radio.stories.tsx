import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import Radio from "./Radio"

export default {
  title: "Basics/Radio",
  component: Radio,
  argTypes: {
    colorScheme: {
      name: "colorScheme",
      description: "The color scheme of the FAB",
      type: "string",
      control: "select",
      options: ["primary", "secondary"],
      defaultValue: "primary",
    },
  },
} as ComponentMeta<typeof Radio>

export const Default = createStory((args) => (
  <Radio value={1} colorScheme={args.colorScheme}>
    {args.label}
  </Radio>
))
Default.argTypes = {
  label: {
    type: "string",
    description: "The label displayed next to the radio",
    defaultValue: "Radio Label",
  },
}
