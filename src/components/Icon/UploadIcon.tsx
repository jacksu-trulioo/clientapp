import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const UploadIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M10.9996 7.4V16H12.9996V7.4L16.9996 11.4L18.3996 10L12.6996 4.3C12.2996 3.9 11.6996 3.9 11.2996 4.3L5.59961 10L6.99961 11.4L10.9996 7.4Z"
      fill="currentColor"
    />
    <path
      d="M18 18H6V15H4V19C4 19.6 4.4 20 5 20H19C19.6 20 20 19.6 20 19V15H18V18Z"
      fill="currentColor"
    />
  </Icon>
)

export default UploadIcon
