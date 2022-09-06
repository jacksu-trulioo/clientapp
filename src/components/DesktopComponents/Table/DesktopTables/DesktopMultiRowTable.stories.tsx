import { ComponentMeta } from "@storybook/react"
import { number } from "yup"

import { createStory } from "~/utils/storybook-util/createStory"

import DesktopTable from "./DesktopMultiRowTable"

export default {
  title: "Table/Desktop Table/Table Variant 2",
  component: DesktopTable,
  argTypes: {
    tableHeader: {
      name: "Table Data",
      description: "Header of the table",
      control: { type: "array" },
      defaultValue: [
        {
          name: "",
          colspan: 1,
          size: 6,
          style: {
            textAlign: "right",
            fontWeight: "400",
            fontSize: "14px",
            lineHeight: "120%",
            color: "#C7C7C7",
          },
        },
        {
          name: "Total",
          size: 1,
          colspan: 1,
          style: {
            textAlign: "right",
            fontWeight: "400",
            fontSize: "14px",
            lineHeight: "120%",
            color: "#C7C7C7",
          },
        },
        {
          name: "Relative",
          size: 1,
          colspan: 1,
          style: {
            textAlign: "end",
            fontWeight: "400",
            fontSize: "14px",
            lineHeight: "120%",
            color: "#C7C7C7",
            paddingRight: "10px",
          },
        },
      ],
    },
    tableGridSize: {
      name: "Table Grid Size",
      description: "Grid Size",
      type: number,
      defaultValue: 8,
    },
    isHeader: {
      name: "Table header",
      description: "Is Table header",
      type: "boolean",
      defaultValue: true,
    },
    headerPadding: {
      name: "Table padding",
      description: "Table padding",
      type: "string",
      defaultValue: "8px 16px",
    },
    isGrid: {
      type: "boolean",
      defaultValue: true,
    },
    tableBodyData: {
      name: "Body Data",
      description: "Table Body Data",
      control: { type: "array" },
      defaultValue: [
        {
          name: "string",

          data: [
            {
              value: "Access",
              colspan: 1,
              style: {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
              size: 6,
            },
            {
              value: "Total Value",
              colspan: 1,
              size: 1,
            },
            {
              value: "Relative Value",
              size: 1,
              colspan: 1,
            },
          ],
        },
      ],
    },
  },
} as ComponentMeta<typeof DesktopTable>

export const Default = createStory<typeof DesktopTable>((args) => (
  <DesktopTable {...args} />
))
