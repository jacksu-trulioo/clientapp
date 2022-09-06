import { Button } from "@chakra-ui/button"
import { Box, Circle, Heading, Stack, Text } from "@chakra-ui/layout"
import { useBreakpointValue, useDisclosure } from "@chakra-ui/react"
import { chakra } from "@chakra-ui/system"
import ky from "ky"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect } from "react"
import useSWR from "swr"

import {
  CheckCircleIcon,
  FeedbackModal,
  Link,
  ModalFooter,
  ModalHeader,
  ModalLayout,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import {
  FeedbackSubmissionScreen,
  UserQualificationStatus,
  UserStatuses,
} from "~/services/mytfo/types"
import { getCookie } from "~/utils/cookiesHandler"
import {
  clickedGetProposal,
  clickedViewOpportunities,
  InvestmentNeedManualQualificationEvent,
  InvestmentQualifiedAutomaticallyEvent,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function OpportunityCompletedScreen() {
  const { t } = useTranslation("opportunities")
  const ref = React.useRef<HTMLDivElement>(null)
  const { user } = useUser()
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()

  const { data: statusData } = useSWR<UserStatuses>("/api/user/status")

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView

  const getUserStatus = () => {
    return statusData && statusData?.status !== UserQualificationStatus.Verified
  }

  useEffect(() => {
    onFeedbackModalOpen()
  }, [onFeedbackModalOpen])

  useEffect(() => {
    if (statusData && statusData?.status === UserQualificationStatus.Verified) {
      event(InvestmentQualifiedAutomaticallyEvent)
    } else if (
      statusData &&
      statusData?.status !== UserQualificationStatus.Verified
    ) {
      event(InvestmentNeedManualQualificationEvent)
    }
  }, [statusData])

  useEffect(() => {
    patchGAId()
  }, [])

  const patchGAId = async () => {
    try {
      const gaClientId = getCookie("_ga").replace("GA1.1.", "")
      const params = {
        gaClientId: gaClientId,
      }
      await ky.patch("/api/user/contact", {
        json: params,
      })
    } catch (e) {
      // no need to handle error as this will be silent failure
    }
  }

  return (
    <ModalLayout
      title={t("completed.page.title")}
      description={t("completed.page.description")}
      header={
        <ModalHeader boxShadow="0 0 0 4px var(--chakra-colors-gray-900)" />
      }
      {...(isMobileView && {
        footer: (
          <ModalFooter ref={ref} position="fixed" bottom="0">
            <Button
              colorScheme="primary"
              as={Link}
              href={getUserStatus() ? "/proposal" : "/opportunities"}
              isFullWidth
            >
              {getUserStatus()
                ? t("completed.button.getProposal")
                : t("completed.button.viewOpportunities")}
            </Button>
          </ModalFooter>
        ),
      })}
    >
      {statusData && statusData?.status && (
        <Stack
          h="full"
          spacing={{ base: 6, md: 14 }}
          margin="0 auto"
          alignItems="center"
          justifyContent="center"
          maxW="xl"
        >
          <Circle size="24" bgColor="gray.800">
            <CheckCircleIcon color="primary.500" h={16} w={16} />
          </Circle>

          <Heading fontSize="3xl" textAlign="center">
            {t("completed.text.title")}
          </Heading>

          {user && getUserStatus() ? (
            <Trans
              i18nKey="opportunities:completed.text.verifiedDescription"
              components={[
                <Box display="inline" key="0" />,
                <Text
                  color="gray.400"
                  textAlign="center"
                  fontSize="sm"
                  key="1"
                />,
                <chakra.span
                  color="white"
                  textAlign="center"
                  fontSize="sm"
                  key="2"
                />,
                <Text
                  color="gray.400"
                  textAlign="center"
                  p="4"
                  fontSize="sm"
                  key="3"
                />,
              ]}
              values={{
                userEmail: user?.email,
              }}
            />
          ) : (
            <Trans
              i18nKey="opportunities:completed.text.unVerifiedDescription"
              components={[
                <Box display="inline" key="0" />,
                <Text
                  color="gray.400"
                  textAlign="center"
                  fontSize="sm"
                  key="1"
                />,
                <Text
                  color="gray.400"
                  textAlign="center"
                  p="4"
                  fontSize="sm"
                  key="2"
                />,
              ]}
            />
          )}

          {isDesktopView && getUserStatus() && (
            <Button
              colorScheme="primary"
              onClick={() => {
                event(clickedGetProposal)
              }}
              as={Link}
              href="/proposal"
            >
              {t("completed.button.getProposal")}
            </Button>
          )}

          {isMobileView && !getUserStatus() && (
            <>
              <Button
                colorScheme="primary"
                variant="link"
                onClick={() => {
                  event(clickedGetProposal)
                }}
                as={Link}
                href="/proposal"
              >
                {t("completed.button.getProposal")}
              </Button>
              <span color="gray.400">{t("completed.text.or")}</span>
            </>
          )}

          {isDesktopView && !getUserStatus() && (
            <Stack spacing="4" direction="row">
              <Button
                colorScheme="primary"
                variant="outline"
                as={Link}
                onClick={() => {
                  event(clickedGetProposal)
                }}
                href="/proposal"
              >
                {t("completed.button.getProposal")}
              </Button>
              <Button
                onClick={() => {
                  event(clickedViewOpportunities)
                }}
                colorScheme="primary"
                as={Link}
                href="/opportunities"
              >
                {t("completed.button.viewOpportunities")}
              </Button>
            </Stack>
          )}
        </Stack>
      )}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={onFeedbackModalClose}
        submissionScreen={FeedbackSubmissionScreen.Opportunity}
      />
    </ModalLayout>
  )
}

export default withPageAuthRequired(OpportunityCompletedScreen)
