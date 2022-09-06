import { Box, Divider, Stack, VStack } from "@chakra-ui/layout"
import {
  Button,
  chakra,
  Circle,
  Flex,
  Image,
  Progress,
  StyleProps,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import ky from "ky"
import { GetServerSideProps } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import useSWR from "swr"

import {
  ChatIcon,
  GetSupportPopUp,
  KycIdVerificationLinkButton,
  KycIdVerificationMobileView,
  KycIdVerificationModal,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  QuestionIcon,
  SaveAndExitButton,
  SideBySideLayout,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Toast,
} from "~/components"
import KycScheduleVideoCall from "~/components/KycIdVerification/ScheduleVideoCall"
import siteConfig from "~/config"
import useHybridFlowCleanup from "~/hooks/useHybridFlowCleanup"
import { useUser } from "~/hooks/useUser"
import { MyTfoClient } from "~/services/mytfo"
import {
  KycDocumentTypes,
  KycSubmitDocumentRequest,
  Preference,
  RelationshipManager,
} from "~/services/mytfo/types"
import { createWizard } from "~/utils/createWizard"
import { SwitchingKycDesktopFlowToHybridFlow } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import {
  DEFAULT_TIMEOUT,
  handleSdkError,
  ID_VERIFICATION_STEPS,
  START_MESSAGE,
  USE_CAPTURE_BUTTON,
} from "~/utils/idVerification"
import { triggerEventWithStep } from "~/utils/kycGoogleEventsHelper"
import useUpdateKycHybridFlow from "~/utils/useUpdateKycHybridFlow"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

const PdfViewer = dynamic(() => import("~/components/PdfViewer"), {
  ssr: false,
})

const KycIdVerificationUploadBox = dynamic(
  () =>
    import(
      "~/components/KycIdVerification/KycIdVerificationUploadBox/KycIdVerificationUploadBox"
    ),
  { ssr: false },
)

const getTrulioo = () => {
  if (typeof window !== "undefined") {
    return require("@trulioo/globalgateway-image-capture-sdk")
  }

  return {}
}
const GlobalGatewayCapture = getTrulioo()

export const { withWizard: withMyWizard, useWizard: useMyWizard } =
  createWizard({
    numberOfSteps: 6,
  })

function IdVerification() {
  const { t } = useTranslation("kyc")
  const { step, next, isFirst, isLast, numberOfSteps, setStep } = useMyWizard()

  const [error, setError] = useState("")
  const [showErr, setShowErr] = React.useState(false)
  const [docPreview, setDocPreview] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    onOpen: onOpenSupport,
    onClose: onCloseSupport,
    isOpen: isOpenSupport,
  } = useDisclosure()
  const [showLoader, setShowLoader] = useState(false)
  const { updateKycHybridFlow } = useUpdateKycHybridFlow()
  const scheduleBtnRef = React.createRef<HTMLButtonElement>()

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView
  const [mobileViewStep, setMobileViewStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isHybridFlowFlag, setIsHybridFlowFlag] = useState(false)
  const showMobileButton = isDesktopView || (isMobileView && mobileViewStep > 0)

  const { push, reload, query } = useRouter()

  const stepData = useMemo(() => {
    return ID_VERIFICATION_STEPS[step]
  }, [step])

  const { data: preferredLanguage } = useSWR<Preference>("/api/user/preference")

  const handleSaveAndExit = React.useCallback(async () => {
    const basePath = preferredLanguage?.language === "AR" ? "/ar" : "/"
    const redirectPath = isHybridFlowFlag ? "/kyc/session-stopped" : basePath
    try {
      await ky.delete("/api/user/kyc/document-verification/reset")
    } catch (e) {}
    await push(redirectPath)
    if (preferredLanguage?.language === "AR" && !isHybridFlowFlag) {
      reload()
    }
  }, [isHybridFlowFlag, preferredLanguage?.language, push, reload])

  const handleImgSuccess = useCallback(
    async (res: string) => {
      try {
        if (!isLoading) {
          setIsLoading(true)
        }
        const base64Image = res?.split(
          /^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i,
        )?.[4]

        await ky
          .post("/api/user/kyc/document-verification/upload", {
            timeout: 30000,
            json: {
              type: stepData.type,
              base64Image: base64Image,
            } as KycSubmitDocumentRequest,
          })
          .json()
        setDocPreview(res)
        setError("")
        setShowErr(false)
      } catch (e) {
        setShowErr(true)
        setDocPreview(null)
        setError(t("idVerification.errors.apiError.title"))
      } finally {
        setIsLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stepData.type],
  )
  const { user } = useUser()
  const isKSA = user?.profile.nationality === "SA"
  const isQrRedirected = isMobileView && query.isHybridFlow === "yes"
  useSWR(
    isQrRedirected && isHybridFlowFlag ? "/api/user/kyc/hybrid-flow" : null,
    {
      refreshInterval: 3000,
      onSuccess: (data) => {
        if (!data.isHybridFlow) {
          push("/kyc/session-stopped")
        }
      },
    },
  )

  const { data: rmData, error: rmError } = useSWR<RelationshipManager>(
    "/api/user/relationship-manager",
  )

  const isRmLoading = !rmData && !rmError
  const isRmAssigned = !isRmLoading && rmData?.assigned

  useEffect(() => {
    if (isQrRedirected) {
      requestUpdatedKycHybridFlowData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQrRedirected])

  const requestUpdatedKycHybridFlowData = async () => {
    const data = await updateKycHybridFlow(true)
    setIsHybridFlowFlag(data?.isHybridFlow as boolean)
  }

  useHybridFlowCleanup()

  const handleError = useCallback(
    (errArray: { code: string | number; type: string }[]) => {
      setError(handleSdkError(errArray, t))
      setDocPreview(null)
      setIsLoading(false)
    },
    [t],
  )

  const handleNext = useCallback(() => {
    setDocPreview(null)
    setIsLoading(false)
    triggerEventWithStep(step, "kycIdVerification")
    if (!isKSA && step === 0) {
      setStep(2)
    } else {
      next()
    }
  }, [next, setStep, step, isKSA])

  const handleBack = useCallback(async () => {
    event(SwitchingKycDesktopFlowToHybridFlow)
    setDocPreview(null)
    setIsLoading(false)
    onClose()
    try {
      await ky.delete("/api/user/kyc/document-verification/reset")
    } catch (e) {}
    const redirectPath = isHybridFlowFlag ? "/kyc/session-stopped" : "/kyc"
    push(redirectPath)
  }, [isHybridFlowFlag, onClose, push])

  const startCapture = useCallback(
    (type: "manual" | "auto") => {
      if (!GlobalGatewayCapture) {
        return false
      }

      if (!type) {
        return
      }

      if (type === "manual") {
        GlobalGatewayCapture.Upload(handleImgSuccess, handleError)
        return
      }

      switch (stepData.type) {
        case KycDocumentTypes.NationalIdBack:
        case KycDocumentTypes.NationalIdFront:
        case KycDocumentTypes.PassportSignature: {
          GlobalGatewayCapture.StartDocumentCapture(
            START_MESSAGE,
            DEFAULT_TIMEOUT,
            true,
            handleImgSuccess,
            handleError,
            USE_CAPTURE_BUTTON,
            0,
            false,
          )
          break
        }
        case KycDocumentTypes.PassportFront: {
          GlobalGatewayCapture.StartPassportCapture(
            START_MESSAGE,
            DEFAULT_TIMEOUT,
            true,
            handleImgSuccess,
            handleError,
            USE_CAPTURE_BUTTON,
            0,
            false,
          )
          break
        }
        case KycDocumentTypes.LivePhoto:
          GlobalGatewayCapture.StartSelfieCapture(
            START_MESSAGE,
            DEFAULT_TIMEOUT,
            true,
            handleImgSuccess,
            handleError,
            USE_CAPTURE_BUTTON,
            0,
            false,
          )
          break
        default:
          break
      }
    },
    [handleError, handleImgSuccess, stepData.type],
  )

  const ChapterHeaderStepper = (props?: StyleProps) => (
    <Stepper activeStep={3} orientation="horizontal" {...props}>
      <Step index={0} completed />
      <Step index={1} completed />
      <Step index={2}>
        <StepContent>
          <StepLabel color="white" fontWeight="bold">
            {t("chapterSelection.chapterThree.stepper.title")}
          </StepLabel>
        </StepContent>
      </Step>
    </Stepper>
  )

  function renderDocPreview() {
    if (docPreview) {
      if (docPreview.includes("application/pdf")) {
        return <PdfViewer url={docPreview} />
      }
      return (
        <Image
          objectFit="contain"
          w="100%"
          h="100%"
          src={docPreview}
          alt="preview"
        />
      )
    }
    return null
  }

  const renderIDComponent = () => {
    if (error || docPreview) {
      return (
        <Flex
          borderWidth={1}
          borderColor="gray.700"
          backgroundColor="gray.850"
          justifyContent="center"
          alignItems="center"
          borderRadius={6}
          overflow="hidden"
          h={400}
          maxW="md"
          position="relative"
        >
          {error && (
            <Text fontSize="md" fontWeight={700} color="red.500">
              {error}
            </Text>
          )}
          {docPreview && renderDocPreview()}
        </Flex>
      )
    }
  }

  return (
    <>
      <ModalLayout
        height={window?.innerHeight || "100vh"}
        title={t("idVerification.page.title")}
        description={t("idVerification.page.description")}
        header={
          <ModalHeader
            boxShadow="0 0 0 4px var(--chakra-colors-gray-900)"
            {...(isDesktopView && {
              headerLeft: (
                <Stack isInline ps="6" spacing="6">
                  <Divider
                    orientation="vertical"
                    bgColor="white"
                    height="28px"
                  />
                  <ChapterHeaderStepper />
                </Stack>
              ),
            })}
            headerRight={
              <>
                {isMobileView && (
                  <>
                    <Flex flex="1" />
                    <Circle
                      size="10"
                      bgColor="gray.800"
                      onClick={onOpenSupport}
                      me="1"
                    >
                      {isRmAssigned ? (
                        <ChatIcon w="5" h="5" color="primary.500" />
                      ) : (
                        <QuestionIcon w="5" h="5" color="primary.500" />
                      )}
                    </Circle>
                    <Flex py="18px" h="full">
                      <Divider color="gray.500" orientation="vertical" />
                    </Flex>
                  </>
                )}
                <SaveAndExitButton
                  onSaveButtonProps={{ onClick: handleSaveAndExit }}
                  modalHeading={t("confirmModal.title")}
                  modalDescription={t("confirmModal.content")}
                  primaryButtonLabel={t("confirmModal.actions.goBack")}
                />
              </>
            }
            subheader={
              <>
                {isMobileView && (
                  <Box h="10" px="1" py="2">
                    <ChapterHeaderStepper />
                  </Box>
                )}
                <Progress
                  colorScheme="primary"
                  size="xs"
                  bgColor="gray.700"
                  value={Math.floor(((step + 1) / (numberOfSteps + 1)) * 100)}
                />
              </>
            }
          />
        }
        bgColor="gray.900"
        footer={
          <ModalFooter
            {...(isMobileView &&
              mobileViewStep == 0 && { position: "fixed", bottom: "0" })}
          >
            <Stack
              isInline
              spacing={{ base: 4, md: 8 }}
              px={{ base: 0, md: 3 }}
              flex="1"
              justifyContent="flex-end"
            >
              {isMobileView && mobileViewStep == 0 && !isLast && (
                <Button
                  px={8}
                  colorScheme="primary"
                  variant="solid"
                  onClick={() => {
                    setMobileViewStep(1)
                  }}
                  width="full"
                >
                  {t("common:button.capture")}
                </Button>
              )}
              {!isFirst && (showMobileButton || isLast) && (
                <Button
                  px={8}
                  colorScheme="primary"
                  variant="outline"
                  minW={{ base: "auto", md: "110px" }}
                  onClick={onOpen}
                  isFullWidth={isMobileView}
                >
                  {t("common:button.back")}
                </Button>
              )}
              {(showMobileButton || isLast) && (
                <Button
                  px={8}
                  colorScheme="primary"
                  variant="solid"
                  minW={{ base: "auto", md: "110px" }}
                  onClick={() => {
                    if (!isLast && !docPreview) return null
                    if (isLast) {
                      scheduleBtnRef.current?.click()
                    } else {
                      handleNext()
                    }
                  }}
                  isLoading={showLoader}
                  isFullWidth={isMobileView}
                >
                  {isLast
                    ? isMobileView
                      ? t("common:button.complete")
                      : t("common:button.completeRegistration")
                    : t("common:button.next")}
                </Button>
              )}
            </Stack>
          </ModalFooter>
        }
      >
        {showErr && (
          <Flex justifyContent="center" position="static" zIndex="popover">
            <Toast
              title={t("idVerification.errors.apiError.title")}
              description={t("idVerification.errors.apiError.description")}
              onClick={() => {
                setShowErr(false)
              }}
            />
          </Flex>
        )}
        {stepData ? (
          <SideBySideLayout
            hasSeparator={true}
            title={stepData.title ? t(stepData.title) : ""}
            subtitle={stepData.subtitle ? t(stepData.subtitle) : ""}
            description={stepData.description ? t(stepData.description) : ""}
          >
            {isMobileView && mobileViewStep === 0 && !isLast && (
              <KycIdVerificationMobileView />
            )}
            <chakra.div
              display={
                isDesktopView
                  ? isLast
                    ? "none"
                    : "flex"
                  : isMobileView && mobileViewStep > 0 && !isLast
                  ? "flex"
                  : "none"
              }
              width="full"
            >
              <KycIdVerificationUploadBox
                title={
                  stepData.component.title ? t(stepData.component.title) : ""
                }
                display={isLast ? "none" : "intial"}
                innerShapeType={stepData.shape}
                footerComponent={
                  <Flex
                    width="full"
                    maxW="md"
                    justifyContent="space-between"
                    alignItems="baseline"
                  >
                    {!docPreview && !error && (
                      <Button
                        mb={[4, 0]}
                        variant="solid"
                        colorScheme="primary"
                        isLoading={isLoading}
                        onClick={() => {
                          setIsLoading(true)
                          startCapture("auto")
                        }}
                      >
                        {t("text.takePhoto")}
                      </Button>
                    )}
                    {error && (
                      <Button
                        mb={[4, 0]}
                        variant="link"
                        size="xs"
                        colorScheme="primary"
                        disabled={isLoading}
                        onClick={() => {
                          setDocPreview(null)
                          setError("")
                        }}
                      >
                        {t("text.reset")}
                      </Button>
                    )}
                    {docPreview && (
                      <Button
                        mb={[4, 0]}
                        variant="link"
                        size="xs"
                        colorScheme="primary"
                        disabled={isLoading}
                        onClick={() => {
                          if (docPreview) {
                            setDocPreview(null)
                          }
                          setIsLoading(true)
                          startCapture("auto")
                        }}
                      >
                        {t("text.retakePhoto")}
                      </Button>
                    )}
                    {stepData.component.secondaryCta && (
                      <KycIdVerificationLinkButton
                        orText={t("common:generic.or")}
                        isDisabled={isLoading}
                        onClick={() => {
                          if (docPreview) {
                            setDocPreview(null)
                          }
                          startCapture("manual")
                        }}
                        tooltipText={t(stepData.component.tooltipText)}
                      >
                        {t(stepData.component.secondaryCta)}
                      </KycIdVerificationLinkButton>
                    )}
                  </Flex>
                }
              >
                {renderIDComponent()}
              </KycIdVerificationUploadBox>
            </chakra.div>
            {stepData.component.type === "scheduleVideoCall" && (
              <KycScheduleVideoCall
                ref={scheduleBtnRef}
                setShowLoader={setShowLoader}
              />
            )}
          </SideBySideLayout>
        ) : isLast ? (
          <Text>Steps completed</Text>
        ) : (
          <Text>Unexpected step</Text>
        )}
      </ModalLayout>
      <KycIdVerificationModal
        title={t("confirmModal.title")}
        isOpen={isOpen}
        onClose={onClose}
        isCentered={true}
        content={
          <Text color="gray.400" fontSize={14} textAlign="center">
            {t("confirmModal.content")}
          </Text>
        }
        footerComponent={
          <VStack spacing={[4]} justifyContent="center">
            <Button colorScheme="primary" onClick={handleBack}>
              {t("confirmModal.actions.goBack")}
            </Button>
            <Button colorScheme="primary" variant="ghost" onClick={onClose}>
              {t("confirmModal.actions.cancel")}
            </Button>
          </VStack>
        }
      />
      <GetSupportPopUp isOpen={isOpenSupport} onClose={onCloseSupport} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { res, req } = context
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

    if (context.locale === "ar") {
      res.writeHead(302, { Location: "/kyc/id-verification" })
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

export default withMyWizard(withPageAuthRequired(IdVerification))
