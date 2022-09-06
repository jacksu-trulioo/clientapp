import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const SpeakerIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.4 4.20019C14.1 3.70019 15 4.20019 15 5.00019V19.0002C15 19.8002 14.1 20.2002 13.4 19.8002L7.7 16.0002H5C4.4 16.0002 4 15.6002 4 15.0002V9.00019C4 8.40019 4.4 8.00019 5 8.00019H7.7L13.4 4.20019ZM16.8 14.8001C16.4 15.2001 16.4 15.8001 16.8 16.2001C17.2 16.6001 17.9 16.6001 18.2 16.2001C20.5 13.8001 20.5 10.0001 18.2 7.70015C17.8 7.30015 17.2 7.30015 16.8 7.70015C16.4 8.10015 16.4 8.70015 16.8 9.10015C18.4 10.7001 18.4 13.2001 16.8 14.8001Z"
      fill="currentColor"
    />
  </Icon>
)

export default SpeakerIcon
