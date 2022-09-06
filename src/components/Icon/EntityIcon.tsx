import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const EntityIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M19 13H17V7C17 6.4 16.6 6 16 6H13V4H11V6H8C7.4 6 7 6.4 7 7V13H5C4.4 13 4 13.4 4 14V19C4 19.6 4.4 20 5 20H19C19.6 20 20 19.6 20 19V14C20 13.4 19.6 13 19 13ZM9 14V8H15V14V18H13V15H11V18H9V14Z"
      fill="currentColor"
    />
    <path d="M13 10H11V12H13V10Z" fill="currentColor" />
  </Icon>
)

export default EntityIcon
