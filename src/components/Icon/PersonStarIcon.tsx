import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const PersonStarIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#clip0)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.99984 12C8.15917 12 6.6665 9.84067 6.6665 8V7.33333C6.6665 5.49267 8.15917 4 9.99984 4C11.8405 4 13.3332 5.49267 13.3332 7.33333V8C13.3332 9.84067 11.8405 12 9.99984 12ZM12 16C12 15.122 12.2467 14.304 12.668 13.6027C11.866 13.4447 10.9613 13.3333 10 13.3333C8.11733 13.3333 6.44733 13.7587 5.35067 14.1287C4.54 14.4027 4 15.166 4 16.0213V18.6667H12.84C12.312 17.9107 12 16.992 12 16ZM17.6968 14.754L16.6668 12.6667L15.6368 14.754L13.3335 15.0887L15.0002 16.7133L14.6068 19.0073L16.6668 17.924L18.7268 19.0073L18.3335 16.7133L20.0002 15.0887L17.6968 14.754Z"
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

export default PersonStarIcon
