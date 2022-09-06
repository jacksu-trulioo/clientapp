import { StyleFunctionProps } from "@chakra-ui/theme-tools"

const Checkbox = {
  defaultProps: {
    size: "lg",
    colorScheme: "primary",
  },
  baseStyle: (props: StyleFunctionProps) => {
    const { colorScheme: c } = props

    return {
      label: {
        color: "gray.400",
      },
      control: {
        fontSize: "sm",
        _checked: {
          borderColor: c + ".500",
          background: c + ".500",
        },
        _focus: {
          boxShadow: "none",
        },
      },
      icon: {
        color: "gray.800",
      },
    }
  },
  sizes: {
    lg: {
      label: {
        fontSize: "sm",
      },
    },
  },
  variants: {
    filled: {
      container: {
        bgColor: "gray.800",
        p: 5,
        borderRadius: "md",
      },
      control: {
        me: 4,
      },
    },
  },
}

export default Checkbox
