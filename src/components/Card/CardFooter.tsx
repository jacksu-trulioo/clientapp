import { Box, Flex, HTMLChakraProps } from "@chakra-ui/react"
import React from "react"

export interface CardFooterProps extends HTMLChakraProps<"div"> {}

export default function CardFooter(
  props: React.PropsWithChildren<CardFooterProps>,
) {
  const { children, ...rest } = props

  return (
    <Box p="6" {...rest}>
      <Flex justifyContent="space-between" alignItems="center">
        {children}
      </Flex>
    </Box>
  )
}
