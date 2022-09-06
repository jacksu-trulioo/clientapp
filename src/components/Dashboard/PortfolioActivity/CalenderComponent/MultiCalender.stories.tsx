import "react-datepicker/dist/react-datepicker.css"

import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import MultiCalender from "./Calender"
export default {
  title: "Form Controls/MultiCalenderComponent",
  component: MultiCalender,
} as ComponentMeta<typeof MultiCalender>

const Template: ComponentStory<typeof MultiCalender> = (
  accordianListParams,
) => <MultiCalender {...accordianListParams} />
// story configuration for basic datepicker
export const BasicDatepicker = Template.bind({})
BasicDatepicker.args = {
  componentName: "basicDatepickerComp",
  readonly: false,
  highlightWithRanges: [
    {
      "react-datepicker__day--distribution": [
        new Date("2021-12-27"),
        new Date("2021-12-27"),
        new Date("2022-01-20"),
      ],
    },
  ],
  footerDetails: [
    { title: "Today", bgColor: "contrast.200" },
    { title: "Available times", bgColor: "primary.500" },
    { title: "Selected", bgColor: "primary.500" },
  ],
}
// story configuration for view mode datepicker
export const ViewModeDatePicker = Template.bind({})
ViewModeDatePicker.args = {
  componentName: "viewModeDatepickerComp",
  readonly: true,
  highlightWithRanges: [
    {
      "react-datepicker__day--distribution": [
        new Date("2021-12-27"),
        new Date("2021-12-27"),
        new Date("2022-01-20"),
      ],
    },
    {
      "react-datepicker__day--capital-calls": [new Date("2021-12-20")],
    },
    { "react-datepicker__day--exits": [new Date("2021-12-15")] },
  ],
  eventBadgesList: [
    {
      date: "2021-12-27",
      numberOfEvents: 2,
      distributions: [
        {
          dealName: "Project Magnum",
          amount: 123212,
        },
      ],
      capitalCalls: [
        {
          dealName: "Project Magnum",
          amount: 123212,
        },
      ],
      exits: [
        {
          dealName: "Project Magnum",
          amount: 123212,
        },
      ],
    },
  ],
  footerDetails: [
    { title: "Distribution", bgColor: "#7BAD1F" },
    { title: "Capital calls", bgColor: "#F7B198" },
    { title: "Exits", bgColor: "#8791E4" },
  ],
}
