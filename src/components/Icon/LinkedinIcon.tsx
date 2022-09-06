import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const LinkedinIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#clip0)">
      <path
        d="M19.3 4H4.7C4.3 4 4 4.3 4 4.7V19.4C4 19.7 4.3 20 4.7 20H19.4C19.8 20 20.1 19.7 20.1 19.3V4.7C20 4.3 19.7 4 19.3 4ZM8.7 17.6H6.4V10H8.8V17.6H8.7ZM7.6 9C6.8 9 6.2 8.3 6.2 7.6C6.2 6.8 6.8 6.2 7.6 6.2C8.4 6.2 9 6.8 9 7.6C8.9 8.3 8.3 9 7.6 9ZM17.6 17.6H15.2V13.9C15.2 13 15.2 11.9 14 11.9C12.8 11.9 12.6 12.9 12.6 13.9V17.7H10.2V10H12.5V11C12.8 10.4 13.6 9.8 14.7 9.8C17.1 9.8 17.5 11.4 17.5 13.4V17.6H17.6Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect
          width="16"
          height="16"
          fill="currentColor"
          transform="translate(4 4)"
        />
      </clipPath>
    </defs>
  </Icon>
)

export default LinkedinIcon
