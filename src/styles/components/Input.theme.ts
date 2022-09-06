const Input = {
  defaultProps: {
    variant: "outline",
  },
  baseStyle: {},
  variants: {
    outline: {
      field: {
        borderRadius: "sm",
        bgColor: "gray.800",
        _focus: {
          borderColor: "primary.500",
          boxShadow: "none",
        },
      },
    },
    flushed: {
      field: {
        borderBottomWidth: 2,
        _focus: {
          borderColor: "primary.500",
          boxShadow: "none",
        },
        _invalid: {
          boxShadow: "none",
        },
      },
    },
  },
}

export default Input
