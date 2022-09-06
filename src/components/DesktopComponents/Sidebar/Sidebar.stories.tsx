import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import Sidebar from "./Sidebar"

export default {
  title: "Basics/Sidebar",
  component: Sidebar,
  argTypes: {
    sidebarType: {
      name: "Sidebar Type",
      description: "Test Description",
      type: "string",
      control: "select",
      options: ["Client", "Prospect"],
      defaultValue: "Client",
    },
  },
} as ComponentMeta<typeof Sidebar>
export const Default = createStory<typeof Sidebar>((args) => (
  <Sidebar {...args} />
))

// import { ComponentMeta } from "@storybook/react"

// import { createStory } from "~/utils/storybook-util/createStory"

// import Sidebar from "./Sidebar"
// export default {
//   title: "Basics/Radio",
//   component: Sidebar,
//   argTypes: {
//     sidebarType: {
//       name: "Sidebar Type",
//       description: "Test Description",
//       type: "string",
//       control: "select",
//       options: ["Client", "Prospect"],
//       defaultValue: "Client",
//     },
//   },
// } as ComponentMeta<typeof Sidebar>

// export const Default = createStory((args) => <Sidebar />)
