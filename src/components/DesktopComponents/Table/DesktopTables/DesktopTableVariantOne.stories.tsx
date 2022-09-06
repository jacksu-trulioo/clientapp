import { ComponentMeta } from "@storybook/react"
import { number } from "yup"

import { createStory } from "~/utils/storybook-util/createStory"

import DesktopTable from "./DesktopTableVariantOne"

export default {
  title: "Table/Desktop Table/Table Variant 1",
  component: DesktopTable,
  argTypes: {
    tableHeader: {
      name: "Table Data",
      description: "Header of the table",
      control: { type: "array" },
      defaultValue: [
        {
          name: "Asset Class",
          headerSize: 1,
          textAlign: "left",
          style: {},
        },
        {
          name: "Deal Name",
          headerSize: 1,
          textAlign: "center",
          style: {},
        },
        {
          name: "SPV",
          headerSize: 1,
          textAlign: "center",
          style: {},
        },
        {
          name: "Investment Amount",
          headerSize: 1,
          textAlign: "center",
          style: {},
        },
        {
          name: "Investment Date",
          headerSize: 1,
          textAlign: "center",
          style: {},
        },
        {
          name: "Market Value",
          headerSize: 1,
          textAlign: "center",
          style: {},
        },
        {
          name: "Performance Contribution (%)",
          headerSize: 1,
          textAlign: "center",
          style: {},
        },
      ],
    },
    tableGridSize: {
      name: "Table Grid Size",
      description: "Grid Size",
      type: number,
      defaultValue: 7,
    },
    tableBodyData: {
      name: "Body Data",
      description: "Table Body Data",
      control: { type: "array" },
      defaultValue: [
        {
          header: "Cash",
          headerSize: 7,
          style: {
            textAlign: "center",
          },
          bodyData: [
            {
              name: "DYV",
              investmentVehicle: "DYF",
              initialInvestmentDate: "12.12.12",
              bookValue: "100.0000",
              marketValue: "230000",
              performance: "10",
            },
            {
              name: "DYV",
              investmentVehicle: "DYF",
              initialInvestmentDate: "12.12.12",
              bookValue: "100.0000",
              marketValue: "230000",
              performance: "10",
            },
            {
              name: "DYV",
              investmentVehicle: "DYF",
              initialInvestmentDate: "12.12.12",
              bookValue: "100.0000",
              marketValue: "230000",
              performance: "10",
            },
          ],
        },
      ],
    },
    isHeaderLegend: {
      name: "Table header with legend",
      description: "Table header is with legend",
      type: "boolean",
      defaultValue: true,
    },
  },
} as ComponentMeta<typeof DesktopTable>

export const Default = createStory<typeof DesktopTable>((args) => (
  <DesktopTable {...args} />
))
