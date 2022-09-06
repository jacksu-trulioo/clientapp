import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const DownArrow = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 13 7" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.8729 1.43642L6.52449 6.82957C6.29935 7.05681 5.93561 7.05681 5.70989 6.82957L0.36148 1.43642C0.0357567 1.10838 0.0357567 0.574654 0.36148 0.24603C0.687203 -0.0820105 1.21584 -0.0820105 1.54157 0.24603L6.11748 4.85958L10.6922 0.24603C11.0185 -0.0820105 11.5472 -0.0820105 11.8729 0.24603C12.1986 0.574654 12.1986 1.10838 11.8729 1.43642Z"
      fill="#B99855"
    />
  </Icon>
)

export default DownArrow
