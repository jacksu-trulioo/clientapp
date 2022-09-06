import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const NoDataFoundIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon width="96px" height="99px" viewBox="0 0 96 99" {...props}>
    <g opacity="0.71">
      <path
        d="M84.7396 32.85V48.3313V98.2936H5.92578V25.1094H41.8759L45.3327 32.85H84.7396Z"
        fill="#4D4D4D"
      />
      <path
        d="M85.4433 98.291H5.92578L16.4812 47.625L95.9987 48.3287L85.4433 98.291Z"
        fill="#C7C7C7"
      />
    </g>
    <path d="M1 1L10.148 16.4813" stroke="#4D4D4D" />
    <path d="M25.6289 1.29688L29.8511 13.9634" stroke="#4D4D4D" />
    <path d="M65.7417 2.70312L61.5195 15.3696" stroke="#4D4D4D" />
    <path d="M89.6647 4.11328L84.0352 15.3724" stroke="#4D4D4D" />
  </Icon>
)

export default NoDataFoundIcon
