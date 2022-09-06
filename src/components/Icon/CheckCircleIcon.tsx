import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const CheckCircleIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M12 4C7.6 4 4 7.6 4 12C4 16.4 7.6 20 12 20C16.4 20 20 16.4 20 12C20 7.6 16.4 4 12 4ZM11 15.4L7.6 12L9 10.6L11 12.6L15 8.6L16.4 10L11 15.4Z"
      fill="currentColor"
    />
  </Icon>
)

export default CheckCircleIcon
