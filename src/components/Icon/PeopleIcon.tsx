import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const PeopleIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.3002 9.23436L19.1002 10.4344C19.7002 10.8344 20.0002 11.4344 20.0002 12.1344V12.9344C20.0002 13.5344 19.6002 13.9344 19.0002 13.9344H15.6002C15.6002 13.8344 14.4002 12.9344 14.4002 12.9344C14.8002 12.2344 15.0002 11.3344 15.0002 10.4344V9.43436C15.0002 7.83436 14.3002 6.43436 13.2002 5.43436C13.7002 4.53436 14.7002 3.83436 15.9002 4.03436C17.1002 4.23436 18.0002 5.43436 18.0002 6.63436V7.53436C18.0002 8.23436 17.7002 8.83436 17.3002 9.23436ZM11.5 13.4344L14.2 15.4344C14.7 15.8344 15 16.4344 15 17.0344V19.0344C15 19.6344 14.6 20.0344 14 20.0344H5C4.4 20.0344 4 19.6344 4 19.0344V17.1344C4 16.5344 4.3 15.9344 4.8 15.5344L7.5 13.4344C6.6 12.7344 6 11.7344 6 10.5344V9.53437C6 7.53437 7.7 5.93437 9.7 6.03437C11.6 6.13437 13 7.83437 13 9.73437V10.5344C13 11.7344 12.4 12.7344 11.5 13.4344Z"
      fill="currentColor"
    />
  </Icon>
)

export default PeopleIcon
