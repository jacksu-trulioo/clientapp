import { ComponentMeta, ComponentStory } from "@storybook/react"

import { BarChartWidget } from "~/components"
import { simulatedNetWorth } from "~/components/Widgets/BarChartWidget/mocks"

export default {
  title: "Experiments/Widgets/BarChartWidget",
  component: BarChartWidget,
  argTypes: {
    title: {
      name: "title",
      type: { name: "string", required: true },
      defaultValue: "Widget title",
      description: "Title of the widget always shown in header",
      control: "text",
    },
    data: {
      name: "data",
      required: true,
      description: "Data to show in the bar chart.",
    },
  },
} as ComponentMeta<typeof BarChartWidget>

const Template: ComponentStory<typeof BarChartWidget> = (args) => {
  return <BarChartWidget {...args} />
}

export const SimulatedNetWorth = Template.bind({})
SimulatedNetWorth.args = simulatedNetWorth
