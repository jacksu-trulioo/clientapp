import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const ClockIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 17 17" {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
    >
      <path
        d="M8.85352 0.975586C4.44218 0.975586 0.853516 4.56425 0.853516 8.97559C0.853516 13.3869 4.44218 16.9756 8.85352 16.9756C13.2648 16.9756 16.8535 13.3869 16.8535 8.97559C16.8535 4.56425 13.2648 0.975586 8.85352 0.975586ZM13.5202 9.64225H8.18685V4.30892H9.52018V8.30892H13.5202V9.64225Z"
        fill="#B99855"
      />
    </svg>
    {/* <path
      d="M12 4C7.58867 4 4 7.58867 4 12C4 16.4113 7.58867 20 12 20C16.4113 20 20 16.4113 20 12C20 7.58867 16.4113 4 12 4ZM16.6667 12.6667H11.3333V7.33333H12.6667V11.3333H16.6667V12.6667Z"
      fill="#B99855"
    /> */}
  </Icon>
)

export default ClockIcon
