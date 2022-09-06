import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const CaretUpIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.24429 13.5636L11.5927 8.17043C11.8178 7.94319 12.1816 7.94319 12.4073 8.17043L17.7557 13.5636C18.0814 13.8916 18.0814 14.4253 17.7557 14.754C17.43 15.082 16.9013 15.082 16.5756 14.754L11.9997 10.1404L7.42496 14.754C7.09866 15.082 6.57002 15.082 6.24429 14.754C5.91857 14.4253 5.91857 13.8916 6.24429 13.5636Z"
      fill="currentColor"
    />
  </Icon>
)

export default CaretUpIcon
