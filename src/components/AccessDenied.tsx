import { Button } from "@chakra-ui/button"
import { Box, Heading, Text, VStack } from "@chakra-ui/layout"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import { Header } from "~/components"
import { RelationshipManager } from "~/services/mytfo/types"

const AccessDenied = () => {
  const { t } = useTranslation("common")

  const { data: rmData, error: rmError } = useSWR<RelationshipManager>(
    `/api/user/summary/relationship-manager?id=${router.query.contactId}`,
  )

  return (
    <>
      <Header />

      <Box as="main">
        <VStack
          justify="center"
          spacing="4"
          as="section"
          py={["20", null, "40"]}
          textAlign="center"
        >
          <Heading as="h1" fontSize="3xl" fontWeight="bold">
            {t("accessRestricted.title")}
          </Heading>
          <Text fontSize="lg" maxW="sm">
            {!rmError && rmData && rmData.manager
              ? `${t("accessRestricted.assignedDescription")} ${
                  rmData.manager.firstName
                } ${rmData.manager.lastName}`
              : t("accessRestricted.description")}
          </Text>
          <Button
            variant="link"
            colorScheme="primary"
            onClick={() => router.push("/")}
          >
            {t("accessRestricted.backToDashboard")}
          </Button>
        </VStack>
      </Box>
    </>
  )
}

export default AccessDenied
