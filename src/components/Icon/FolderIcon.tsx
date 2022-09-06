import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const FolderIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M19 7H12.4L9.7 4.3C9.5 4.1 9.3 4 9 4H5C4.4 4 4 4.4 4 5V19C4 19.6 4.4 20 5 20H19C19.6 20 20 19.6 20 19V8C20 7.4 19.6 7 19 7Z"
      fill="currentColor"
    />
  </Icon>
)

export default FolderIcon
