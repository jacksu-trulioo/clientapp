import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const ChevronsLeftIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M11 7L6.35355 11.6464C6.15829 11.8417 6.15829 12.1583 6.35355 12.3536L11 17"
      stroke="currentColor"
      fill="transparent"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M17 7L12.3536 11.6464C12.1583 11.8417 12.1583 12.1583 12.3536 12.3536L17 17"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="transparent"
      strokeLinecap="round"
    />
  </Icon>
)

export default ChevronsLeftIcon
