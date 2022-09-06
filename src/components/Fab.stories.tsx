import { ComponentMeta } from "@storybook/react"
import { MdAdd, MdEmail, MdHome, MdPerson } from "react-icons/md"

import { createStory } from "~/utils/storybook-util/createStory"

import Fab from "./Fab"

export default {
  title: "Basics/Fab",
  component: Fab,
  argTypes: {
    icon: {
      name: "icon",
      description: "The icon which will be displayed on the FAB",
      type: "function",
      options: ["Email", "Home", "Person", "Plus"],
      control: "select",
      defaultValue: <MdEmail />,
      mapping: {
        Email: <MdEmail />,
        Home: <MdHome />,
        Person: <MdPerson />,
        Plus: <MdAdd />,
      },
    },
    colorScheme: {
      name: "colorScheme",
      description: "The color scheme of the FAB",
      type: "string",
      control: "select",
      options: ["primary", "secondary", "gray"],
      defaultValue: "primary",
    },
  },
} as ComponentMeta<typeof Fab>

export const Default = createStory((args) => (
  <Fab aria-label="Floating Action Button" icon={args.icon} {...args} />
))
