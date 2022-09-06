import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const MoonIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M10.5 6C7.875 6.675 6 9.075 6 11.925C6 15.3 8.7 18 12.075 18C14.925 18 17.25 16.125 18 13.5C13.425 14.775 9.225 10.575 10.5 6Z"
      fill="currentColor"
    />
  </Icon>
)

export default MoonIcon
