import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const MailIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon w="8" h="8" viewBox="0 0 24 24" {...props}>
    <path
      d="M19 5H5C4.4 5 4 5.4 4 6V7.4L12 11.9L20 7.5V6C20 5.4 19.6 5 19 5Z"
      fill="currentColor"
    />
    <path
      d="M11.5 13.9L4 9.69995V18C4 18.6 4.4 19 5 19H19C19.6 19 20 18.6 20 18V9.69995L12.5 13.9C12.22 14.04 11.78 14.04 11.5 13.9Z"
      fill="currentColor"
    />
  </Icon>
)

export default MailIcon
