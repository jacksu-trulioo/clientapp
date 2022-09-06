import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import NoDataFound from "./NoDataFound"

export default {
  title: "NoDataFound",
  component: NoDataFound,
  argTypes: {
    isHeader: {
      name: "NodataFound header",
      description: "Is NodataFound header",
      type: "boolean",
      defaultValue: true,
    },
    isIcon: {
      name: "NodataFound Icon",
      description: "Is NodataFound Icon",
      type: "boolean",
      defaultValue: true,
    },
    isDescription: {
      name: "NodataFound description",
      description: "Is NodataFound header",
      type: "boolean",
      defaultValue: true,
    },
  },
} as ComponentMeta<typeof NoDataFound>

export const Default = createStory<typeof NoDataFound>((args) => (
  <NoDataFound {...args} />
))
