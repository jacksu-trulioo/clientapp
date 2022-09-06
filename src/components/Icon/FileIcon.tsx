import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const FileIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path d="M15 4V8H19L15 4Z" fill="currentColor" />
    <path
      d="M13 10H19V19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V5C5 4.4 5.4 4 6 4H13V10Z"
      fill="currentColor"
    />
  </Icon>
)

export default FileIcon
