import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const TickIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon w="16px" h="16px" viewBox="0 0 14 10" {...props}>
    <path
      aria-label="Interested"
      role={"img"}
      d="M12.3417 0.25L4.59172 8L1.84172 5.25C1.50838 4.91667 1.00838 4.91667 0.675049 5.25C0.341715 5.58333 0.341715 6.08333 0.675049 6.41667L4.00838 9.75C4.17505 9.91667 4.34172 10 4.59172 10C4.84172 10 5.00838 9.91667 5.17505 9.75L13.5084 1.41667C13.8417 1.08333 13.8417 0.583333 13.5084 0.25C13.175 -0.0833333 12.675 -0.0833333 12.3417 0.25Z"
      fill="#111111"
    />
  </Icon>
)

export default TickIcon
