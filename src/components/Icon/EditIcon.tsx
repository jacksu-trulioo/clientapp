import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const EditIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M12.1 7.5L4.3 15.3C4.1 15.5 4 15.7 4 16V19C4 19.6 4.4 20 5 20H8C8.3 20 8.5 19.9 8.7 19.7L16.5 11.9L12.1 7.5Z"
      fill="currentColor"
    />
    <path
      d="M19.7 7.3L16.7 4.3C16.3 3.9 15.7 3.9 15.3 4.3L13.5 6.1L17.9 10.5L19.7 8.7C20.1 8.3 20.1 7.7 19.7 7.3Z"
      fill="currentColor"
    />
  </Icon>
)

export default EditIcon
