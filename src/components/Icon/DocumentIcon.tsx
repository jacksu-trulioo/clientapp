import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const DocumentIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M18 4H6C5.4 4 5 4.4 5 5V19C5 19.6 5.4 20 6 20H18C18.6 20 19 19.6 19 19V5C19 4.4 18.6 4 18 4ZM12 17H8V15H12V17ZM16 13H8V11H16V13ZM16 9H8V7H16V9Z"
      fill="currentColor"
    />
  </Icon>
)

export default DocumentIcon
