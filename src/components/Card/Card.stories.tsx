import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import Card from "./Card"
import CardContent from "./CardContent"
import CardFooter from "./CardFooter"

export default {
  title: "Basics/Card",
  component: Card,
  argTypes: {
    fontSize: {
      defaultValue: "sm",
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
  },
} as ComponentMeta<typeof Card>

export const Default = createStory<typeof Card>((args) => (
  <Card {...args}>
    <CardContent>Basic Card</CardContent>
  </Card>
))

export const CardWithFooter = createStory<typeof Card>((args) => (
  <Card {...args}>
    <CardContent>Card Content</CardContent>
    <CardFooter>Card Footer</CardFooter>
  </Card>
))
