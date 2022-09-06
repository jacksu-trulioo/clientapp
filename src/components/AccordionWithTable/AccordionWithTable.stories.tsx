import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import AccordionWithTable from "./AccordionWithTable"

export default {
  title: "Table/Accordion Table/AccordionWithTable",
  component: AccordionWithTable,
  argTypes: {
    AccordionWithTablesItem: {
      name: "Accordion Table",
      description: "Accordion With Table",
      control: { type: "array" },
      defaultValue: [
        {
          tableHeading: "Asia Gate Private Equity",
          tableBody: ` Deal Name`,
        },
        {
          tableHeading: "AGPE",
          tableBody: ` Distribution Date`,
        },
        {
          tableHeading: "$31,490,532",
          tableBody: ` Type`,
        },
      ],
    },
  },
} as ComponentMeta<typeof AccordionWithTable>

export const Default = createStory<typeof AccordionWithTable>((args) => (
  <AccordionWithTable {...args} />
))
