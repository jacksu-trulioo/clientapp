import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const CalendarIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path d="M13 14H11V16H13V14Z" fill="currentColor" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 6H19C19.552 6 20 6.448 20 7V19C20 19.552 19.552 20 19 20H5C4.448 20 4 19.552 4 19V7C4 6.448 4.448 6 5 6H7V4H10V6H14V4H17V6ZM6 18H18V9H6V18ZM8 11H10V13H8V11ZM13 11H11V13H13V11ZM8 14H10V16H8V14ZM16 11H14V13H16V11ZM14 14H16V16H14V14Z"
      fill="currentColor"
    />
  </Icon>
)

export default CalendarIcon
