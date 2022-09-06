import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const GlobeIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M12 4C7.6 4 4 7.6 4 12C4 16.4 7.6 20 12 20C16.4 20 20 16.4 20 12C20 7.6 16.4 4 12 4ZM17.9 11H16C15.9 9.5 15.6 8.1 15.2 6.9C16.6 7.8 17.6 9.3 17.9 11ZM12 18C11.4 18 10.2 16.1 10 13H14C13.8 16.1 12.6 18 12 18ZM10 11C10.2 7.9 11.3 6 12 6C12.7 6 13.8 7.9 14 11H10ZM8.9 6.9C8.4 8.1 8.1 9.5 8 11H6.1C6.4 9.3 7.4 7.8 8.9 6.9ZM6.1 13H8C8.1 14.5 8.4 15.9 8.8 17.1C7.4 16.2 6.4 14.7 6.1 13ZM15.1 17.1C15.6 15.9 15.8 14.5 15.9 13H17.8C17.6 14.7 16.6 16.2 15.1 17.1Z"
      fill="currentColor"
    />
  </Icon>
)

export default GlobeIcon
