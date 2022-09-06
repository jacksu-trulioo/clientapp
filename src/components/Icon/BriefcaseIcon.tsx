import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const BriefcaseIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 8H19C19.6 8 20 8.4 20 9V15C20 15.6 19.6 16 19 16H14V15C14 14.4 13.6 14 13 14H11C10.4 14 10 14.4 10 15V16H5C4.4 16 4 15.6 4 15V9C4 8.4 4.4 8 5 8H8V5C8 4.4 8.4 4 9 4H15C15.6 4 16 4.4 16 5V8ZM10 8H14V6H10V8ZM14 17H19V19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V17H10C10 17.6 10.4 18 11 18H13C13.6 18 14 17.6 14 17Z"
      fill="currentColor"
    />
  </Icon>
)

export default BriefcaseIcon
