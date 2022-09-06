import { Box, BoxProps, Flex, Text, useBreakpointValue } from "@chakra-ui/react"
import React from "react"

interface OptionCardProps extends BoxProps {
  icon?: JSX.Element
  title?: string
  description?: string
  onClick?: React.MouseEventHandler
  selected?: boolean
}
export function OptionCard(props: React.PropsWithChildren<OptionCardProps>) {
  const { icon: Icon, title, description, onClick, selected, ...rest } = props
  const isMobileView = useBreakpointValue({ base: true, md: false })
  return (
    <Box
      onClick={onClick}
      padding="1.5rem"
      borderRadius="5px"
      backgroundColor="gray.800"
      cursor="pointer"
      border="2px"
      borderColor={selected ? "primary.500" : "transparent"}
      me="1"
      {...rest}
    >
      <Flex
        direction={isMobileView ? "row" : "column"}
        alignItems={isMobileView ? "start" : "center"}
        justifyContent="space-between"
      >
        {Icon}
        <Flex direction="column" alignItems={isMobileView ? "start" : "center"}>
          <Text
            marginBottom={isMobileView ? 4 : 5}
            fontSize={isMobileView ? "md" : "14px"}
          >
            {title}
          </Text>
          <Text
            width="194px"
            fontSize="xs"
            textAlign={isMobileView ? "start" : "center"}
          >
            {description}
          </Text>
        </Flex>
      </Flex>
    </Box>
  )
}

export default OptionCard
