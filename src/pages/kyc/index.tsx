import { Button } from "@chakra-ui/button"
import { Flex, Text } from "@chakra-ui/layout"
import { useBreakpointValue, useConst, useDisclosure } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useCallback, useState } from "react"
import useSWR from "swr"

import {
  HowToScanQrModal,
  KycIdVerificationLinkButton,
  KycIdVerificationModal,
  Link,
  ModalHeader,
  ModalLayout,
  QrCodeGeneratorModal,
  SideBySideLayout,
  Step,
  StepContent,
  StepDescription,
  StepLabel,
  Stepper,
} from "~/components"
import { kycIdVerificationModalSampleData } from "~/components/KycIdVerification/KycIdVerificationModal/mocks"
import StepButtons, { StepButton } from "~/components/Stepper/StepButtons"
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import { MyTfoClient } from "~/services/mytfo"
import {
  KycPersonalInformation,
  KycStatus,
  Preference,
} from "~/services/mytfo/types"
import formatMinutes from "~/utils/formatMinutes"
import { getDeviceType } from "~/utils/getDeviceType"
import {
  StartKycIdVerificationDesktopFlow,
  StartKycInvestmentExperience,
  StartKycPersonalInformationManualEntry,
  StartKycPersonalInformationNationalSignOn,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import useUpdateKycHybridFlow from "~/utils/useUpdateKycHybridFlow"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function BuildKycScreen() {
  const { t, lang } = useTranslation("kyc")
  const [showIntroModal, setShowIntroModal] = useState(false)
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const router = useRouter()
  const { updateKycHybridFlow } = useUpdateKycHybridFlow()
  const {
    isOpen: qrGeneratorModalState,
    onOpen: setQrGeneratorModalOpen,
    onClose: setQrGeneratorModalClose,
  } = useDisclosure()
  const {
    isOpen: howToScanQrModalState,
    onOpen: setHowToScanQrModalOpen,
    onClose: setHowToScanQrModalClose,
  } = useDisclosure()
  const baseUrl = typeof window !== undefined ? window.location.origin : ""
  const qrCodeUrl = useConst(
    baseUrl.concat("/kyc/id-verification?isHybridFlow=yes"),
  )

  const handleToggleIntroModalVisibility = useCallback(() => {
    setShowIntroModal((prevState) => !prevState)
  }, [])

  const handleQrGenerationModalVisibility = async () => {
    await updateKycHybridFlow(false)
    setQrGeneratorModalOpen()
  }

  const { user } = useUser()

  const { data: kycPersonalInformation, error } =
    useSWR<KycPersonalInformation>("/api/user/kyc/personal-information")

  const { data: preferredLanguage } = useSWR<Preference>("/api/user/preference")

  const { data: kycStatus, error: kycStatusError } = useSWR<KycStatus>(
    "/api/user/kyc/status",
  )

  const handleSaveAndExit = React.useCallback(async () => {
    if (preferredLanguage?.language === "AR") {
      router.push("/ar")
      router.reload()
    } else {
      router.push("/")
    }
  }, [preferredLanguage?.language, router])

  const isKSA = user?.profile?.nationality === "SA"
  const isAbsher = !!kycPersonalInformation?.isAbsher

  const getSteps = React.useCallback(
    (status: KycStatus) => [
      {
        title: t("chapterSelection.chapterOne.title"),
        description: {
          active: t("chapterSelection.chapterOne.description.active"),
          completed: t("chapterSelection.chapterOne.description.completed"),
          verified: t("chapterSelection.chapterOne.description.verified"),
        },
        time: 2,
        completed: status.personalInfoCompleted,
      },
      {
        title: t("chapterSelection.chapterTwo.title"),
        description: {
          active: t("chapterSelection.chapterTwo.description.active"),
          inactive: t("chapterSelection.chapterTwo.description.inactive"),
        },
        time: 3,
        completed: status.investmentExperienceCompleted,
      },
      {
        title: t("chapterSelection.chapterThree.title"),
        description: {
          active: t("chapterSelection.chapterThree.description.active"),
          inactive: t("chapterSelection.chapterThree.description.inactive"),
        },
        time: 3,
        completed: status.identityVerificationCompleted,
      },
    ],
    [t],
  )

  const getActiveStep = React.useCallback((status?: KycStatus) => {
    if (!status) return 1

    if (status.identityVerificationCompleted) {
      return 3
    } else if (status.investmentExperienceCompleted) {
      return 3
    } else if (status.personalInfoCompleted) {
      return 2
    }
    return 1
  }, [])

  const getProposalType = React.useCallback(() => {
    if (isKSA && isAbsher) return "#citizen-details"
    else if (isKSA) return "#sso"
    else return ""
  }, [isKSA, isAbsher])

  const getKycEditLink = React.useCallback(() => {
    if (isAbsher) return "#citizen-details"
    else return ""
  }, [isAbsher])

  if (!kycPersonalInformation || error || !kycStatus || kycStatusError) {
    return null
  }
  const isKycCompleted =
    kycStatus.callScheduled && kycStatus.identityVerificationCompleted
  const activeStep = getActiveStep(kycStatus)

  return (
    <>
      <ModalLayout
        {...(isMobileView && { h: "fit-content" })}
        title={t("chapterSelection.page.title")}
        description={t("chapterSelection.page.description")}
        header={
          <ModalHeader
            boxShadow="0 0 0 4px var(--chakra-colors-gray-900)"
            headerRight={
              <Button
                onClick={handleSaveAndExit}
                variant="ghost"
                colorScheme="primary"
              >
                {activeStep === 1
                  ? t("common:button.exit")
                  : t("common:button.saveAndExit")}
              </Button>
            }
          />
        }
        mb={isMobileView ? "28" : "0"}
        hideBgImage
        bgColor={{ base: "gray.900", md: "gray.800" }}
      >
        <SideBySideLayout
          title={t("chapterSelection.heading.title")}
          description={t("chapterSelection.heading.subtitle")}
        >
          {kycStatus && (
            <Stepper activeStep={activeStep} orientation="vertical">
              {getSteps(kycStatus).map((step, index) => {
                const buttonConfig = [
                  [
                    {
                      text: isKSA
                        ? t("chapterSelection.button.nationalSingleSignOn")
                        : t("chapterSelection.button.getStarted"),
                      href: `/kyc/personal-information${getProposalType()}`,
                      variant: "solid",
                      onClick: () => {
                        router.push(
                          `/kyc/personal-information${getProposalType()}`,
                        )
                        if (getProposalType() == "#sso") {
                          event(StartKycPersonalInformationNationalSignOn)
                        } else {
                          event(StartKycPersonalInformationManualEntry)
                        }
                      },
                      isDisabled: step.completed,
                    },
                  ] as StepButton[],
                  [
                    {
                      text: t("common:button.continue"),
                      href: "/kyc/investment-experience",
                      isDisabled: step.completed,
                      onClick: () => {
                        router.push("/kyc/investment-experience")
                        event(StartKycInvestmentExperience)
                      },
                    },
                  ] as StepButton[],
                  ["mobile", "tablet"].includes(getDeviceType())
                    ? [
                        {
                          text: t("common:button.continue"),
                          href: "/kyc/id-verification",
                          isDisabled: isKycCompleted,
                          onClick: () => {
                            router.push("/kyc/id-verification")
                            event(StartKycIdVerificationDesktopFlow)
                          },
                        },
                      ]
                    : ([
                        {
                          text: t("chapterSelection.button.verifyOnMobile"),
                          onClick: handleQrGenerationModalVisibility,
                          variant: "solid",
                          isDisabled: isKycCompleted,
                        },
                      ] as StepButton[]),
                ]

                if (isKSA) {
                  buttonConfig[0].push({
                    text: t("chapterSelection.button.enterManually"),
                    href: "/kyc/personal-information",
                    variant: "outline",
                    isDisabled: isAbsher,
                    onClick: () => {
                      router.push("/kyc/personal-information")
                      event(StartKycPersonalInformationManualEntry)
                    },
                  })
                }
                const isActive = index === activeStep - 1

                let description = step.description.active

                return (
                  <Step index={index} completed={step.completed} key={index}>
                    <StepContent>
                      <Flex flexDirection="column" w="full">
                        <StepLabel>{step.title}</StepLabel>
                        <StepDescription>{description}</StepDescription>
                        {((step?.title ===
                          t("chapterSelection.chapterOne.title") &&
                          step?.completed) ||
                          (step?.title ===
                            t("chapterSelection.chapterTwo.title") &&
                            step?.completed)) && (
                          <Link
                            href={
                              index === 0
                                ? `/kyc/personal-information${getKycEditLink()}`
                                : buttonConfig[index][0].href
                            }
                            color="primary"
                            mt="4"
                            fontSize={{ base: "xs", md: "sm" }}
                          >
                            {t("common:nav.links.edit")}
                          </Link>
                        )}

                        {isActive && (
                          <StepButtons buttonsConfig={buttonConfig[index]} />
                        )}
                      </Flex>

                      <Flex minW="32">
                        {!step.completed && (
                          <Text
                            color={isActive ? "white" : "gray.600"}
                            ps={{ base: 0, md: 8 }}
                          >
                            {formatMinutes(step?.time, lang)}
                          </Text>
                        )}
                      </Flex>
                    </StepContent>
                  </Step>
                )
              })}
            </Stepper>
          )}
        </SideBySideLayout>
      </ModalLayout>
      <KycIdVerificationModal
        title={kycIdVerificationModalSampleData.title}
        isOpen={showIntroModal}
        onClose={handleToggleIntroModalVisibility}
        content={
          <>
            <Text color="gray.400" textAlign="center" mb={6}>
              {kycIdVerificationModalSampleData.content[0]}
            </Text>
            <Text color="gray.400" textAlign="center">
              {kycIdVerificationModalSampleData.content[1]}
            </Text>
          </>
        }
        footerComponent={
          <>
            <Button
              colorScheme="primary"
              onClick={() => {
                event(StartKycIdVerificationDesktopFlow)
                handleToggleIntroModalVisibility()
                router.push("/kyc/id-verification")
              }}
              mb={6}
            >
              {kycIdVerificationModalSampleData.getStarted}
            </Button>
            <KycIdVerificationLinkButton
              size="md"
              onClick={() => {
                handleToggleIntroModalVisibility()
                handleQrGenerationModalVisibility()
              }}
              orText={kycIdVerificationModalSampleData.orText}
            >
              {kycIdVerificationModalSampleData.verifyOnMobile}
            </KycIdVerificationLinkButton>
          </>
        }
      />
      {qrGeneratorModalState && (
        <QrCodeGeneratorModal
          heading={t("qrCodeGenerationModal.heading")}
          title={t("qrCodeGenerationModal.title")}
          isOpen={qrGeneratorModalState}
          onClose={setQrGeneratorModalClose}
          qrCodeUrl={qrCodeUrl}
        >
          <Button
            onClick={() => {
              setQrGeneratorModalClose()
              setHowToScanQrModalOpen()
            }}
            colorScheme="primary"
            size="sm"
            variant="link"
            fontWeight={400}
          >
            {t("qrCodeGenerationModal.linkCTA")}
          </Button>
        </QrCodeGeneratorModal>
      )}
      <HowToScanQrModal
        isOpen={howToScanQrModalState}
        onClose={() => {
          setHowToScanQrModalClose()
          setQrGeneratorModalOpen()
        }}
      >
        <Button
          onClick={() => {
            setHowToScanQrModalClose()
            setQrGeneratorModalOpen()
          }}
          colorScheme="primary"
          size="md"
          width={160}
        >
          {t("howToScanQrModal.linkCTA")}
        </Button>
      </HowToScanQrModal>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { res, req } = ctx
    const { kycEnabled } = siteConfig?.featureFlags
    const client = new MyTfoClient(req, res)

    if (!kycEnabled) {
      res.writeHead(302, { Location: "/" })
      res.end()
    }

    const response = await client.user.getProposalsStatus()
    if (response.status != "Accepted") {
      return {
        notFound: true,
      }
    }

    if (ctx.locale === "ar") {
      res.writeHead(302, { Location: "/kyc" })
      res.end()
    }

    return {
      props: {},
    }
  } catch (error) {
    return {
      props: {},
    }
  }
}

export default withPageAuthRequired(BuildKycScreen)
