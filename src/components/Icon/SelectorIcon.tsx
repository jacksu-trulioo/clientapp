import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const SelectorIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <rect x="4" y="2" width="5" height="20" rx="2.5" fill="currentColor" />
  </Icon>
)

export default SelectorIcon
