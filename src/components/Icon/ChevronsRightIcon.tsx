import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const ChevronsRightIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M12 7.00009L16.6464 11.6465C16.8417 11.8418 16.8417 12.1584 16.6464 12.3536L12 17.0001"
      stroke="currentColor"
      fill="transparent"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M6 7.00009L10.6464 11.6465C10.8417 11.8418 10.8417 12.1584 10.6464 12.3536L6 17.0001"
      stroke="currentColor"
      fill="transparent"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Icon>
)

export default ChevronsRightIcon
