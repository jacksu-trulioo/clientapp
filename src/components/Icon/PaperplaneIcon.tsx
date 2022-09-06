import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const PaperplaneIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#clip0)">
      <path
        d="M7.59955 13.6001V18.5001C7.59955 19.2001 8.39955 19.5001 8.89955 19.0001L11.1996 16.3001L15.8996 19.8001C16.2996 20.1001 16.8996 19.9001 16.9996 19.4001L19.9996 4.90012C20.0996 4.30012 19.5996 3.90012 18.9996 4.10012L4.49955 9.90012C3.99955 10.1001 3.89955 10.8001 4.29955 11.2001L5.89955 12.4001L10.4996 10.2001C10.8996 10.0001 11.1996 10.5001 10.8996 10.7001L7.59955 13.6001Z"
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

export default PaperplaneIcon
