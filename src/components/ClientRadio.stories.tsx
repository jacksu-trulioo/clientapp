import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import ClientRadio from "./ClientRadio"

export default {
  title: "Basics/ClientRadio",
  component: ClientRadio,
  argTypes: {
    colorScheme: {
      name: "colorScheme",
      description: "The color scheme of the FAB",
      type: "string",
      control: "select",
      options: ["secondary"],
      defaultValue: "secondary",
    },
  },
} as ComponentMeta<typeof ClientRadio>

export const Default = createStory((args) => (
  <ClientRadio value={1} colorScheme={args.colorScheme}>
    {args.label}
  </ClientRadio>
))
Default.argTypes = {
  label: {
    type: "string",
    description: "The label displayed next to the radio",
    defaultValue: "Radio Label",
  },
}
