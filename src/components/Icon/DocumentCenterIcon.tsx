import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const DocumentCenterIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 20 20" {...props}>
    <path d="M13 2V6H17L13 2Z" fill="#C7C7C7" />
    <path
      d="M11 8H17V17C17 17.6 16.6 18 16 18H4C3.4 18 3 17.6 3 17V3C3 2.4 3.4 2 4 2H11V8Z"
      fill="#C7C7C7"
    />
  </Icon>
)

export default DocumentCenterIcon
