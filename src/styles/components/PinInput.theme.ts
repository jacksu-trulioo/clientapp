import { StyleFunctionProps } from "@chakra-ui/theme-tools"

const PinInput = {
  defaultProps: {
    variant: "outline",
  },
  baseStyle: {},
  variants: {
    outline: (props: StyleFunctionProps) => {
      const { colorScheme: c } = props
      if (c === "primary") {
        const primaryColor = c + ".500"
        return {
          bg: "gray.800",
          _hover: {
            cursor: "pointer",
          },
          _placeholder: {
            color: primaryColor,
          },
          _focus: {
            borderColor: primaryColor,
            boxShadow: `0 0 0 1px ${primaryColor}`,
          },
          _disabled: {
            borderColor: "gray.700",
            color: "gray.700",
            opacity: "1",
          },
        }
      }
    },
  },
}

export default PinInput
