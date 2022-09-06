import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const CloseIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      aria-label="Remove Deal"
      role={"dialog"}
      d="M18.7 5.3C18.3 4.9 17.7 4.9 17.3 5.3L12 10.6L6.7 5.3C6.3 4.9 5.7 4.9 5.3 5.3C4.9 5.7 4.9 6.3 5.3 6.7L10.6 12L5.3 17.3C4.9 17.7 4.9 18.3 5.3 18.7C5.5 18.9 5.7 19 6 19C6.3 19 6.5 18.9 6.7 18.7L12 13.4L17.3 18.7C17.5 18.9 17.8 19 18 19C18.2 19 18.5 18.9 18.7 18.7C19.1 18.3 19.1 17.7 18.7 17.3L13.4 12L18.7 6.7C19.1 6.3 19.1 5.7 18.7 5.3Z"
      fill="currentColor"
    />
  </Icon>
)

export default CloseIcon
