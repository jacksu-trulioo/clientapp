import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import HighChartPieChart from "./highChartsPieChart"

export default {
  title: "Basics/HighChartPieChart",
  component: HighChartPieChart,
  argTypes: {
    colors: {
      name: "Colors",
      description: "Shariah Tag",
      control: { type: "array" },
      defaultValue: ["#AED1DA", "#B4985F"],
    },
    series: {
      name: "series",
      description: "Serier - Send Array of ",
      control: { type: "array" },
      defaultValue: [
        {
          name: "Capital Call",
          data: [5, 3, 4, 7],
          showInLegend: false,
        },
        {
          name: "Distribution",
          data: [3, 4, 4, 5],
          showInLegend: false,
        },
      ],
    },
    height: {
      name: "Height",
      description: "Height",
      control: { type: "text" },
      defaultValue: "150",
    },
    categories: {
      name: "categories",
      control: { type: "array" },
      description: "Test Description",
      defaultValue: ["q1", "q2", "q3"],
    },
  },
} as ComponentMeta<typeof HighChartPieChart>

export const Default = createStory<typeof HighChartPieChart>((args) => (
  <HighChartPieChart {...args} />
))
