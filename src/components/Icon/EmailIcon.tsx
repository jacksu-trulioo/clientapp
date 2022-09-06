import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const EmailIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M20.75 3.125H3.25C2.5 3.125 2 3.575 2 4.25V5.825L12 10.8875L22 5.9375V4.25C22 3.575 21.5 3.125 20.75 3.125Z"
      fill="currentColor"
    />
    <path
      d="M11.375 13.1371L2 8.41211V17.7496C2 18.4246 2.5 18.8746 3.25 18.8746H20.75C21.5 18.8746 22 18.4246 22 17.7496V8.41211L12.625 13.1371C12.275 13.2946 11.725 13.2946 11.375 13.1371Z"
      fill="currentColor"
    />
  </Icon>
)

export default EmailIcon
