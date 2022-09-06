import { HTMLChakraProps, Icon } from "@chakra-ui/react"

// Note: Viewbox should be "0 0 24 24" but we don't have designs for this yet.
export const CheckCircleAltIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 48 48" {...props}>
    <path
      d="M24 1C11.3 1 1 11.3 1 24C1 36.7 11.3 47 24 47C36.7 47 47 36.7 47 24C47 11.3 36.7 1 24 1ZM36.7 16.7L20.7 32.7C20.5 32.9 20.3 33 20 33C19.7 33 19.5 32.9 19.3 32.7L11.3 24.7C10.9 24.3 10.9 23.7 11.3 23.3C11.7 22.9 12.3 22.9 12.7 23.3L20 30.6L35.3 15.3C35.7 14.9 36.3 14.9 36.7 15.3C37.1 15.7 37.1 16.3 36.7 16.7Z"
      fill="currentColor"
    />
  </Icon>
)

export default CheckCircleAltIcon
