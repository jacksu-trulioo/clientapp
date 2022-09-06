import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import QuarterTabs from "./QuarterTabs"

export default {
  title: "Basics/QuarterTabs",
  component: QuarterTabs,
  argTypes: {
    options: {
      name: "Options",
      description: "Test Description",
      defaultValue: [
        {
          value: 3,
          label: "3 Months",
        },
        {
          value: 6,
          label: "6 Months",
        },
      ],
    },
    activeOption: {
      name: "Active Option",
      description: "Test Description",
      defaultValue: 6,
    },
    viewType: {
      name: "View Type",
      description: "Test Description",
      type: "string",
      control: "select",
      options: ["mobile", "desktop"],
      defaultValue: "mobile",
    },
    tabHeight: {
      name: "tab Heigth",
      description: "tab Heigth",
      type: "string",
      defaultValue: "25px",
    },
  },
} as ComponentMeta<typeof QuarterTabs>

export const Default = createStory<typeof QuarterTabs>((args) => (
  <QuarterTabs {...args}></QuarterTabs>
))
