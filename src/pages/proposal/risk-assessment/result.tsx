import { Button } from "@chakra-ui/button"
import {
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/layout"
import {
  CloseButton,
  HStack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import { useToast } from "@chakra-ui/toast"
import produce from "immer"
import ky from "ky"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import {
  FeedbackModal,
  Link,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  RiskIndicatorIcon,
  SaveAndExitButton,
  WarningIcon,
} from "~/components"
import {
  FeedbackSubmissionScreen,
  InvestorRiskAssessment,
  RiskAssessmentScore,
  UserQualificationStatus,
  UserStatuses,
} from "~/services/mytfo/types"
import { PersonalizedProposalLandingEvent } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function RiskAssessmentResult() {
  const { t } = useTranslation("proposal")
  const toast = useToast()
  const [showLoader, setShowLoader] = React.useState(false)

  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()

  // Required to prevent duplicate toasts.
  const toastId = "toast-error"

  const toastIdRef = React.useRef(0)

  function close() {
    if (toastIdRef?.current) {
      toast.close(toastIdRef.current)
    }
  }

  React.useEffect(() => {
    onFeedbackModalOpen()
  }, [onFeedbackModalOpen])

  const { data: riskScoreResult, error } = useSWR<RiskAssessmentScore>(
    "/api/user/risk-assessment/result",
  )

  const { data: userRiskQuestions } = useSWR<InvestorRiskAssessment>(
    "/api/user/risk-assessment",
  )

  const { data: statusData, error: statusError } =
    useSWR<UserStatuses>("/api/user/status")

  const isStatusLoading = !statusData && !statusError

  const isUserVerified = () => {
    if (!isStatusLoading && statusData) {
      return (
        statusData.status === UserQualificationStatus.Verified ||
        statusData.status === UserQualificationStatus.AlreadyClient
      )
    }
  }

  const ref = React.useRef<HTMLDivElement>(null)

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView

  const riskAssessmentScore = riskScoreResult?.data

  const handleSubmit = React.useCallback(async () => {
    setShowLoader(true)
    try {
      close()
      const updateObj = produce(userRiskQuestions, (draft) => {
        return {
          ...draft,
          isConfirmed: true,
        }
      })

      await ky
        .put("/api/user/risk-assessment", {
          json: updateObj,
        })
        .json<InvestorRiskAssessment>()

      if (isUserVerified()) {
        event(PersonalizedProposalLandingEvent)
        await ky.post("/api/user/proposals").json()
      }
      setShowLoader(false)
      router.push(
        isUserVerified()
          ? "/personalized-proposal"
          : "/proposal/risk-assessment/completed",
      )
    } catch (error) {
      // Show toast error.
      setShowLoader(false)
      if (!toast.isActive(toastId)) {
        toastIdRef.current = toast({
          isClosable: true,
          position: "bottom",
          render: () => (
            <HStack
              py="3"
              ps="10px"
              pe="4"
              bg="gray.800"
              direction="row"
              alignItems="center"
              borderStart="6px solid var(--chakra-colors-red-500)"
              borderRadius="2px"
              role="alert"
              justifyContent="center"
            >
              <HStack>
                <WarningIcon w="5" h="5" color="red.500" />
                <Text fontSize="md" color="white">
                  {t("common:toast.generic.error.title")}
                </Text>
              </HStack>

              <CloseButton onClick={close} />
            </HStack>
          ),
        }) as number
      }
    }
  }, [userRiskQuestions, t, toast])

  return (
    <ModalLayout
      title={t("riskAssessment.page.title")}
      description={t("riskAssessment.page.description")}
      header={
        <ModalHeader
          boxShadow="0 0 0 4px var(--chakra-colors-gray-900)"
          {...(isDesktopView && {
            headerLeft: (
              <Stack isInline ps="6" spacing="6">
                <Divider orientation="vertical" bgColor="white" height="28px" />
              </Stack>
            ),
          })}
          headerRight={
            <SaveAndExitButton
              onSaveButtonProps={{
                as: Link,
                href: "/",
              }}
            />
          }
        />
      }
      {...(isMobileView &&
        !isStatusLoading &&
        statusData && {
          footer: (
            <ModalFooter ref={ref} position="fixed" bottom="0">
              <Button
                colorScheme="primary"
                onClick={handleSubmit}
                isFullWidth
                isLoading={showLoader}
              >
                {isUserVerified()
                  ? t("riskAssessment.result.button.confirmAndView")
                  : t("riskAssessment.result.button.confirmProfile")}
              </Button>
            </ModalFooter>
          ),
        })}
    >
      <Container
        minH={{ base: "fit-content", md: "full" }}
        display="flex"
        flexDir="column"
        justifyContent="center"
        {...(isMobileView && {
          pt: "36px",
          pb: "24",
        })}
      >
        <Center>
          <RiskIndicatorIcon boxSize="24" />
        </Center>

        {riskAssessmentScore?.scoreDescription && !error && (
          <Stack spacing="8" mt="8">
            <Center>
              <Heading textAlign="center" fontSize="2xl" maxW="xs">
                {t("riskAssessment.result.heading", {
                  riskDescription: t(
                    `riskAssessment.result.status.${riskAssessmentScore?.scoreDescriptionId}.title`,
                  ),
                })}
              </Heading>
            </Center>
            <Text textAlign="center" fontSize="sm" color="gray.400">
              {t(
                `riskAssessment.result.status.${riskAssessmentScore?.scoreDescriptionId}.description`,
              )}
            </Text>
            <Flex
              direction={{ base: "column-reverse", md: "column" }}
              alignItems="center"
            >
              {isDesktopView && !isStatusLoading && statusData && (
                <Button
                  colorScheme="primary"
                  onClick={handleSubmit}
                  my="8"
                  isLoading={showLoader}
                >
                  {isUserVerified()
                    ? t("riskAssessment.result.button.confirmAndView")
                    : t("riskAssessment.result.button.confirmProfile")}
                </Button>
              )}

              <Text textAlign="center" fontSize="sm" py="8" color="gray.400">
                {t("riskAssessment.result.footer.description")}
              </Text>
            </Flex>
          </Stack>
        )}
      </Container>
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={onFeedbackModalClose}
        submissionScreen={FeedbackSubmissionScreen.Proposal}
      />
    </ModalLayout>
  )
}

export default withPageAuthRequired(RiskAssessmentResult)
