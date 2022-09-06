import { Box, HStack, Text } from "@chakra-ui/layout"
import { chakra, useBreakpointValue } from "@chakra-ui/react"
import { format } from "date-fns"
import useTranslation from "next-translate/useTranslation"
import React, { FC, useEffect } from "react"
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
  componentName: string
  showInputField?: boolean
  minDate?: Date
  maxDate?: Date
  readonly?: boolean
  eventBadgesList?: PortfolioActivityType[]
  highlightWithRanges?: HighlightRange
  footerDetails?: FooterDetailsType[]
  showDisabledMonthNavigation: boolean
  dayClassName?: string
  isChange: () => void
  isStartDate?: Date
}

type EventTypes = {
  date: string
  numberOfEvents: number
}

const StyledDatepicker = chakra(DatePicker)

const Calender: FC<DatepickerProps> = (props: DatepickerProps) => {
  const isMobileView = useBreakpointValue({ base: true, md: false })

  const { lang } = useTranslation()
  useEffect(() => {
    setTimeout(() => {
      renderNumberEventsBadge()
    }, 100)
  })

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
        element?.setAttribute("style", "display: none")
      }
    }

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
        selected={props.isStartDate}
        onChange={props.isChange}
        highlightDates={props.highlightWithRanges}
        wrapperClassName="datepicker-input-wrapper"
        autoFocus
        onMonthChange={() => {
          props.isChange()
          renderNumberEventsBadge()
        }}
        inline={props.readonly ? true : false}
        popperClassName={
          props.readonly ? `datepicker-popper read-only` : `datepicker-popper`
        }
        minDate={props.minDate}
        maxDate={props.maxDate}
        showDisabledMonthNavigation={props.showDisabledMonthNavigation}
        dayClassName={(date: Date) =>
          `isDate-${format(new Date(date), "dd-MM")}`
        }
        adjustDateOnChange
      >
        <Box display="block">
          <HStack
            color="gray.200"
            fontSize={{
              lg: "12px",
              base: "12px !important",
              md: "12px !important",
            }}
            py="6"
            mx={{ md: "0", lgp: "6", base: "6" }}
            borderTop="1px"
            borderTopColor="gray.700"
            className="legendsContainer"
            justifyContent="flex-start !important"
            style={{
              alignItems: lang.includes("ar") ? "baseline" : "center",
              fontFamily: lang.includes("ar")
                ? "Almarai, sans-serif"
                : "Gotham, sans-serif",
            }}
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
                      marginInlineStart="0 !important"
                      pr={{
                        md: "24px",
                        lg: "24px",
                        base: lang == "ar" ? "12px" : "16px",
                      }}
                      pl={{
                        md: "24px",
                        lg: "24px",
                        base: "20px",
                      }}
                      key={index}
                      className="legendsArea"
                    >
                      {element.title}
                    </Text>
                  )
                },
              )}
          </HStack>
        </Box>
      </StyledDatepicker>
    </Box>
  )
}
export default Calender
