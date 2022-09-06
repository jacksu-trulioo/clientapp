import {
  Box,
  Flex,
  Grid,
  GridItem,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react"

export default function MarketIndicators() {
  return (
    <Box p="20px 0 20px">
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lgp: "repeat(2, 1fr)",
        }}
        gap={10}
      >
        <GridItem>
          <Box minH="177px" bg="gray.800" p="30px 30px 25px">
            <Flex justifyContent="space-between">
              <Text>Negative</Text>
              <Text>Positive</Text>
            </Flex>
            <Box p="30px 0"></Box>
          </Box>
        </GridItem>
        <GridItem>
          <Flex h="100%" align="center">
            <UnorderedList>
              <ListItem fontSize="18px" fontWeight="400" lineHeight="1.5rem">
                The macro score increased in the month of December 2021 due to
                the tightening in the credit spreads.
              </ListItem>
            </UnorderedList>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  )
}
