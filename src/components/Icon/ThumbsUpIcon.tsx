import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const ThumbsUpIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 16 16" {...props}>
    <path
      d="M13.25 6.25H8V2.75C8 1.7 7.3 1 6.25 1L3.625 7.125H1.875C1.35 7.125 1 7.475 1 8V14.125C1 14.65 1.35 15 1.875 15H11.5C12.725 15 13.8625 14.125 14.0375 12.9L14.9125 8.35C15.175 7.3 14.3875 6.25 13.25 6.25Z"
      fill="currentColor"
    />
  </Icon>
)

export default ThumbsUpIcon
