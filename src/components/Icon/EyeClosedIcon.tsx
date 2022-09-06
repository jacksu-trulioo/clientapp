import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const ExpandIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M10 7.5C9.50555 7.5 9.0222 7.64662 8.61107 7.92133C8.19995 8.19603 7.87952 8.58648 7.6903 9.04329C7.50108 9.50011 7.45157 10.0028 7.54804 10.4877C7.6445 10.9727 7.8826 11.4181 8.23223 11.7678C8.58186 12.1174 9.02732 12.3555 9.51227 12.452C9.99723 12.5484 10.4999 12.4989 10.9567 12.3097C11.4135 12.1205 11.804 11.8 12.0787 11.3889C12.3534 10.9778 12.5 10.4945 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5ZM10 14.5C9.10998 14.5 8.23995 14.2361 7.49993 13.7416C6.75991 13.2471 6.18314 12.5443 5.84254 11.7221C5.50195 10.8998 5.41283 9.99501 5.58647 9.12209C5.7601 8.24918 6.18868 7.44736 6.81802 6.81802C7.44736 6.18868 8.24918 5.7601 9.12209 5.58647C9.99501 5.41283 10.8998 5.50195 11.7221 5.84254C12.5443 6.18314 13.2471 6.75991 13.7416 7.49993C14.2361 8.23995 14.5 9.10998 14.5 10C14.5 11.1935 14.0259 12.3381 13.182 13.182C12.3381 14.0259 11.1935 14.5 10 14.5V14.5ZM10 3C3 3 0 10 0 10C0 10 3 17 10 17C17 17 20 10 20 10C20 10 17 3 10 3Z"
      fill="currentColor"
    />
  </Icon>
)

export default ExpandIcon
