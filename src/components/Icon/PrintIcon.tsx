import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const PrintIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon
    width="22px"
    height="22px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M17 4H7V7H17V4Z" fill="#B99855" />
    <path
      d="M19 9H5C4.4 9 4 9.4 4 10V16C4 16.6 4.4 17 5 17H7V19C7 19.6 7.4 20 8 20H16C16.6 20 17 19.6 17 19V17H19C19.6 17 20 16.6 20 16V10C20 9.4 19.6 9 19 9ZM15 18H9V13H15V18Z"
      fill="#B99855"
    />
  </Icon>
)

export default PrintIcon
