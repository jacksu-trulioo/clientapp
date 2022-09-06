import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import Accordian from "./Accordian"

export default {
  title: "Accordian",
  component: Accordian,
  argTypes: {
    accordianItem: {
      name: "Table Data",
      description: "Items or Data of the table",
      control: { type: "array" },
      defaultValue: [
        {
          term: " Absolute Return Strategy",
          definition: `An investment stategy that aims to produce positive returns,
          even when share markets are volatile, flat or falling, usually
          employing techniques that differ from traditional long-only
          strategies`,
        },
        {
          term: "Access Fund",
          definition: `An investment stategy that aims to produce positive returns,
          even when share markets are volatile, flat or falling, usually
          employing techniques that differ from traditional long-only
          strategies`,
        },
      ],
    },
  },
} as ComponentMeta<typeof Accordian>

export const Default = createStory<typeof Accordian>((args) => (
  <Accordian {...args} />
))
