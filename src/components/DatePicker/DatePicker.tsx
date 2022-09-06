import "react-datepicker/dist/react-datepicker.css"

import { Box, HStack, Text } from "@chakra-ui/layout"
import {
  chakra,
  FormLabel,
  Input,
  useBreakpointValue,
  useMediaQuery,
  useToken,
} from "@chakra-ui/react"
import { format } from "date-fns"
import React, { FC, useState } from "react"
import ReactDatePicker from "react-datepicker"

import { CalendarIcon } from ".."
import { FormControl } from "../FormControl"

interface EventBageListProps {
  day: Date
  numberOfEvents: string
}
interface FooterProps {
  title: string
  color: string
  isCircle: boolean
}

interface DatepickerProps {
  name: string
  label: string
  showInputField?: boolean
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  readonly?: boolean
  eventBadgesList?: EventBageListProps[]
  highlightWithRanges?: Date[]
  excludedDates?: Date[]
  footerDetails?: FooterProps[]
  disabled?: boolean
  onDateChange(date: Date): void
  onDateFocus?(): void
  onDateBlur?(): void
  onOpenCalendar?(): void
  isDefault?: boolean
  selectedDate?: Date
  showMonthDropdown?: boolean
  showYearDropdown?: boolean
  yearDropdownItemNumber?: number
  isValid?: boolean
  filterDate?: (date: Date) => boolean
  setSelectedDateFlag?: boolean
}
const CustomeDatePicker = chakra(ReactDatePicker)
const Datepicker: FC<DatepickerProps> = (props: DatepickerProps) => {
  const defaultMaxDate = new Date()
  defaultMaxDate.setMonth(defaultMaxDate.getMonth() + 1)
  const {
    name,
    label,
    disabled,
    onDateChange,
    onDateFocus,
    onDateBlur,
    onOpenCalendar,
    minDate = new Date(),
    maxDate = defaultMaxDate,
    selectedDate,
    showMonthDropdown = false,
    showYearDropdown = false,
    yearDropdownItemNumber,
    isValid,
    setSelectedDateFlag = false,
    ...rest
  } = props
  const [gray200, gray700, gray800] = useToken("colors", [
    "gray.200",
    "gray.700",
    "gray.800",
  ])

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isTabView = useBreakpointValue({ base: false, md: true })
  const [isLessThan830] = useMediaQuery("(max-width: 830px)")
  const [startDate, setStartDate] = useState<Date | undefined>(selectedDate)

  React.useEffect(() => {
    if (!selectedDate) {
      setStartDate(undefined)
    } else {
      if (setSelectedDateFlag) {
        setStartDate(selectedDate)
      }
    }
  }, [selectedDate])

  /**
   * @name renderNumberEventsBadge
   * @param none
   * @returns none
   * @desc It is used to render the number events badge in the calendar
   */
  function renderNumberEventsBadge(): void {
    props.eventBadgesList &&
      props.eventBadgesList.forEach((item: EventBageListProps) => {
        const BADGE_ELEMENT = document.createElement("span")
        BADGE_ELEMENT.textContent = item.numberOfEvents
        const YEAR_AND_MONTH = format(new Date(item.day), "yyyy-MM")
        const DAY = format(new Date(item.day), "dd")
        const EVENT_ELEMENT = document.querySelector(
          `[aria-label='month  ${YEAR_AND_MONTH}'] .react-datepicker__day--0${DAY}`,
        )
        EVENT_ELEMENT?.appendChild(BADGE_ELEMENT)
      })
  }
  const advancedProps = {
    onFocus: onDateFocus,
    onBlur: onDateBlur,
    highlightDates: props.highlightWithRanges,
    onCalendarOpen: onOpenCalendar,
    filterDate: props.filterDate,
  }

  const CustomInput = (props: {
    onClick: React.MouseEventHandler<HTMLInputElement> | undefined
    placeholder: string | undefined
    value: string | number | readonly string[] | undefined
  }) => {
    return (
      <Input
        onClick={props.onClick}
        placeholder={props.placeholder}
        value={props.value}
        type="text"
        readOnly={true}
        outline="none !important"
        color="whiteAlpha.900"
      />
    )
  }

  return (
    <FormControl aria-label={name} name={name} {...rest}>
      <FormLabel color="gray.400" display="flex" alignItems="center">
        {label}
      </FormLabel>
      <Box
        w="100%"
        position="relative"
        cursor="pointer"
        className={
          `tfo-datepicker ${props.name}  ` +
          ` ${isMobileView ? "datepicker-mobileview" : "datepicker-webview"} ` +
          `${isTabView && isLessThan830 && " datepicker-tabview"} ` +
          `${props.readonly && " read-only-datepicker"}` +
          `${isValid && " datepicker-error"}`
        }
      >
        <CustomeDatePicker
          px={4}
          py={2}
          border={`1px solid ${gray700}`}
          color={gray200}
          bg={gray800}
          selected={startDate}
          dateFormat="dd/MM/yyyy"
          wrapperClassName="datepicker-input-wrapper"
          autoFocus={false}
          onMonthChange={renderNumberEventsBadge}
          onChange={(date: Date) => {
            setStartDate(date)
            onDateChange(date)
          }}
          inline={props.readonly ? true : false}
          placeholderText={props?.placeholder}
          popperClassName={
            props.readonly ? `datepicker-popper read-only` : `datepicker-popper`
          }
          excludeDates={props.excludedDates}
          disabled={disabled}
          className={disabled ? "datePicker-disabled" : ""}
          borderRadius="sm"
          minDate={minDate}
          maxDate={maxDate}
          onClickOutside={onDateBlur}
          onChangeRaw={(e) => e.preventDefault()}
          showMonthDropdown={showMonthDropdown}
          showYearDropdown={showYearDropdown}
          scrollableYearDropdown
          yearDropdownItemNumber={yearDropdownItemNumber}
          customInput={
            <CustomInput
              onClick={undefined}
              placeholder={undefined}
              value={undefined}
            />
          }
          {...advancedProps}
        >
          {props?.footerDetails && (
            <Box>
              <HStack
                color="gray.200"
                fontSize="xs"
                py="6"
                mx={{ base: "3", md: "4" }}
                borderTop="1px"
                borderTopColor="gray.400"
                justifyContent="space-between"
              >
                {props.footerDetails &&
                  props.footerDetails.map(
                    (element: FooterProps, index: number) => {
                      return (
                        <Text
                          _before={{
                            content: '""',
                            display: "inline-block",
                            h: "4",
                            w: "4",
                            bg: element.isCircle ? "inherit" : element.color,
                            border: element.isCircle
                              ? `2px solid ${element.color}`
                              : "0",
                            borderRadius: "50%",
                            pos: "absolute",
                            left: "0",
                          }}
                          pos="relative"
                          pl="6"
                          key={index}
                        >
                          {element.title}
                        </Text>
                      )
                    },
                  )}
              </HStack>
            </Box>
          )}
        </CustomeDatePicker>
        {!props.readonly && (
          <CalendarIcon
            color="primary.500"
            w="5"
            h="5"
            className="datepicker-icon"
            _hover={{ cursor: "pointer" }}
            right="10px"
          />
        )}
      </Box>
    </FormControl>
  )
}
export default Datepicker
