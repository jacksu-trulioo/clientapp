import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const ConfirmedIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 97 97" {...props}>
    <circle cx="48.1211" cy="48.5" r="48" fill="#222222" />
    <g clipPath="url(#clip0_17372_238326)">
      <path
        d="M48.1198 27.832C36.7531 27.832 27.4531 37.132 27.4531 48.4987C27.4531 59.8654 36.7531 69.1654 48.1198 69.1654C59.4865 69.1654 68.7865 59.8654 68.7865 48.4987C68.7865 37.132 59.4865 27.832 48.1198 27.832ZM45.5365 57.282L36.7531 48.4987L40.3698 44.882L45.5365 50.0487L55.8698 39.7154L59.4865 43.332L45.5365 57.282Z"
        fill="#B99855"
      />
    </g>
    <defs>
      <clipPath id="clip0_17372_238326">
        <rect
          width="41.3333"
          height="41.3333"
          fill="white"
          transform="translate(27.4531 27.832)"
        />
      </clipPath>
    </defs>
  </Icon>
)

export default ConfirmedIcon
