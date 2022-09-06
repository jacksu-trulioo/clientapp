import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import FilterDrawer from "./FilterDrawer"

export default {
  title: "Basics/FilterDrawer",
  component: FilterDrawer,
  argTypes: {
    filterData: {
      name: "Filter Data",
      description: "Test Description",
      control: { type: "array" },
      defaultValue: [
        {
          filterName: "Order By",
          filterType: "radio",
          selectedOption: "abc",
          filterOptions: [
            { value: "abc", label: "Abc" },
            { value: "efg", label: "Efg" },
          ],
        },
        {
          filterName: "Asset Class",
          filterType: "checkbox",
          filterOptions: [
            { value: "abc", label: "Abc", isSelected: false },
            { value: "efg", label: "Efg", isSelected: false },
          ],
        },
      ],
    },
    isOpen: {
      name: "Drawer State",
      description: "Test Description",
      control: "boolean",
      defaultValue: true,
    },
  },
} as ComponentMeta<typeof FilterDrawer>

export const Default = createStory<typeof FilterDrawer>((args) => (
  <FilterDrawer {...args} />
))
