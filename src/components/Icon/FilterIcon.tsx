import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const FilterIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M19.8947 4.553C19.7247 4.214 19.3787 4 18.9997 4H4.99969C4.62069 4 4.27469 4.214 4.10469 4.553C3.93669 4.892 3.97269 5.297 4.19969 5.6L9.99969 13.333V19C9.99969 19.553 10.4467 20 10.9997 20H12.9997C13.5527 20 13.9997 19.553 13.9997 19V13.333L19.7997 5.6C20.0267 5.297 20.0627 4.892 19.8947 4.553Z"
      fill="currentColor"
    />
  </Icon>
)

export default FilterIcon
