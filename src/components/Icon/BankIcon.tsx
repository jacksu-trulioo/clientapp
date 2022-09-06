import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const BankIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#clip0)">
      <path
        d="M19 18V12H17V18H15V12H13V18H11V12H9V18H7V12H5V18H4V20H20V18H19Z"
        fill="currentColor"
      />
      <path
        d="M19.4 7.0999L12.4 4.0999C12.1 3.9999 11.9 3.9999 11.6 4.0999L4.6 7.0999C4.2 7.1999 4 7.5999 4 7.9999V9.9999C4 10.5999 4.4 10.9999 5 10.9999H19C19.6 10.9999 20 10.5999 20 9.9999V7.9999C20 7.5999 19.8 7.1999 19.4 7.0999ZM12 8.9999C11.4 8.9999 11 8.5999 11 7.9999C11 7.3999 11.4 6.9999 12 6.9999C12.6 6.9999 13 7.3999 13 7.9999C13 8.5999 12.6 8.9999 12 8.9999Z"
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

export default BankIcon
