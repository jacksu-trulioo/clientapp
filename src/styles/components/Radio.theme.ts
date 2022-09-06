import { StyleFunctionProps } from "@chakra-ui/theme-tools"

const Radio = {
  defaultProps: {
    size: "lg",
    colorScheme: "primary",
  },
  sizes: {
    lg: {
      label: {
        fontSize: "sm",
      },
    },
  },
  baseStyle: (props: StyleFunctionProps) => {
    const { colorScheme: c } = props

    if (c === "primary") {
      const primaryColor = c + ".500"

      return {
        container: {
          cursor: "pointer",
          _hover: {
            bg: props?.isDisabled ? "gray.850" : "pineapple.800",
          },
          bg: props?.isDisabled ? "gray.850" : "gray.800",
        },
        control: {
          border: "2px solid",
          borderColor: primaryColor,
          cursor: "pointer",
          _focus: {
            boxShadow: "none",
            background: "gray.800",
          },
          _checked: {
            borderColor: primaryColor,
            background: "gray.800",
            color: primaryColor,
            _hover: {
              background: "gray.800",
              borderColor: primaryColor,
            },
            _disabled: {
              borderColor: "gray.700",
              background: "gray.850",
              color: "gray.700",
            },
          },
          _disabled: {
            borderColor: "gray.700",
            background: "gray.850",
            color: "gray.700",
          },
        },
      }
    }
  },
  variants: {
    filled: {
      container: {
        p: 5,
        borderRadius: "md",
      },
      control: {
        me: 4,
      },
    },
  },
}

export default Radio
