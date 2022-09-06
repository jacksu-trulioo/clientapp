import { Box } from "@chakra-ui/react"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import { CollapsibleWidget } from "~/components"
import BankIcon from "~/components/Icon/BankIcon"
import HomeIcon from "~/components/Icon/HomeIcon"
import CollapsibleWidgetAddButton from "~/components/Widgets/CollapsibleWidget/CollapsibleWidgetAddButton"
import CollapsibleWidgetListContent from "~/components/Widgets/CollapsibleWidget/CollapsibleWidgetListContent"

import { assets, liabilities, portfolioYield } from "./mocks"

const fakeItems = [
  {
    icon: <BankIcon opacity={0.5} h="3" w="3" />,
    name: "Item 1",
    value: "$200,000",
  },
  {
    icon: <HomeIcon opacity={0.5} h="3" w="3" />,
    name: "Item 2",
    value: "$500,000",
  },
]

export default {
  title: "Experiments/Widgets/CollapsibleWidget",
  component: CollapsibleWidget,
  argTypes: {
    themeColor: {
      name: "themeColor",
      type: { name: "string", required: false, value: "value" },
      defaultValue: "gray.400",
      description: "Color theme for the circle and icons in widget",
      control: "color",
    },
    title: {
      name: "title",
      type: { name: "string", required: true, value: "value" },
      defaultValue: "Widget title",
      description: "Title of the widget always shown in header",
      control: "text",
    },
    value: {
      name: "value",
      type: { name: "string", required: false, value: "value" },
      defaultValue: "$0",
      description: "Widget value shown near to toggle arrow",
      control: "text",
    },
    content: {
      name: "content",
      type: { summary: "React.ReactElement", name: "other", value: "value" },
      description: "Example of custom components you can insert.",
      options: [
        "CollapsibleWidgetAddButton",
        "CollapsibleWidgetListContent",
        "CollapsibleWidgetListContent + CollapsibleWidgetAddButton",
      ],
      control: "select",
      defaultValue: "CollapsibleWidgetAddButton",
      mapping: {
        CollapsibleWidgetAddButton: (
          <CollapsibleWidgetAddButton onClick={(): void => console.log("Add")}>
            Add an item
          </CollapsibleWidgetAddButton>
        ),
        CollapsibleWidgetListContent: (
          <CollapsibleWidgetListContent items={fakeItems} />
        ),
        "CollapsibleWidgetListContent + CollapsibleWidgetAddButton": (
          <CollapsibleWidgetListContent
            items={fakeItems}
            addComponent={
              <CollapsibleWidgetAddButton
                onClick={(): void => console.log("Add")}
              >
                Add an item
              </CollapsibleWidgetAddButton>
            }
          />
        ),
      },
    },
  },
} as ComponentMeta<typeof CollapsibleWidget>

const Template: ComponentStory<typeof CollapsibleWidget> = (args) => {
  return (
    <Box>
      <CollapsibleWidget {...args} />
    </Box>
  )
}

export const Assets = Template.bind({})
Assets.args = assets

export const Liabilities = Template.bind({})
Liabilities.args = liabilities

export const PortfolioYield = Template.bind({})
PortfolioYield.args = portfolioYield
