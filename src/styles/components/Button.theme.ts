import { StyleFunctionProps } from "@chakra-ui/theme-tools"

const Button = {
  defaultProps: {},
  baseStyle: {
    lineHeight: 1,
    fontWeight: "bold",
    rounded: "2px",
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: "transparent",
    _focus: {
      boxShadow: "none",
    },
    _hover: {
      color: "primary.500",
    },
  },
  variants: {
    outline: (props: StyleFunctionProps) => {
      const { colorScheme: c } = props

      if (c === "primary") {
        const primaryColor = c + ".500"

        return {
          border: "1px solid",
          borderColor: primaryColor,
          color: primaryColor,
          _hover: {
            bg: "pineapple.800",
            color: `${c}.600`,
            _disabled: {
              borderColor: "gray.700",
              color: "gray.700",
            },
          },
          _focus: {
            bg: "pineapple.700",
            color: primaryColor,
          },
          _disabled: {
            borderColor: `${c}.800`,
            color: "gray.700",
            opacity: "1",
          },
        }
      }
    },
    solid: (props: StyleFunctionProps) => {
      const { colorScheme: c } = props

      if (c === "primary") {
        const primaryColor = c + ".500"

        return {
          bg: primaryColor,
          _hover: {
            bg: `${c}.600`,
            color: "gray.850",
            _disabled: {
              bg: `${c}.800`,
              color: "gray.900",
            },
          },
          _focus: {
            border: "2px solid",
            borderColor: `${c}.200`,
          },
          _disabled: {
            bg: `${c}.800`,
            color: "gray.900",
            opacity: "1",
          },
        }
      }

      if (c === "secondary") {
        const secondaryColor = c + ".500"

        return {
          bg: secondaryColor,
          color: "gray.900",
          _hover: {
            bg: c + ".400",
            color: "gray.900",
          },
        }
      }
    },
    ghost: (props: StyleFunctionProps) => {
      const { colorScheme: c } = props

      if (c === "primary") {
        const primaryColor = c + ".500"

        return {
          color: primaryColor,
          _hover: {
            bg: "gray.800",
            _disabled: {
              color: "gray.700",
            },
          },
          _focus: {
            bg: "pineapple.800",
          },
          _disabled: {
            color: "gray.700",
            opacity: "1",
          },
        }
      }
    },
    link: (props: StyleFunctionProps) => {
      const { colorScheme: c } = props

      if (c === "primary") {
        const primaryColor = c + ".500"

        return {
          color: primaryColor,
          textDecoration: "underline",
          _hover: {
            textDecoration: "none",
            _disabled: {
              color: "gray.700",
            },
          },
          _focus: {
            bg: "pineapple.800",
          },
          _disabled: {
            color: "gray.700",
            opacity: "1",
          },
        }
      }
    },
  },
  sizes: {
    xl: {
      fontSize: "2xl",
      h: 12,
      w: 12,
      px: 8,
    },
  },
}

export default Button
