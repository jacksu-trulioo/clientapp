import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const CaretLeftIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.5636 17.7557L8.17043 12.4073C7.94319 12.1822 7.94319 11.8184 8.17043 11.5927L13.5636 6.24429C13.8916 5.91857 14.4253 5.91857 14.754 6.24429C15.082 6.57002 15.082 7.09866 14.754 7.42438L10.1404 12.0003L14.754 16.575C15.082 16.9013 15.082 17.43 14.754 17.7557C14.4253 18.0814 13.8916 18.0814 13.5636 17.7557Z"
      fill="currentColor"
    />
  </Icon>
)

export default CaretLeftIcon
