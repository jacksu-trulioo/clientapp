import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const CircularLeftIcon = (props: HTMLChakraProps<"svg">) => (
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
        d="M21.7996 15.8L10.6666 15.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6333 11.8334L10.6666 15.8L14.6333 19.7667"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Icon>
)

export default CircularLeftIcon
