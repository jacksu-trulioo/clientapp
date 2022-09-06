const Accordion = {
  baseStyle: () => {
    return {
      container: {
        border: "none",
        marginBottom: 2,
      },
      button: {
        bg: "gray.800",
        padding: 4,
        border: "none",
        _hover: {
          bg: "gray.800",
        },
        _focus: {
          boxShadow: "none",
        },
      },
      icon: {
        // color: "primary.500",
        alignSelf: "flex-start",
      },
      panel: {
        bg: "gray.800",
      },
    }
  },
  variants: {
    opportunistic: {
      container: {
        border: "none",
        marginBottom: 2,
      },
      button: {
        bg: "gray.800",
        padding: 4,
        border: "none",
        _hover: {
          bg: "gray.800",
        },
        _focus: {
          boxShadow: "none",
        },
        _expanded: {
          borderBottomStartRadius: "0px",
        },
        borderStart: "8px solid #44344C",
        borderTopStartRadius: "8px",
        borderBottomStartRadius: "8px",
      },
      icon: {
        color: "primary.500",
        alignSelf: "flex-start",
      },
      panel: {
        bg: "gray.800",
        borderStart: "8px solid #44344C",
        borderBottomStartRadius: "8px",
      },
    },
    absoluteReturn: {
      container: {
        border: "none",
        marginBottom: 2,
      },
      button: {
        bg: "gray.800",
        padding: 4,
        border: "none",
        _hover: {
          bg: "gray.800",
        },
        _focus: {
          boxShadow: "none",
        },
        _expanded: {
          borderBottomStartRadius: "0px",
        },
        borderStart: "8px solid #69544B",
        borderTopStartRadius: "8px",
        borderBottomStartRadius: "8px",
      },
      icon: {
        color: "primary.500",
        alignSelf: "flex-start",
      },
      panel: {
        bg: "gray.800",
        borderStart: "8px solid #69544B",
        borderBottomStartRadius: "8px",
      },
    },
  },
}

export default Accordion
