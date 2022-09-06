import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const SearchIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#clip0)">
      <path
        d="M16.7 15.3C17.6 14.1 18.1 12.7 18.1 11.1C18.1 7.2 15 4 11.1 4C7.2 4 4 7.2 4 11.1C4 15 7.2 18.2 11.1 18.2C12.7 18.2 14.2 17.7 15.3 16.8L18.3 19.8C18.5 20 18.8 20.1 19 20.1C19.2 20.1 19.5 20 19.7 19.8C20.1 19.4 20.1 18.8 19.7 18.4L16.7 15.3ZM11.1 16.1C8.3 16.1 6 13.9 6 11.1C6 8.3 8.3 6 11.1 6C13.9 6 16.2 8.3 16.2 11.1C16.2 13.9 13.9 16.1 11.1 16.1Z"
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

export default SearchIcon
