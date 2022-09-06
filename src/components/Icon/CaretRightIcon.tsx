import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const CaretRightIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.2548 17.7557L15.6479 12.4073C15.8752 12.1822 15.8752 11.8184 15.6479 11.5927L10.2548 6.24429C9.92673 5.91857 9.39301 5.91857 9.06439 6.24429C8.73635 6.57002 8.73635 7.09866 9.06439 7.42438L13.6779 12.0003L9.06439 16.575C8.73635 16.9013 8.73635 17.43 9.06439 17.7557C9.39301 18.0814 9.92673 18.0814 10.2548 17.7557Z"
      fill="currentColor"
    />
  </Icon>
)

export default CaretRightIcon
