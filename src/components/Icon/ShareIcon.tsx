import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const ShareIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M17 19H5C4.448 19 4 18.552 4 18V8C4 7.448 4.448 7 5 7H9V9H6V17H16V14H18V18C18 18.552 17.552 19 17 19Z"
      fill="currentColor"
    />
    <path
      d="M20 8L16 4V7C12.691 7 10 9.691 10 13H12C12 10.794 13.794 9 16 9V12L20 8Z"
      fill="currentColor"
    />
  </Icon>
)

export default ShareIcon
