import { Box, HTMLChakraProps } from "@chakra-ui/react"
import React from "react"

export interface CardContentProps extends HTMLChakraProps<"div"> {}

export default function CardContent(
  props: React.PropsWithChildren<CardContentProps>,
) {
  const { children, ...rest } = props
  return (
    <Box p="6" {...rest}>
      {children}
    </Box>
  )
}
