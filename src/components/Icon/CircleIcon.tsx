import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const CircleIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="8" fill="currentColor" />
  </Icon>
)

export default CircleIcon
