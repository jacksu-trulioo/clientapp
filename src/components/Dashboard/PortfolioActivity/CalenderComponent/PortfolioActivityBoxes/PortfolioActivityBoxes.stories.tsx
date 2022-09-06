import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import PortfolioActivityBoxes from "./PortfolioActivityBoxes"

export default {
  title: "Portfolio Activity/Portfolio Activity Boxes",
  component: PortfolioActivityBoxes,
  argTypes: {
    data: {
      name: "Body Data",
      description: "Table Body Data",
      control: { type: "array" },
      defaultValue: [
        {
          title: " Distribution payment",
          color: "#7BAD1F",
          description:
            "$100,000 of income distribution payout from your (capital yielding investment) is expected to hit your account on November 5th 2021",
          date: "Nov 5",
        },
        { title: "Two deals exiting", color: "#8791E4" },
        {
          title: "Capital call",
          color: "#F7B198",
          description:
            "$100,000 of income distribution payout from your (capital yielding investment) is expected to hit your account on November 5th 2021",
          date: "Nov 5",
        },
        {
          title: "Two deals exiting",
          color: "#8791E4",
          description:
            "$100,000 of income distribution payout from your (capital yielding investment) is expected to hit your account on November 5th 2021",
          date: "Nov 5",
        },
      ],
    },
  },
} as ComponentMeta<typeof PortfolioActivityBoxes>

export const Default = createStory<typeof PortfolioActivityBoxes>((args) => (
  <PortfolioActivityBoxes {...args} />
))
