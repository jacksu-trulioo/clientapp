import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const CircularRightIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 32 32" {...props}>
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2" />
      <path
        d="M10.6667 15.8L21.7997 15.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.833 11.8334L21.7997 15.8L17.833 19.7667"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Icon>
)

export default CircularRightIcon
