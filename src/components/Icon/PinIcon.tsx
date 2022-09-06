import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const PinIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#clip0)">
      <path
        d="M12 4C8.1 4 5 7.1 5 11C5 12.9 5.7 14.7 7.1 16C7.2 16.1 11.2 19.7 11.3 19.8C11.7 20.1 12.3 20.1 12.6 19.8C12.7 19.7 16.8 16.1 16.8 16C18.2 14.7 18.9 12.9 18.9 11C19 7.1 15.9 4 12 4ZM12 13C10.9 13 10 12.1 10 11C10 9.9 10.9 9 12 9C13.1 9 14 9.9 14 11C14 12.1 13.1 13 12 13Z"
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

export default PinIcon
