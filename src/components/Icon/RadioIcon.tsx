import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const RadioIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="4" />
  </Icon>
)

export default RadioIcon
