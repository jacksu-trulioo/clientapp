import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const ChevronSingleLeftIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.04237 0.496176L0.446934 4.06178C0.29544 4.21187 0.29544 4.45436 0.446933 4.60485L4.04237 8.17045C4.26106 8.3876 4.61688 8.3876 4.83596 8.17045C5.05465 7.9533 5.05465 7.60088 4.83596 7.38373L1.76026 4.33312L4.83596 1.28329C5.05465 1.06575 5.05465 0.713325 4.83596 0.496176C4.61688 0.279028 4.26106 0.279028 4.04237 0.496176Z"
      fill="currentColor"
    />
  </Icon>
)

export default ChevronSingleLeftIcon
