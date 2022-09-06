import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const InterestedIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 13 13" {...props}>
    <path
      aria-label="Not Interested"
      role={"img"}
      d="M10.5918 4.86426H6.0918V1.86426C6.0918 0.964258 5.4918 0.364258 4.5918 0.364258L2.3418 5.61426H0.841797C0.391797 5.61426 0.0917969 5.91426 0.0917969 6.36426V11.6143C0.0917969 12.0643 0.391797 12.3643 0.841797 12.3643H9.0918C10.1418 12.3643 11.1168 11.6143 11.2668 10.5643L12.0168 6.66426C12.2418 5.76426 11.5668 4.86426 10.5918 4.86426Z"
      fill="#B99855"
    />
  </Icon>
)

export default InterestedIcon
