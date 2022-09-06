import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const SuccessTickIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM10.75 16.25L6.5 12L8.25 10.25L10.75 12.75L15.75 7.75L17.5 9.5L10.75 16.25Z"
      fill="currentColor"
    />
  </Icon>
)

export default SuccessTickIcon
