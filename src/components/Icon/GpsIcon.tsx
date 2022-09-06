import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const GpsIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#clip0)">
      <path
        d="M4.69966 7.99998L18.6997 3.99998C19.4997 3.79998 20.1997 4.49998 19.9997 5.29998L15.9997 19.3C15.6997 20.2 14.4997 20.3 14.0997 19.4L11.2997 12.8L4.69966 9.99998C3.69966 9.49998 3.79966 8.29998 4.69966 7.99998Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect
          width="16"
          height="16"
          fill="currentColor"
          transform="matrix(-1 0 0 1 20 4)"
        />
      </clipPath>
    </defs>
  </Icon>
)

export default GpsIcon
