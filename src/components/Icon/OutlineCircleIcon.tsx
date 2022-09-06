import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const OutlineCircleIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
  </Icon>
)

export default OutlineCircleIcon
