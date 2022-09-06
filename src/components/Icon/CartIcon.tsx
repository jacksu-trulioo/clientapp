import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const CartIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M19 7H8.5L8 4.8C7.9 4.3 7.5 4 7 4H4V6H6.2L8 14.2C8.1 14.7 8.5 15 9 15H17C17.4 15 17.8 14.7 17.9 14.3L19.9 8.3C20.1 7.8 19.8 7 19 7Z"
      fill="currentColor"
    />
    <path
      d="M9 20C10.1046 20 11 19.1046 11 18C11 16.8954 10.1046 16 9 16C7.89543 16 7 16.8954 7 18C7 19.1046 7.89543 20 9 20Z"
      fill="currentColor"
    />
    <path
      d="M17 20C18.1046 20 19 19.1046 19 18C19 16.8954 18.1046 16 17 16C15.8954 16 15 16.8954 15 18C15 19.1046 15.8954 20 17 20Z"
      fill="currentColor"
    />
  </Icon>
)

export default CartIcon
