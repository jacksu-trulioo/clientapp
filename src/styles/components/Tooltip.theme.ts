import { cssVar } from "@chakra-ui/theme-tools"

const $arrowBg = cssVar("popper-arrow-bg")
const $bg = cssVar("tooltip-bg")

const Tooltip = {
  baseStyle: {
    [$bg.variable]: `colors.gray.750`,
    padding: 3,
    bg: [$bg.reference],
    [$arrowBg.variable]: [$bg.reference],
    color: "white",
    rounded: "md",
  },
  variants: {
    secondary: {
      zIndex: "0 !important",
    },
  },
}

export default Tooltip
