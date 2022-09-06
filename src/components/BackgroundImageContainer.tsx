import { Box, BoxProps } from "@chakra-ui/layout"
import React from "react"

export interface BackgroundImageContainerProps extends BoxProps {
  hideBgImage?: boolean
}

export const BackgroundImageContainer = (
  props: React.PropsWithChildren<BackgroundImageContainerProps>,
) => {
  const { children, hideBgImage, ...rest } = props

  const bgProps = {}

  if (!hideBgImage) {
    Object.assign(bgProps, {
      bgImage: "url('/images/background.png')",
      bgPosition: "top right",
      bgRepeat: "no-repeat",
      overflow: "auto",
    })
  } else {
    Object.assign(bgProps, {
      bgColor: "gray.800",
    })
  }

  return (
    <Box zIndex="base" {...bgProps} {...rest}>
      {children}
    </Box>
  )
}

export default React.memo(BackgroundImageContainer)
