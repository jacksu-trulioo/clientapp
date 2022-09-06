import { StyleFunctionProps } from "@chakra-ui/theme-tools"

const Slider = {
  defaultProps: {
    colorScheme: "contrast",
  },
  baseStyle: (props: StyleFunctionProps) => {
    const { colorScheme: c } = props

    return {
      track: {
        rounded: "full",
      },
      filledTrack: {
        background: c + ".500",
      },
    }
  },
  sizes: {
    md: {
      thumb: {
        boxSize: 4,
      },
    },
  },
}

export default Slider
