import { Box, Button, Text } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Card, CardContent, Link } from "~/components"

export default function TrySimulatorCard() {
  const { t } = useTranslation("home")

  return (
    <Card
      maxW={{
        base: "full",
        md: "280px",
        lg: "300px",
      }}
      bgImage={{
        base: "/images/try-simulator-background-sm.svg",
        md: "/images/try-simulator-background.svg",
      }}
      flex="1"
      bgRepeat="no-repeat"
      bgSize="cover"
      py="3"
      className="reactour__simulate"
    >
      <CardContent
        display="flex"
        flexDirection="column"
        height="full"
        alignItems="flex-start"
        justifyContent="space-between"
        textAlign="start"
      >
        <Box>
          <Text color="white" fontSize={["lg", "xl"]} mb="3" fontWeight={400}>
            {t("cta.trySimulator.title")}
          </Text>

          <Text
            color="gray.400"
            fontSize="sm"
            maxW={{ base: "230px" }}
            mb={{ base: 8, md: 8, lg: 8 }}
            fontWeight={400}
          >
            {t("cta.trySimulator.description")}
          </Text>
        </Box>

        <Button
          as={Link}
          variant="link"
          fontSize="sm"
          colorScheme="primary"
          href="/portfolio/simulator"
          fontWeight={500}
        >
          {t("cta.trySimulator.button")}
        </Button>
      </CardContent>
    </Card>
  )
}
