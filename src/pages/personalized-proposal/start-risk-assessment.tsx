import { Container, Flex, Heading, Text, VStack } from "@chakra-ui/layout"
import { Button, Divider, Stack, useBreakpointValue } from "@chakra-ui/react"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Link, ModalHeader, ModalLayout } from "~/components"

const StartRiskAssessment = () => {
  const { t } = useTranslation("personalizedProposal")

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView
  const [isParamAvailable, setIsParamAvailable] = React.useState(false)

  React.useEffect(() => {
    if (router.query?.name === "profile") {
      setIsParamAvailable(true)
    }
  }, [])

  const ChapterHeaderStepper = () => (
    <Text color="gray.400" fontSize="sm">
      {t("startRiskAssessment.headerLeft")}
    </Text>
  )

  return (
    <ModalLayout
      title={t("startRiskAssessment.title")}
      description={t("startRiskAssessment.description")}
      header={
        <ModalHeader
          boxShadow="0 0 0 4px var(--chakra-colors-gray-900)"
          {...(isDesktopView && {
            headerLeft: (
              <Stack isInline ps="6" spacing="6" alignItems="center">
                <Divider orientation="vertical" bgColor="white" height="28px" />
                <ChapterHeaderStepper />
              </Stack>
            ),
          })}
          headerRight={
            <Link
              href={
                !isParamAvailable
                  ? "/personalized-proposal?name=risk-assessment"
                  : "/profile"
              }
              color="primary.500"
              mx="3"
            >
              {!isParamAvailable
                ? t("startRiskAssessment.headerRight")
                : t(`common:button.backToProfile`)}
            </Link>
          }
        />
      }
    >
      <Flex direction={{ base: "column", md: "row" }} py={{ base: 2, md: 16 }}>
        <Container flex="1" maxW={{ base: "full", md: "280px" }}>
          <VStack alignItems="start">
            <Text fontSize="sm" color="gray.400">
              {t("startRiskAssessment.time")}
            </Text>
            <Heading
              mb={{ base: 4, md: 6 }}
              fontSize={{ base: "2xl", md: "3xl" }}
            >
              {t("startRiskAssessment.heading")}
            </Heading>
          </VStack>
        </Container>

        <Container flex="1" pt={{ base: 0, md: 4 }}>
          <VStack alignItems="start" spacing="8">
            <Text
              fontSize="sm"
              color="gray.500"
              sx={{
                whiteSpace: "pre-line",
              }}
            >
              {t("startRiskAssessment.subheading")}
            </Text>
            <Button
              as={Link}
              colorScheme="primary"
              href={"/personalized-proposal/retake-risk-assessment#1"}
              onClick={() => {
                if (isParamAvailable)
                  sessionStorage.setItem("initiator", "profile")
              }}
            >
              {t("startRiskAssessment.getStarted")}
            </Button>
          </VStack>
        </Container>
      </Flex>
    </ModalLayout>
  )
}

export default StartRiskAssessment
