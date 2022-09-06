import { Box, BoxProps, Flex, IconButton, Text } from "@chakra-ui/react"

import MenuIcon from "~/components/Icon/MenuIcon"

type StatisticsWidgetProps = Pick<BoxProps, "children"> & {
  title: string
}

const StatisticsWidget = ({ title, children }: StatisticsWidgetProps) => {
  return (
    <Box
      backgroundColor="gray.800"
      pt={1}
      paddingEnd={1}
      pb={5}
      paddingStart={5}
      h="100%"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text color="gray.600" as="h2" fontSize="sm">
          {title}
        </Text>
        <IconButton
          variant="ghost"
          transform="rotate(90deg)"
          aria-label="menu"
          color="gray.600"
          icon={<MenuIcon w={4} h={4} />}
        />
      </Flex>
      <Box marginEnd={4}>{children}</Box>
    </Box>
  )
}

export default StatisticsWidget
