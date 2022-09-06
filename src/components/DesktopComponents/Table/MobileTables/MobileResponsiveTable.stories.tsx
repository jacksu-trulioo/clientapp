import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import MobileTable from "./MobileResponsiveTable"

export default {
  title: "Table/Mobile Table/Table Variant 1",
  component: MobileTable,
  argTypes: {
    isHeader: {
      name: "Show Header",
      description: "Boolean condition to show header of the table",
      type: "boolean",
      control: "select",
      options: [true, false],
      defaultValue: true,
    },
    header: {
      name: "Header",
      description:
        "Header of the Table if you select usHeader true then you have to pass header string to the component",
      type: "string",
      defaultValue: "Commission Expenses",
    },
    tableItem: {
      name: "Table Data",
      description: "Items or Data of the table",
      control: { type: "array" },
      defaultValue: [
        {
          key: "Total",
          value: "$10,000",
          style: {
            fontweight: "400",
            fontSize: "14px",
            lineHeight: "120%",
            color: "#C7C7C7",
            paddingBottom: "5px",
          },
        },
        {
          key: "Relative",
          value: "-0.4%",
          style: {
            fontweight: "400",
            fontSize: "14px",
            lineHeight: "120%",
            color: "#C7C7C7",
          },
        },
      ],
    },
  },
} as ComponentMeta<typeof MobileTable>

export const Default = createStory<typeof MobileTable>((args) => (
  <MobileTable {...args} />
))
