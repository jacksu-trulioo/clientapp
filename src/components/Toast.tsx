import { useBreakpointValue } from "@chakra-ui/media-query"
import { Box, BoxProps, CloseButton, Flex, Text } from "@chakra-ui/react"
import React from "react"

import InfoIcon from "./Icon/InfoIcon"

export interface ToastProps extends BoxProps {
  title?: string
  description?: string
  onClick?: React.MouseEventHandler
  showCloseButton?: boolean
}

export default function Toast(props: ToastProps) {
  const {
    title,
    description,
    onClick = () => {},
    showCloseButton = true,
  } = props
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = useBreakpointValue({ base: false, lg: true })
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lg: false,
  })

  return (
    <Box
      rounded="sm"
      overflow="hidden"
      bg="gray.850"
      padding="4"
      borderLeftWidth="thick"
      borderLeftColor="red.500"
      width="full"
    >
      <Flex alignItems="center" gridGap="1.5">
        <Flex textColor="red.500">
          <InfoIcon h={6} w={6} />
        </Flex>
        <Flex
          fontSize="md"
          flex="1"
          flexFlow={isMobileView || isTabletView ? "column" : "row"}
        >
          {title && <Text fontWeight="bold">{`${title}`}</Text>}

          {description && (
            <Text {...(isDesktopView && { ms: "2" })}>{`${description}`}</Text>
          )}
        </Flex>
        {showCloseButton && <CloseButton onClick={onClick} />}
      </Flex>
    </Box>
  )
}
