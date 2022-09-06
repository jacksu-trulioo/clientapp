import {
  Box,
  Container,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/layout"
import React from "react"

type Props = {
  title: string
  description: string
}

const StepLayout: React.FC<Props> = ({ title, description, children }) => {
  return (
    <Container maxW="full" mt={{ base: 8, lg: 0 }}>
      <Stack
        direction={{
          base: "column",
          xl: "row",
        }}
        spacing={10}
        minH="70vh"
        divider={<StackDivider borderColor="gray.700" />}
      >
        <Box w={{ base: "100%", xl: "30%" }}>
          <Heading as="h1" mb={4}>
            {title}
          </Heading>
          <Text as="h2">{description}</Text>
        </Box>
        <Box w={{ base: "100%", xl: "70%" }}>{children}</Box>
      </Stack>
    </Container>
  )
}

StepLayout.displayName = "StepLayout"

export default StepLayout
