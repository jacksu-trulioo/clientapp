import { StyleFunctionProps } from "@chakra-ui/theme-tools"

const Progress = {
  defaultProps: {
    colorScheme: "primary",
  },
  baseStyle: (props: StyleFunctionProps) => {
    const { colorScheme: c } = props

    return {
      filledTrack: {
        bgColor: c + ".500",
      },
      track: {
        bgColor: "transparent",
      },
    }
  },
}

export default Progress
