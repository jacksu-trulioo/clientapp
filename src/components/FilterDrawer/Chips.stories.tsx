import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import FilterChips from "./Chips"

export default {
  title: "Basics/FilterDrawer/Chips",
  component: FilterChips,
  argTypes: {
    data: {
      name: "Filter Chips",
      description: "Test Description",
      control: { type: "array" },
      defaultValue: [
        {
          value: "chip1",
          label: "Chip 1",
        },
        {
          value: "chip2",
          label: "Chip 2",
        },
      ],
    },
  },
} as ComponentMeta<typeof FilterChips>

export const Default = createStory<typeof FilterChips>((args) => (
  <FilterChips {...args} />
))
