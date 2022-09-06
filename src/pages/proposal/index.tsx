import { Button } from "@chakra-ui/button"
import { Container, Flex, Heading, Stack, Text } from "@chakra-ui/layout"
import { Center, Divider, useBreakpointValue } from "@chakra-ui/react"
import ky from "ky"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import {
  Link,
  ModalHeader,
  ModalLayout,
  Step,
  StepButton,
  StepContent,
  StepDescription,
  StepLabel,
  Stepper,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import {
  InvestorRiskAssessment,
  PreProposalInitialActionType,
  Profile,
  QualificationStatus,
  UserQualificationStatus,
  UserStatuses,
} from "~/services/mytfo/types"
import formatMinutes from "~/utils/formatMinutes"
import {
  startInvestmentGoals,
  startInvestorProfile,
  startRiskAssessment,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function BuildPersonalisedProposalScreen() {
  const { t, lang } = useTranslation("proposal")
  const { data, error } = useSWR<QualificationStatus>(
    "/api/user/qualifications/status",
  )
  const { user } = useUser()
  const isMobileView = useBreakpointValue({ base: true, md: false, lg: false })
  const isTabletView = useBreakpointValue({ base: false, md: true, lg: false })
  const isDesktopView = useBreakpointValue({
    base: false,
    md: false,
    lg: true,
  })

  const { data: statusData } = useSWR<UserStatuses>("/api/user/status")
  const { data: profileData, error: profileError } =
    useSWR<Profile>("/api/user/profile")

  const { data: userRiskQuestions, error: userRiskError } =
    useSWR<InvestorRiskAssessment>("/api/user/risk-assessment")

  const getSteps = React.useCallback(
    (status: QualificationStatus) => [
      {
        title: t("chapterSelection.chapterOne.title"),
        description: {
          active: t("chapterSelection.chapterOne.description.active"),
          completed: t("chapterSelection.chapterOne.description.completed"),
          verified: t("chapterSelection.chapterOne.description.verified"),
        },
        time: 2,
        completed: status.investorProfile,
      },
      {
        title: t("chapterSelection.chapterTwo.title"),
        description: {
          active: t("chapterSelection.chapterTwo.description.active"),
          inactive: t("chapterSelection.chapterTwo.description.inactive"),
        },
        time: 3,
        completed: status.investmentGoals,
      },
      {
        title: t("chapterSelection.chapterThree.title"),
        description: {
          active: t("chapterSelection.chapterThree.description.active"),
          inactive: t("chapterSelection.chapterThree.description.inactive"),
        },
        time: 3,
        completed: status.riskAssessment,
      },
    ],
    [t],
  )

  const getActiveStep = React.useCallback((status?: QualificationStatus) => {
    if (!status) return 1

    if (status.investmentGoals) {
      return 3
    } else if (status.investorProfile) {
      return 2
    }

    return 1
  }, [])

  const activeStep = getActiveStep(data)

  const startInvesting = async (redirectUrl: string, index: number) => {
    if (index === 0 && user?.profile?.preProposalInitialAction === null) {
      try {
        await ky
          .put("/api/user/profile", {
            json: {
              ...user?.profile,
              preProposalInitialAction:
                PreProposalInitialActionType.StartInvesting,
            },
          })
          .json<Profile>()
      } catch (e) {
        // Note : As there is no error scenario decided, we can't add the toast message here
        console.log(e)
      }
    }

    router.push(redirectUrl)
  }

  if (!profileData && !profileError) {
    return null
  }

  return (
    <>
      <ModalLayout
        title={t("chapterSelection.page.title")}
        description={t("chapterSelection.page.description")}
        header={
          <ModalHeader
            boxShadow="0 0 0 4px var(--chakra-colors-gray-900)"
            headerRight={
              <Button as={Link} href="/" variant="ghost" colorScheme="primary">
                {activeStep === 1
                  ? t("common:button.exit")
                  : t("common:button.saveAndExit")}
              </Button>
            }
          />
        }
        hideBgImage
        bgColor="gray.900"
      >
        <Container
          maxW="5xl"
          py={{ base: 8, md: 24 }}
          mb={{ base: 8, md: 0 }}
          pb={{ base: "28", md: "0" }}
        >
          <Stack flexDirection={{ base: "column", md: "row" }}>
            <Flex
              {...(isTabletView && { flex: 1 })}
              direction="column"
              maxW={{ base: "sm", md: "xs" }}
              pe="12"
            >
              <Heading mb="6">{t("chapterSelection.heading.title")}</Heading>

              <Text
                fontSize={{ base: "xs", md: "sm" }}
                display={{ base: "none", md: "block" }}
                color="gray.400"
                ms="2px"
              >
                {t("chapterSelection.heading.subtitle")}
              </Text>
            </Flex>

            {!isMobileView && (
              <Center
                mb={{ base: 10, md: 0 }}
                mt={{ base: 10, md: 0 }}
                px={{ base: 0, md: "64px" }}
              >
                <Divider height="50vh" orientation="vertical" />
              </Center>
            )}

            <Flex {...(isTabletView && { flex: 2 })}>
              {data && !error && (
                <Stepper activeStep={activeStep} orientation="vertical">
                  {getSteps(data).map((step, index) => {
                    const stepButtons = [
                      {
                        text: profileData?.nationality
                          ? t("common:button.continue")
                          : t("chapterSelection.button.getStarted"),
                        href: "/proposal/investor-profile",
                      },
                      {
                        text: t("common:button.continue"),
                        href: "/proposal/investment-goals#1",
                      },
                      {
                        text: t("common:button.continue"),
                        href: step.completed
                          ? "/proposal/risk-assessment/result"
                          : !userRiskError && userRiskQuestions?.q9 !== null
                          ? "/proposal/risk-assessment/result"
                          : "/proposal/risk-assessment#1",
                      },
                    ]

                    const isActive = index === activeStep - 1

                    let description = step.description.inactive

                    if (isActive) {
                      description = step.description.active
                    } else if (step.completed) {
                      description =
                        statusData?.status === UserQualificationStatus.Verified
                          ? step.description.verified
                          : step.description.completed
                    }

                    return (
                      <Step
                        index={index}
                        completed={step.completed}
                        key={index}
                      >
                        <StepContent>
                          <Flex flexDirection="column" w="full">
                            <StepLabel>{step.title}</StepLabel>
                            <StepDescription>{description}</StepDescription>
                            {step?.title ===
                              t("chapterSelection.chapterTwo.title") &&
                              step?.completed && (
                                <Link
                                  href="/proposal/investment-goals#1"
                                  color="primary"
                                  fontSize={{ base: "xs", md: "sm" }}
                                  onClick={() => event(startInvestmentGoals)}
                                >
                                  {t("common:nav.links.edit")}
                                </Link>
                              )}

                            {isActive && (
                              <StepButton
                                {...((isTabletView || isDesktopView) && {
                                  mt: "6",
                                  mb: "2",
                                })}
                                onClick={() => {
                                  if (index === 0) event(startInvestorProfile)

                                  if (index === 1) event(startInvestmentGoals)

                                  if (index === 2) event(startRiskAssessment)

                                  startInvesting(stepButtons[index].href, index)
                                }}
                              >
                                {stepButtons[index].text}
                              </StepButton>
                            )}
                          </Flex>

                          <Flex minW="32">
                            {!step.completed ? (
                              <Text
                                color={isActive ? "white" : "gray.600"}
                                ps={{ base: 0, md: 8 }}
                              >
                                {formatMinutes(step?.time, lang)}
                              </Text>
                            ) : (
                              !isMobileView && (
                                <Text color="gray.400" fontSize="sm" mt="1">
                                  {t("chapterSelection.label.completed")}
                                </Text>
                              )
                            )}
                          </Flex>
                        </StepContent>
                      </Step>
                    )
                  })}
                </Stepper>
              )}
            </Flex>
          </Stack>
        </Container>
      </ModalLayout>
    </>
  )
}

export default withPageAuthRequired(BuildPersonalisedProposalScreen)
