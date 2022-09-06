import { ComponentMeta, ComponentStory } from "@storybook/react"

import { StepsWidget } from "~/components"

import { fakeItems, title } from "./mocks"

export default {
  title: "Experiments/Widgets/StepsWidget",
  component: StepsWidget,
  argTypes: {
    title: {
      name: "title",
      type: { name: "string", required: true, value: "value" },
      description: "Title of the widget always shown in header",
      control: "text",
    },
    items: {
      name: "items",
      type: { name: "other", required: true, value: "value" },
      description: "Items to show in widget wizard",
      control: "array",
    },
  },
} as ComponentMeta<typeof StepsWidget>

const Template: ComponentStory<typeof StepsWidget> = (args) => {
  return <StepsWidget {...args} />
}

export const GettingStarted = Template.bind({})
GettingStarted.args = {
  title,
  items: fakeItems,
}
