import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const RectangleDrawerIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <rect x="0.5" y="9" width="23" height="2" rx="1" fill="currentColor" />
    <rect x="0.5" y="13" width="23" height="2" rx="1" fill="currentColor" />
  </Icon>
)

export default RectangleDrawerIcon
