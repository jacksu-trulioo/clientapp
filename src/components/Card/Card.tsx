import { Box, BoxProps } from "@chakra-ui/react"
import React from "react"

export interface CardProps extends BoxProps {}

export default function Card(props: React.PropsWithChildren<CardProps>) {
  const { children, ...rest } = props

  return (
    <Box
      pos="relative"
      rounded="md"
      overflow="hidden"
      bg="gray.850"
      boxShadow="0px 0px 24px rgba(0, 0, 0, 0.75)"
      {...rest}
    >
      {children}
    </Box>
  )
}
