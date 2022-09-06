import type { SystemStyleObject } from "@chakra-ui/styled-system"
import { mode, StyleFunctionProps } from "@chakra-ui/theme-tools"

const numericStyles: SystemStyleObject = {
  "&[data-is-numeric=true]": {
    textAlign: "end",
  },
}

const Table = {
  baseStyle: () => {
    return {
      thead: {
        th: {
          color: "gray.500",
          fontSize: "xs",
          py: 4,
        },
      },
      tfoot: {
        th: {
          color: "white",
          fontSize: "xs",
          py: 4,
        },
        tr: {
          borderBottom: "1px",
          borderColor: "gray.700",
        },
      },
      tbody: {
        tr: {
          color: "white",
          td: {
            py: 4,
          },
        },
      },
    }
  },
  variants: {
    striped: (props: StyleFunctionProps) => {
      const { colorScheme: c, size } = props

      return {
        th: {
          color: mode("gray.600", "white")(props),
          borderBottom: "1px",
          borderColor: mode(`${c}.100`, `${c}.900`)(props),
          ...numericStyles,
        },
        td: {
          borderBottom: "2px",
          borderColor: mode(`${c}.100`, `${c}.900`)(props),
          p: size === "sm" ? "2" : "4",
          ...numericStyles,
        },
        caption: {
          color: mode("gray.600", "white")(props),
        },
        tr: {
          fontSize: "sm",
        },
        thead: {
          th: {
            color: "white",
            fontSize: size === "sm" ? "xs" : "sm",
            p: size === "sm" ? "2" : "4",
            fontWeight: 400,
          },
        },
        tbody: {
          tr: {
            "&:nth-of-type(odd)": {
              "th, td": {
                borderBottomWidth: "2px",
                borderColor: mode(`${c}.100`, `${c}.900`)(props),
                background: mode(`${c}.100`, `${c}.500`)(props),
              },
              td: {
                background: mode(`${c}.100`, `${c}.800`)(props),
              },
            },
            background: mode(`${c}.100`, `${c}.850`)(props),
          },
        },
        tfoot: {
          tr: {
            "&:last-of-type": {
              th: { borderBottomWidth: 0 },
            },
          },
        },
      }
    },
  },
}
export default Table
