import { Grid, GridItem, Text } from "@chakra-ui/react"

type StatisticsWidgetValue = {
  name: string
  value: number
}

type StatisticsWidgetValuesProps = {
  items: StatisticsWidgetValue[]
}

const StatisticsWidgetValues = ({
  items = [],
}: StatisticsWidgetValuesProps) => {
  if (!items || !items?.length) return null

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      {items.map((item, index) => {
        return (
          <GridItem
            d="flex"
            justifyContent="space-between"
            alignItems="center"
            key={index}
            w="100%"
          >
            <Text as="span" fontSize="10px" color="gray.500" marginEnd={1}>
              {item.name}
            </Text>
            <Text as="span" fontSize="10px" color="white">
              {`${item.value}%`}
            </Text>
          </GridItem>
        )
      })}
    </Grid>
  )
}

export default StatisticsWidgetValues
