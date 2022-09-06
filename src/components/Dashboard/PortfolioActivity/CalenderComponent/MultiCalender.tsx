import { Box, HStack, Text } from "@chakra-ui/layout"
import { chakra, useBreakpointValue } from "@chakra-ui/react"
import { format } from "date-fns"
import useTranslation from "next-translate/useTranslation"
import React, { FC, useEffect, useState } from "react"
import DatePicker from "react-datepicker"

import { CalendarIcon } from "~/components"
import { PortfolioActivityType } from "~/services/mytfo/clientTypes"

type FooterDetailsType = {
  bgColor: string
  title: string
}

type isEventDate = Date[]

type HighliDataType = {
  [key: string]: isEventDate
}

type HighlightRange = HighliDataType[]

interface DatepickerProps {
  componentName: string // unique for each component
  showInputField?: boolean
  minDate?: Date
  maxDate?: Date
  readonly?: boolean
  eventBadgesList?: PortfolioActivityType[]
  highlightWithRanges?: HighlightRange
  footerDetails?: FooterDetailsType[]
  showDisabledMonthNavigation?: boolean
  monthsShown?: number
  inline: boolean
}

type EventTypes = {
  date: string
  numberOfEvents: number
}

const StyledDatepicker = chakra(DatePicker)
let currentDate = new Date(
  new Date().getFullYear(),
  new Date().getMonth() - 1,
  1,
)

const MultiCalender: FC<DatepickerProps> = (props: DatepickerProps) => {
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const [startDate, setStartDate] = useState<Date>(currentDate)
  const { lang } = useTranslation()

  useEffect(() => {
    renderNumberEventsBadge()
  }, [props.eventBadgesList])
  /**
   * @name renderNumberEventsBadge
   * @param none
   * @returns none
   * @desc It is used to render the number events badge in the calendar
   */

  function renderNumberEventsBadge(): void {
    let SPAN_ELEMENT = document.querySelectorAll(".date-picker-event-badge")
    if (SPAN_ELEMENT) {
      for (const element of SPAN_ELEMENT) {
        element?.setAttribute("style", "visibility: hidden")
      }
    }

    setTimeout(() => {
      props.eventBadgesList &&
        props.eventBadgesList.forEach((item: EventTypes) => {
          if (item.numberOfEvents > 0) {
            const BADGE_ELEMENT = document.createElement("span")
            BADGE_ELEMENT.textContent = item.numberOfEvents.toString()
            BADGE_ELEMENT.className = "date-picker-event-badge"
            const YEAR_AND_MONTH = format(new Date(item.date), "yyyy-MM")

            const EVENT_ELEMENT = document.querySelector(
              `[aria-label='month  ${YEAR_AND_MONTH}'] .isDate-${format(
                new Date(item.date),
                "dd-MM",
              )}`,
            )

            if (EVENT_ELEMENT) {
              EVENT_ELEMENT?.appendChild(BADGE_ELEMENT)
            }
          }
        })
    }, 1000)
  }

  const getCalendarClass = () => {
    if (isMobileView) {
      return `tfo-datepicker-portfolio-activity ${
        props.componentName
      } datepicker-mobileview ${props.readonly ? "read-only-datepicker" : ""}`
    } else {
      return `tfo-datepicker-portfolio-activity ${
        props.componentName
      } datepicker-webview ${props.readonly ? "read-only-datepicker" : ""}`
    }
  }

  return (
    <Box className={getCalendarClass()}>
      {!props.readonly && (
        <CalendarIcon
          color="primary.500"
          w="5"
          h="5"
          className="datepicker-icon"
        />
      )}
      <StyledDatepicker
        selected={startDate}
        onChange={(date: Date) => setStartDate(date)}
        highlightDates={props.highlightWithRanges}
        wrapperClassName="datepicker-input-wrapper"
        autoFocus
        onMonthChange={renderNumberEventsBadge}
        inline={props.readonly ? true : false}
        popperClassName={
          props.readonly ? `datepicker-popper read-only` : `datepicker-popper`
        }
        minDate={props.minDate}
        maxDate={props.maxDate}
        showDisabledMonthNavigation={props.showDisabledMonthNavigation}
        monthsShown={2}
        dayClassName={(date: Date) =>
          `isDate-${format(new Date(date), "dd-MM")}`
        }
      ></StyledDatepicker>
      <Box>
        <HStack
          color="gray.200"
          fontSize={{
            lgp: "12px",
            base: "10px",
            md: "14px",
          }}
          py="6"
          borderTop="1px"
          borderTopColor="gray.700"
          justifyContent="flex-start"
          className="legendsContainer"
          m="18px 20px 0"
        >
          {props.footerDetails &&
            props.footerDetails.map(
              (element: FooterDetailsType, index: number) => {
                return (
                  <Text
                    _before={{
                      content: '""',
                      display: "inline-block",
                      height: "16px",
                      width: "16px",
                      bg: element.bgColor,
                      borderRadius: "50%",
                      pos: "absolute",
                      left: "0",
                      top: "-1px",
                    }}
                    pos="relative"
                    pl={{ lgp: "6", base: "4", md: "7" }}
                    mr={{ md: "24px !important", lgp: "0", base: "0" }}
                    key={index}
                    className="legendsArea"
                    style={{
                      fontFamily: lang.includes("ar")
                        ? "Almarai, sans-serif"
                        : "Gotham, sans-serif",
                    }}
                  >
                    {element.title}
                  </Text>
                )
              },
            )}
        </HStack>
      </Box>
    </Box>
  )
}
export default MultiCalender
