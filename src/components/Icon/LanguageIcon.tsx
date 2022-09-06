import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const LanguageIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
    <path
      d="M15 12C15 14.0876 14.5748 15.928 13.934 17.2096C13.2633 18.5511 12.5217 19 12 19C11.4783 19 10.7367 18.5511 10.066 17.2096C9.4252 15.928 9 14.0876 9 12C9 9.91244 9.4252 8.07196 10.066 6.79036C10.7367 5.44895 11.4783 5 12 5C12.5217 5 13.2633 5.44895 13.934 6.79036C14.5748 8.07196 15 9.91244 15 12Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" />
  </Icon>
)

export default LanguageIcon
