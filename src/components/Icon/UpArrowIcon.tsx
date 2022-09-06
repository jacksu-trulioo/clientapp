import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const UpArrowIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 40 38" {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="38"
      viewBox="0 0 40 38"
      fill="none"
    >
      <path
        d="M0 2C0 0.89543 0.895431 0 2 0H38C39.1046 0 40 0.895431 40 2V36C40 37.1046 39.1046 38 38 38H2C0.895431 38 0 37.1046 0 36V2Z"
        fill="#222222"
        fillOpacity="0.8"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.2443 20.5636L19.5927 15.1704C19.8178 14.9432 20.1816 14.9432 20.4073 15.1704L25.7557 20.5636C26.0814 20.8916 26.0814 21.4253 25.7557 21.754C25.43 22.082 24.9013 22.082 24.5756 21.754L19.9997 17.1404L15.425 21.754C15.0987 22.082 14.57 22.082 14.2443 21.754C13.9186 21.4253 13.9186 20.8916 14.2443 20.5636Z"
        fill="#B99855"
      />
      <path
        d="M2 2H38V-2H2V2ZM38 2V36H42V2H38ZM38 36H2V40H38V36ZM2 36V2H-2V36H2ZM2 36H2H-2C-2 38.2091 -0.209138 40 2 40V36ZM38 36V40C40.2091 40 42 38.2091 42 36H38ZM38 2H42C42 -0.20914 40.2091 -2 38 -2V2ZM2 -2C-0.209138 -2 -2 -0.209141 -2 2H2V2V-2Z"
        fill="#B99855"
      />
    </svg>
  </Icon>
)

export default UpArrowIcon
