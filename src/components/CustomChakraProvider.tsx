import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React from "react"

import baseTheme from "~/styles/theme"

export const CustomChakraProvider: React.FC = ({ children }) => {
  const { locale } = useRouter()
  const direction = locale === "ar" ? "rtl" : "ltr"
  const fontFamily =
    direction === "rtl" ? "Almarai, sans-serif" : "Gotham, sans-serif"
  const theme = extendTheme(baseTheme, {
    direction,
    fonts: { heading: fontFamily, body: fontFamily },
  })

  return (
    <ChakraProvider resetCSS theme={theme}>
      {children}
    </ChakraProvider>
  )
}

export default CustomChakraProvider
