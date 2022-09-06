import { StyleFunctionProps } from "@chakra-ui/theme-tools"

const Divider = {
  baseStyle: (props: StyleFunctionProps) => {
    const { colorMode } = props
    const borderColor = colorMode === "dark" ? "gray.750" : "liteSlateGray.100"

    return {
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor,
      opacity: 1,
    }
  },
}

export default Divider
