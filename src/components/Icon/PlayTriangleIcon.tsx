import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const PlayTriangleIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#clip0)">
      <path
        d="M16.5 11.9993C16.5 11.7548 16.3807 11.5253 16.1798 11.385L8.67975 6.13505C8.45175 5.97455 8.15175 5.95655 7.9035 6.08405C7.65525 6.2138 7.5 6.46955 7.5 6.7493V17.25C7.5 17.5298 7.65525 17.7863 7.9035 17.9153C8.15175 18.0428 8.451 18.0248 8.67975 17.8643L16.1798 12.6143C16.3807 12.4748 16.5 12.2453 16.5 12.0008C16.5 12 16.5 12 16.5 11.9993C16.5 12 16.5 12 16.5 11.9993Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect
          width="12"
          height="12"
          fill="currentColor"
          transform="translate(6 6)"
        />
      </clipPath>
    </defs>
  </Icon>
)

export default PlayTriangleIcon
