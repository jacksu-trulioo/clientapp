import "react-datepicker/dist/react-datepicker.css"

import { useToken } from "@chakra-ui/react"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import Datepicker from "./DatePicker"

export default {
  title: "Form Controls/Datepicker",
  component: Datepicker,
} as ComponentMeta<typeof Datepicker>
const Template: ComponentStory<typeof Datepicker> = (accordianListParams) => {
  const { t } = useTranslation("scheduleMeeting")
  const [contrast200, primary500] = useToken("colors", [
    "contrast.200",
    "primary.500",
  ])
  return (
    <Datepicker
      footerDetails={[
        {
          title: t("calendarLegends.today"),
          color: contrast200,
          isCircle: true,
        },
        {
          title: t("calendarLegends.availableTimes"),
          color: primary500,
          isCircle: true,
        },
        {
          title: t("calendarLegends.selected"),
          color: primary500,
          isCircle: false,
        },
      ]}
      {...accordianListParams}
    />
  )
}

export const BasicDatepicker = Template.bind({})

BasicDatepicker.args = {
  name: "basicDatepickerComp",
  readonly: false,
  highlightWithRanges: [new Date()],
}

export const ViewModeDatePicker = Template.bind({})
const defaultMaxDate = new Date()
defaultMaxDate.setMonth(defaultMaxDate.getMonth() + 1)
ViewModeDatePicker.args = {
  name: "viewModeDatepickerComp",
  placeholder: "DD/MM/YYYY",
  readonly: true,
  highlightWithRanges: [new Date(), defaultMaxDate],
  eventBadgesList: [
    { day: new Date(), numberOfEvents: "2" },
    { day: defaultMaxDate, numberOfEvents: "2" },
  ],
}
