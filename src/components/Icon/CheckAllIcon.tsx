import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const CheckAllIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#clip0)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.29259 17.707C7.48009 17.8945 7.7344 17.9999 7.99959 18H8.07759C8.22201 17.9884 8.36218 17.9455 8.4884 17.8744C8.61461 17.8032 8.72387 17.7055 8.80859 17.588L16.8086 6.588C16.9645 6.37344 17.0289 6.10572 16.9874 5.84373C16.946 5.58174 16.8022 5.34695 16.5876 5.191C16.373 5.03505 16.1053 4.97072 15.8433 5.01217C15.5813 5.05362 15.3465 5.19744 15.1906 5.412L7.87859 15.466L5.70659 13.293C5.61435 13.1975 5.504 13.1213 5.382 13.0689C5.25999 13.0165 5.12877 12.9889 4.99599 12.9877C4.86321 12.9866 4.73154 13.0119 4.60864 13.0622C4.48574 13.1125 4.37409 13.1867 4.2802 13.2806C4.18631 13.3745 4.11205 13.4861 4.06177 13.609C4.01149 13.7319 3.98619 13.8636 3.98734 13.9964C3.9885 14.1292 4.01608 14.2604 4.06849 14.3824C4.1209 14.5044 4.19708 14.6148 4.29259 14.707L7.29259 17.707ZM16.9995 8H19.9995V10H16.9995V8ZM13.9995 12V14H19.9995V12H13.9995ZM10.9995 16H19.9995V18H10.9995V16Z"
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

export default CheckAllIcon