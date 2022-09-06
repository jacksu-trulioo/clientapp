import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import Header from "./Header"

export default {
  title: "Basics/Header",
  component: Header,
  argTypes: {
    navBarType: {
      name: "Header Type",
      description: "Navbar",
    },
  },
} as ComponentMeta<typeof Header>
export const Default = createStory<typeof Header>((args) => (
  <Header {...args} />
))
