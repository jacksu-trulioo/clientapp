import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import InvestmentLocation from "./InvestmentLocation"

export default {
  title: "Total Investment /Investment Location",
  component: InvestmentLocation,
  argTypes: {
    data: {
      name: "data",
      type: { name: "array", required: true },
      description: "Items for showing data",
    },
  },
} as ComponentMeta<typeof InvestmentLocation>

export const Template = createStory<typeof InvestmentLocation>((args) => (
  <InvestmentLocation {...args} />
))

export const Default = Template.bind({})
Default.args = {
  investmentLocationData: {
    perAsia: 10,
    perEurope: 20,
    perGlobal: 25,
    perNorthAmerica: 50,
  },
}
