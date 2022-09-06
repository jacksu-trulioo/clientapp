import {
  Badge,
  Box,
  Circle,
  Container,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/layout"
import {
  Button,
  chakra,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import {
  CheckCircleIcon,
  FeedbackModal,
  MailIcon,
  ModalFooter,
  ModalHeader,
  ModalLayout,
} from "~/components"
import siteConfig from "~/config"
import { MyTfoClient } from "~/services/mytfo"
import { FeedbackSubmissionScreen, Preference } from "~/services/mytfo/types"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function KycCompletionScreen() {
  const { t } = useTranslation("kyc")
  const { query } = useRouter()
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const { data: preferredLanguage } = useSWR<Preference>("/api/user/preference")
  const isHybridFlow = (isMobileView && query.isHybridFlow === "yes") as boolean
  const { data: onboardingId } = useSWR(
    !isHybridFlow ? "/api/user/kyc/onboarding-id" : null,
  )
  const backToDashboardNavigationUrl = (
    preferredLanguage?.language === "AR" ? "/ar" : "/"
  ) as string

  React.useEffect(() => {
    if (
      isMobileView === false ||
      (isMobileView === true && query.isHybridFlow !== "yes")
    ) {
      if (!isFeedbackModalOpen) {
        onFeedbackModalOpen()
      }
    }
  }, [isMobileView, query.isHybridFlow])

  return (
    <ModalLayout
      title={t("completionStep.page.title")}
      description={t("completionStep.page.description")}
      header={<ModalHeader />}
      {...(isMobileView &&
        !isHybridFlow && {
          footer: (
            <ModalFooter position="fixed" bottom="0">
              <Flex flexGrow={12}>
                <Button
                  as="a"
                  href={backToDashboardNavigationUrl}
                  variant="solid"
                  isFullWidth={isMobileView}
                  colorScheme="primary"
                  textDecoration="none"
                >
                  {t("completionStep.goBackToDashboardCta")}
                </Button>
              </Flex>
            </ModalFooter>
          ),
        })}
    >
      <Container
        maxW={["container.xl", "container.sm"]}
        height="full"
        centerContent
        justifyContent="center"
        px={2}
      >
        <Box>
          <Circle size="96px" bg="gray.800" mb="60px">
            {isHybridFlow ? (
              <CheckCircleIcon w="62" h="62" color="primary.500" />
            ) : (
              <MailIcon w="62" h="62" color="primary.500" />
            )}
          </Circle>
        </Box>
        <Heading fontSize={["2xl", "3xl", "4xl"]}>
          {isHybridFlow
            ? t("completionStep.hybridFlow.heading")
            : t("completionStep.heading")}
        </Heading>
        {!isHybridFlow && (
          <Badge
            variant="outline"
            borderRadius={12}
            border="1px solid"
            borderColor="secondary.500"
          >
            <Text fontSize="xs" p={0.5}>
              {t("completionStep.onboardingIdPlaceholder")} {onboardingId}
            </Text>
          </Badge>
        )}
        <Box align="center" fontSize="sm" fontWeight={400} my={4} mx={[0, 6]}>
          <Text my={2}>
            {isHybridFlow
              ? t("completionStep.hybridFlow.confirmationText1")
              : t("completionStep.confirmationText1")}
          </Text>
          <Text my={2}>
            {isHybridFlow
              ? t("completionStep.hybridFlow.confirmationText2")
              : t("completionStep.confirmationText2")}
          </Text>
          {!isHybridFlow && (
            <Trans
              i18nKey={"kyc:completionStep.confirmationText3"}
              components={[
                <Text key="0" my={2} />,
                <chakra.a
                  key="1"
                  href={`mailto:${siteConfig.supportEmail}`}
                  color="primary.500"
                />,
              ]}
              values={{ supportEmail: siteConfig.supportEmail, onboardingId }}
            />
          )}
        </Box>
        {!isMobileView && !isHybridFlow && (
          <Button
            as="a"
            href={backToDashboardNavigationUrl}
            mt={8}
            mb={{ base: 4, md: 4, lg: 0 }}
            role="button"
            size="sm"
            colorScheme="primary"
            textDecoration="none"
          >
            {t("completionStep.goBackToDashboardCta")}
          </Button>
        )}
      </Container>
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={onFeedbackModalClose}
        submissionScreen={FeedbackSubmissionScreen.KYC}
      />
    </ModalLayout>
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

export default React.memo(withPageAuthRequired(KycCompletionScreen))
