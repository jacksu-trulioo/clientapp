import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const LogoutIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M15 16.414L19.414 12L15 7.586L13.586 9L15.586 11H9V13H15.586L13.586 15L15 16.414Z"
      fill="currentColor"
    />
    <path
      d="M16 18H7V6H16V4H6C5.448 4 5 4.448 5 5V19C5 19.552 5.448 20 6 20H16V18Z"
      fill="currentColor"
    />
  </Icon>
)

export default LogoutIcon
