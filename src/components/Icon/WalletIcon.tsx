import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const WalletIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.5 4H14V7H5.5C4.7 7 4 6.3 4 5.5C4 4.7 4.7 4 5.5 4ZM4 9H19C19.6 9 20 9.4 20 10V19C20 19.6 19.6 20 19 20H6C4.9 20 4 19.1 4 18V9ZM15 14.5C15 15.3 15.7 16 16.5 16C17.3 16 18 15.3 18 14.5C18 13.7 17.3 13 16.5 13C15.7 13 15 13.7 15 14.5Z"
      fill="currentColor"
    />
  </Icon>
)

export default WalletIcon
