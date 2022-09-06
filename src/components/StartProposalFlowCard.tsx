import { Box, Button, Link, Text, VStack } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Card, CardContent } from "~/components"
import { GenerateProposalEventFromDashboard } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

export default function StartProposalFlowCard() {
  const { t, lang } = useTranslation("home")
  const proposalRoute = lang === "ar" ? `/${lang}/proposal` : "/proposal"

  return (
    <Card bgColor="gunmetal.500" w="full">
      <CardContent bgColor="gunmetal">
        <VStack
          w="full"
          h="full"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box mb={4} textAlign="center">
            <Text fontSize="xl">{t("cta.buildProposal.title")}</Text>
            <Text fontSize="xl">{t("cta.buildProposal.description")}</Text>
          </Box>
          <Button
            as={Link}
            href={proposalRoute}
            colorScheme="primary"
            fontSize="sm"
            size="sm"
            onClick={() => {
              event(GenerateProposalEventFromDashboard)
            }}
          >
            {t("cta.buildProposal.button")}
          </Button>
        </VStack>
      </CardContent>
    </Card>
  )
}
