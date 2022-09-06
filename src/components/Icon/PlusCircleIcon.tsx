import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const PlusCircleIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M12 4C7.6 4 4 7.6 4 12C4 16.4 7.6 20 12 20C16.4 20 20 16.4 20 12C20 7.6 16.4 4 12 4ZM16 13H13V16H11V13H8V11H11V8H13V11H16V13Z"
      fill="currentColor"
    />
  </Icon>
)

export default PlusCircleIcon
