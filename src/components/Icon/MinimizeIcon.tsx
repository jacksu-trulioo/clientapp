import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const MinimizeIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M19 11H5C4.4 11 4 11.4 4 12C4 12.6 4.4 13 5 13H19C19.6 13 20 12.6 20 12C20 11.4 19.6 11 19 11Z"
      fill="currentColor"
    />
  </Icon>
)

export default MinimizeIcon
