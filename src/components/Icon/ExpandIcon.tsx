import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const ExpandIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M20 12V4H12L15.3 7.3L7.3 15.3L4 12V20H12L8.7 16.7L16.7 8.7L20 12Z"
      fill="currentColor"
    />
  </Icon>
)

export default ExpandIcon
