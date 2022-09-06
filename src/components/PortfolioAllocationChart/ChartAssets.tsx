import { Box, Flex, Text } from "@chakra-ui/react"
import React from "react"

type Props = {
  text: string
  color: string
  pageName?: string | undefined
}

export function ChartAssets({ text, color, pageName }: Props) {
  return (
    <Box w="100%" alignItems="center">
      <Flex alignItems="center">
        {pageName != "Total Investment" ? (
          <Box>
            <Box
              w="16px"
              h="16px"
              backgroundColor={color}
              borderRadius="50%"
              marginEnd={3}
              transform="translateY(-1px)"
            />
          </Box>
        ) : (
          false
        )}

        <Text
          as="h2"
          w="100%"
          d="flex"
          flexDir={{ base: "column", md: "row" }}
          justifyContent="space-between"
          fontWeight={400}
          fontSize="14px"
          color="#C7C7C7"
        >
          {text}
        </Text>
      </Flex>
    </Box>
  )
}

export default ChartAssets
