import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import MeetingBox from "./ScheduleMeetingCard"

export default {
  title: "Basics/MeetingBoc",
  component: MeetingBox,
  argTypes: {
    navBarType: {
      name: "Header Type",
      description: "Navbar",
    },
  },
} as ComponentMeta<typeof MeetingBox>
export const Default = createStory<typeof MeetingBox>((args) => (
  <MeetingBox {...args} />
))
