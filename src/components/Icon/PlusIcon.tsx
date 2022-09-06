import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const PlusIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M19 11H13V5C13 4.4 12.6 4 12 4C11.4 4 11 4.4 11 5V11H5C4.4 11 4 11.4 4 12C4 12.6 4.4 13 5 13H11V19C11 19.6 11.4 20 12 20C12.6 20 13 19.6 13 19V13H19C19.6 13 20 12.6 20 12C20 11.4 19.6 11 19 11Z"
      fill="currentColor"
    />
  </Icon>
)

export default PlusIcon
