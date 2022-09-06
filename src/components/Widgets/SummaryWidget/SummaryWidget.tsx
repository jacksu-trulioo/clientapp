import { Box, Flex, Image, Text } from "@chakra-ui/react"

type SummaryWidgetProps = {
  title: string
  value: string
}

const SummaryWidget = ({ title, value }: SummaryWidgetProps) => {
  return (
    <Box>
      <Flex justifyContent="space-between" px={4} py={6}>
        <Text color="gray.600" as="h2" fontSize="sm">
          {title}
        </Text>
        {value && (
          <Text marginStart={5} color="white" fontSize="2xl">
            {value}
          </Text>
        )}
      </Flex>
      <Image
        w="100%"
        objectFit="contain"
        src="/images/summary-widget-bg-image.svg"
        alt={title}
      />
    </Box>
  )
}

export default SummaryWidget
