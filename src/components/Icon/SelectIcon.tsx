import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const SelectIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M17.3 6.3L11 12.6L9.7 11.3C9.3 10.9 8.7 10.9 8.3 11.3C7.9 11.7 7.9 12.3 8.3 12.7L10.3 14.7C10.5 14.9 10.7 15 11 15C11.3 15 11.5 14.9 11.7 14.7L18.7 7.7C19.1 7.3 19.1 6.7 18.7 6.3C18.3 5.9 17.7 5.9 17.3 6.3Z"
      fill="currentColor"
    />
    <path
      d="M5 20H17C17.6 20 18 19.6 18 19V14C18 13.4 17.6 13 17 13C16.4 13 16 13.4 16 14V18H6V8H11C11.6 8 12 7.6 12 7C12 6.4 11.6 6 11 6H5C4.4 6 4 6.4 4 7V19C4 19.6 4.4 20 5 20Z"
      fill="currentColor"
    />
  </Icon>
)

export default SelectIcon
