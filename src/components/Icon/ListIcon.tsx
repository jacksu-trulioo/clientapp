import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const ListIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M6 8C7.10457 8 8 7.10457 8 6C8 4.89543 7.10457 4 6 4C4.89543 4 4 4.89543 4 6C4 7.10457 4.89543 8 6 8Z"
      fill="currentColor"
    />
    <path d="M20 5H10V7H20V5Z" fill="currentColor" />
    <path
      d="M6 14C7.10457 14 8 13.1046 8 12C8 10.8954 7.10457 10 6 10C4.89543 10 4 10.8954 4 12C4 13.1046 4.89543 14 6 14Z"
      fill="currentColor"
    />
    <path d="M20 11H10V13H20V11Z" fill="currentColor" />
    <path
      d="M6 20C7.10457 20 8 19.1046 8 18C8 16.8954 7.10457 16 6 16C4.89543 16 4 16.8954 4 18C4 19.1046 4.89543 20 6 20Z"
      fill="currentColor"
    />
    <path d="M20 17H10V19H20V17Z" fill="currentColor" />
  </Icon>
)

export default ListIcon
