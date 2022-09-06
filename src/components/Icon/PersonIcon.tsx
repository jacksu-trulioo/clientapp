import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const PersonIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.4998 8.24928C16.4998 10.7307 14.4818 12.7487 12.0004 12.7487C9.519 12.7487 7.50102 10.7307 7.50102 8.24928V7.49939C7.50102 5.01797 9.519 3 12.0004 3C14.4818 3 16.4998 5.01797 16.4998 7.49939V8.24928ZM6.50934 14.9844C10.0376 14.0073 13.9633 14.0073 17.4908 14.9844C19.1144 15.4344 20.249 16.9214 20.249 18.602V20.9979H3.75122V18.602C3.75122 16.9214 4.88582 15.4344 6.50934 14.9844Z"
      fill="currentColor"
    />
  </Icon>
)

export default PersonIcon
