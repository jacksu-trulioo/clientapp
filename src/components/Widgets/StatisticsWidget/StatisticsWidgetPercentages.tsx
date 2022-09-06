import { Box, Flex, Progress, Text } from "@chakra-ui/react"
import React from "react"

type StatisticsWidgetPercentage = {
  name: string
  value: number
  color: string
}

type StatisticsWidgetPercentagesProps = {
  items: StatisticsWidgetPercentage[]
  noDataText?: string
}

const StatisticsWidgetPercentages = ({
  items = [],
  noDataText = "No Data",
}: StatisticsWidgetPercentagesProps) => {
  return (
    <Box mt={4}>
      {items && !!items.length ? (
        items.map((item, index) => {
          return (
            <Flex
              justifyContent="space-between"
              alignItems="baseline"
              key={index}
              w="100%"
              mb={index < items.length - 1 ? 4 : 0}
            >
              <Progress
                w={8}
                borderRadius="14px"
                h={2}
                size="xs"
                bgColor="gray.700"
                value={item.value}
                sx={{
                  "& > div": {
                    backgroundColor: item.color,
                  },
                }}
              />
              <Flex alignItems="center" w="70%" justifyContent="space-between">
                <Text as="span" fontSize="xs" color="gray.500" marginEnd={3}>
                  {`${item.value}%`}
                </Text>
                <Text as="span" fontSize="xs" color="white">
                  {item.name}
                </Text>
              </Flex>
            </Flex>
          )
        })
      ) : (
        <Text fontSize="10px" textAlign="center" color="gray.500">
          {noDataText}
        </Text>
      )}
    </Box>
  )
}

export default StatisticsWidgetPercentages
