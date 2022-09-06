import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const VideoIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M20.75 2H3.25C2.5 2 2 2.5 2 3.25V20.75C2 21.5 2.5 22 3.25 22H20.75C21.5 22 22 21.5 22 20.75V3.25C22 2.5 21.5 2 20.75 2ZM15.25 13L10.25 16.75C9.5 17.375 8.25 16.75 8.25 15.75V8.25C8.25 7.25 9.375 6.625 10.25 7.25L15.25 11C15.875 11.5 15.875 12.5 15.25 13Z"
      fill="currentColor"
    />
  </Icon>
)

export default VideoIcon
