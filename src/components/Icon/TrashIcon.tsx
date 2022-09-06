import { HTMLChakraProps, Icon } from "@chakra-ui/react"

export const TrashIcon = (props: HTMLChakraProps<"svg">) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#clip0)">
      <path
        d="M19 7H16V5C16 4.73478 15.8946 4.48043 15.7071 4.29289C15.5196 4.10536 15.2652 4 15 4H9C8.73478 4 8.48043 4.10536 8.29289 4.29289C8.10536 4.48043 8 4.73478 8 5V7H5C4.73478 7 4.48043 7.10536 4.29289 7.29289C4.10536 7.48043 4 7.73478 4 8C4 8.26522 4.10536 8.51957 4.29289 8.70711C4.48043 8.89464 4.73478 9 5 9H19C19.2652 9 19.5196 8.89464 19.7071 8.70711C19.8946 8.51957 20 8.26522 20 8C20 7.73478 19.8946 7.48043 19.7071 7.29289C19.5196 7.10536 19.2652 7 19 7ZM10 7V6H14V7H10Z"
        fill="currentColor"
      />
      <path
        d="M6.05469 11L6.50469 19.1C6.52956 19.3475 6.6458 19.5769 6.83071 19.7433C7.01562 19.9097 7.25592 20.0012 7.50469 20H16.5047C16.7526 20 16.9917 19.9079 17.1755 19.7416C17.3594 19.5753 17.4749 19.3467 17.4997 19.1L17.9497 11H6.05469Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect
          width="16"
          height="16"
          fill="currentColor"
          transform="translate(4 4)"
        />
      </clipPath>
    </defs>
  </Icon>
)

export default TrashIcon
