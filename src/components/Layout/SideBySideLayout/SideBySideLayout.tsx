import {
  Box,
  Container,
  Flex,
  FlexProps,
  Grid,
  Heading,
  Text,
} from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/react"
import React, { ReactNode, useMemo } from "react"

export type SideBySideLayoutProps = Pick<FlexProps, "children"> & {
  title: string
  subtitle?: string
  description?: string | string[]
  extraContent?: ReactNode
  hasSeparator?: boolean
}

const SideBySideLayout = ({
  title,
  subtitle,
  description,
  children,
  extraContent,
  hasSeparator = false,
}: SideBySideLayoutProps) => {
  const headingFont = useBreakpointValue({ base: "lg", md: "lg", lg: "xl" })

  const descriptionContent = useMemo(() => {
    if (!description || !description?.length) return null

    if (Array.isArray(description) && !!description?.length) {
      return description.map((desc, index) => {
        return (
          <Text
            mb={index < description.length - 1 ? 5 : 0}
            key={index}
            fontSize="sm"
            color="gray.400"
          >
            {desc}
          </Text>
        )
      })
    }

    return (
      <Text fontSize="sm" color="gray.400">
        {description}
      </Text>
    )
  }, [description])

  return (
    <Container
      maxW="5xl"
      px={0}
      py={{ base: 8, md: 8 }}
      mb={{ base: 8, md: 0 }}
    >
      <Grid
        gridTemplateColumns={{ base: "1fr", md: "1fr 2fr" }}
        gridGap={{ base: "12", md: "12", lg: "32" }}
      >
        <Flex direction="column" maxW={{ base: "sm", md: "xs" }}>
          <Heading fontWeight={400} mb={subtitle ? 5 : 6} size={headingFont}>
            {title}
          </Heading>

          {subtitle && (
            <Text mb={description ? 9 : 0} fontSize="xl" color="gray.400">
              {subtitle}
            </Text>
          )}

          {descriptionContent}

          {extraContent}
        </Flex>
        <Flex>
          {hasSeparator && (
            <Box
              d={["none", "none", "inline-flex"]}
              mr={16}
              backgroundColor="gray.700"
              w="1px"
              h="100%"
            />
          )}
          {children}
        </Flex>
      </Grid>
    </Container>
  )
}

export default SideBySideLayout
