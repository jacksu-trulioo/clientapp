import { StyleFunctionProps } from "@chakra-ui/theme-tools"

const Tabs = {
  defaultProps: {},
  baseStyle: {
    tabpanel: {
      py: 12,
      px: 0,
    },
  },
  variants: {
    "soft-rounded": (props: StyleFunctionProps) => {
      const { colorScheme: c } = props

      return {
        tab: {
          fontWeight: "extrabold",
          _selected: {
            bgColor: c + ".500",
            color: "black",
          },
        },
      }
    },
  },
}

export default Tabs
