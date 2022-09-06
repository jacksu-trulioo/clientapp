import { Image } from "@chakra-ui/react"
import { ComponentMeta, ComponentStory } from "@storybook/react"

import { StatisticsWidget } from "~/components"
import PieChart from "~/components/PieChart/PieChart"

import {
  fakeGeographyStatistics,
  fakePortfolioData,
  geography,
  portfolioAllocation,
} from "./mocks"
import StatisticsWidgetPercentages from "./StatisticsWidgetPercentages"
import StatisticsWidgetValues from "./StatisticsWidgetValues"

export default {
  title: "Experiments/Widgets/StatisticsWidget",
  component: StatisticsWidget,
  argTypes: {
    title: {
      name: "title",
      type: { name: "string", required: true, value: "value" },
      defaultValue: "Widget title",
      description: "Title of the widget always shown in header",
      control: "text",
    },
    children: {
      name: "children",
      type: { summary: "React.ReactElement", name: "other", value: "value" },
      description: "Example of custom components you can insert.",
      options: [
        "Image + StatisticsWidgetValues",
        "PieChart + StatisticsWidgetPercentages",
      ],
      control: "select",
      defaultValue: "Image + StatisticsWidgetValues",
      mapping: {
        "Image + StatisticsWidgetValues": (
          <>
            <Image
              w="100%"
              objectFit="contain"
              src="/images/continents.svg"
              alt="geography"
              mt={6}
              mb={10}
            />
            <StatisticsWidgetValues items={fakeGeographyStatistics} />
          </>
        ),
        "PieChart + StatisticsWidgetPercentages": (
          <>
            <PieChart data={fakePortfolioData} />
            <StatisticsWidgetPercentages items={fakePortfolioData} />
          </>
        ),
      },
    },
  },
} as ComponentMeta<typeof StatisticsWidget>

const Template: ComponentStory<typeof StatisticsWidget> = (args) => {
  return <StatisticsWidget {...args} />
}

export const Geography = Template.bind({})
Geography.args = geography

export const PortfolioAllocation = Template.bind({})
PortfolioAllocation.args = {
  ...portfolioAllocation,
  children: (
    <>
      <PieChart data={fakePortfolioData} />
      <StatisticsWidgetPercentages items={fakePortfolioData} />
    </>
  ),
}
