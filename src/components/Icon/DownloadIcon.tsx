import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const DownloadIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 13 13" {...props}>
    <g clipPath="url(#clip0_23640_121870)">
      <path
        aria-label="Download Icon"
        role={"button"}
        d="M6.18361 9.94824C6.40861 9.94824 6.55861 9.87324 6.70861 9.72324L10.9836 5.44824L9.93361 4.39824L6.93361 7.39824V0.948242H5.43361V7.39824L2.43361 4.39824L1.38361 5.44824L5.65861 9.72324C5.80861 9.87324 5.95861 9.94824 6.18361 9.94824Z"
        fill="#B99855"
      />
      <path
        d="M10.6836 11.4482H1.68359V9.19824H0.183594V12.1982C0.183594 12.6482 0.483594 12.9482 0.933594 12.9482H11.4336C11.8836 12.9482 12.1836 12.6482 12.1836 12.1982V9.19824H10.6836V11.4482Z"
        fill="#B99855"
      />
    </g>
    <defs>
      <clipPath id="clip0_23640_121870">
        <rect
          width="12"
          height="12"
          fill="white"
          transform="translate(0.183594 0.948242)"
        />
      </clipPath>
    </defs>
  </Icon>
)

export default DownloadIcon
