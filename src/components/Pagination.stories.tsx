import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import Pagination from "./Pagination"

export default {
  title: "Basics/Pagination",
  component: Pagination,
  argTypes: {
    currentPage: {
      type: "number",
      defaultValue: 1,
    },
    pageLength: {
      type: "number",
      defaultValue: 2,
    },
  },
} as ComponentMeta<typeof Pagination>

export const Default = createStory((args) => (
  <Pagination
    {...args}
    paginationOnClick={(i) => {
      console.log(i)
    }}
  />
))
