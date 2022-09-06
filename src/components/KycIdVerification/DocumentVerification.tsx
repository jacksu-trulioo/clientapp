import {
  Box,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/layout"
import {
  Button,
  chakra,
  Progress,
  useBreakpointValue,
  useDisclosure,
  useToken,
} from "@chakra-ui/react"
import ky from "ky"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"
import useSWR from "swr"

import { ModalFooter, ModalHeader, ModalLayout } from "~/components"
import useHybridFlowCleanup from "~/hooks/useHybridFlowCleanup"
import { useUser } from "~/hooks/useUser"
import {
  KycDocumentVerificationStatus,
  Preference,
} from "~/services/mytfo/types"
import { SwitchingKycHybridFlowToDesktopFlow } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

import KycIdVerificationModal from "./KycIdVerificationModal/KycIdVerificationModal"

type DocumentVerificationProps = {
  headerLeft?: React.ReactNode
}

type DocumentVerificationStatusProps = {
  status: KycDocumentVerificationStatus
}

function DocumentStatus(props: DocumentVerificationStatusProps) {
  const { status } = props
  const [gray800, gray600, green600] = useToken("colors", [
    "gray.800",
    "gray.600",
    "green.600",
  ])
  const { t } = useTranslation("kyc")
  const statusObject = Object.entries(status)
  const filtered = statusObject.filter(
    ([, value]) => typeof value === "boolean",
  )
  const verifiedStatus = Object.fromEntries(filtered)

  return (
    <VStack
      maxW={{ base: "full", md: "368px" }}
      fontSize="14"
      spacing={["6", "4"]}
    >
      {verifiedStatus &&
        Object.keys(verifiedStatus).map((key) => {
          return (
            <Flex
              key={key}
              width="100%"
              py={4}
              px={5}
              bgColor={gray800}
              justifyContent="space-between"
              borderRadius={6}
              boxShadow="cardShadow"
            >
              <Text>{t(`documentVerification.statusInfo.${key}`)}</Text>
              <Text
                px="4px"
                borderRadius={2}
                bgColor={verifiedStatus[key] ? green600 : gray600}
              >
                {t(
                  verifiedStatus[key]
                    ? "documentVerification.status.complete"
                    : "documentVerification.status.required",
                )}
              </Text>
            </Flex>
          )
        })}
    </VStack>
  )
}
function DocumentVerification(props: DocumentVerificationProps) {
  const { headerLeft } = props
  const { t } = useTranslation("kyc")
  const { user } = useUser()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalType, updateModalType] = useState("")
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView
  const modalId = "gobackModal"
  const { data: documentVerificationStatus } = useSWR(
    "/api/user/kyc/document-verification",
    { refreshInterval: 3000 },
  )
  if (user?.profile?.nationality !== "SA" && documentVerificationStatus) {
    delete documentVerificationStatus.passportSignature
  }

  const { data: preferredLanguage } = useSWR<Preference>("/api/user/preference")
  const { push } = useRouter()

  useHybridFlowCleanup()

  const handleClose = () => {
    updateModalType("")
    onClose()
  }
  const handleBack = async () => {
    event(SwitchingKycHybridFlowToDesktopFlow)
    const path = preferredLanguage?.language === "AR" ? "/ar" : "/"
    const backPath = modalType === modalId ? `${path}/kyc` : path
    try {
      await ky.delete("/api/user/kyc/document-verification/reset")
    } catch (e) {}
    if (preferredLanguage?.language === "AR") {
      window.location.replace(backPath)
    } else {
      push(backPath)
    }
  }

  const KycDocumentVerificationActions = () => {
    const isVerificationCompleted =
      documentVerificationStatus &&
      Object.entries(documentVerificationStatus).filter(
        ([, value]) => value === false,
      )
    return (
      <Stack
        isInline
        spacing={{ base: 4, md: 8 }}
        px={{ base: 0, md: 3 }}
        flex="1"
        justifyContent="flex-end"
      >
        <Button
          colorScheme="primary"
          variant="outline"
          minW={{ base: "auto", md: "110px" }}
          onClick={() => {
            updateModalType(modalId)
            onOpen()
          }}
          isFullWidth={isMobileView}
        >
          {t("common:button.back")}
        </Button>
        <Button
          colorScheme="primary"
          minW={{ base: "auto", md: "110px" }}
          disabled={isVerificationCompleted && !!isVerificationCompleted.length}
          onClick={() => push("/kyc/complete")}
          isLoading={false}
          loadingText={t("common:button.complete")}
          isFullWidth={isMobileView}
        >
          {t("common:button.completeRegistration")}
        </Button>
      </Stack>
    )
  }
  return (
    <ModalLayout
      title={t("documentVerification.heading")}
      description={t("documentVerification.description1")}
      header={
        <ModalHeader
          boxShadow="0 0 0 4px var(--chakra-colors-gray-900)"
          showExitModalOnLogo={true}
          {...(isDesktopView && {
            headerLeft: (
              <Stack isInline ps="6" spacing="6" alignItems="center">
                <Divider orientation="vertical" bgColor="white" height="28px" />
                {headerLeft}
              </Stack>
            ),
          })}
          headerRight={
            <Button onClick={onOpen} variant="ghost" colorScheme="primary">
              {t("common:button.saveAndExit")}
            </Button>
          }
          subheader={
            <>
              {isMobileView && (
                <Box h="10" px="1" py="2">
                  {headerLeft}
                </Box>
              )}

              <Progress
                colorScheme="primary"
                size="xs"
                bgColor="gray.700"
                value={80}
              />
            </>
          }
        />
      }
      footer={
        <ModalFooter>
          <KycDocumentVerificationActions />
        </ModalFooter>
      }
    >
      <Flex direction={{ base: "column", md: "row" }} py={{ base: 2, md: 16 }}>
        <Container flex="1" maxW={{ base: "full", md: "280px" }} px="0">
          <Heading
            mb={{ base: 8, md: 6 }}
            fontSize={{ base: "2xl", md: "3xl" }}
          >
            {t("documentVerification.heading")}
          </Heading>

          {[
            "documentVerification.description1",
            "documentVerification.description2",
          ].map((text: string) => (
            <Text
              key={text}
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.400"
              mb={{ base: 8, md: 6 }}
            >
              {t(text)}
            </Text>
          ))}
        </Container>

        {isDesktopView && (
          <Center px={{ base: 0, md: "64px" }} py={{ base: "48px", md: 0 }}>
            <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
          </Center>
        )}

        <Container flex="1" px="0">
          <chakra.div transition="0.1s filter linear">
            {documentVerificationStatus && (
              <DocumentStatus status={documentVerificationStatus} />
            )}
          </chakra.div>
        </Container>
      </Flex>
      <KycIdVerificationModal
        title={
          modalType === modalId
            ? t("confirmModal.title")
            : t("documentVerification.confirmModal.exit.title")
        }
        isOpen={isOpen}
        onClose={handleClose}
        isCentered={true}
        content={
          <>
            <Text color="gray.400" fontSize={14} textAlign="center" mb={6}>
              {t("documentVerification.confirmModal.content")}
            </Text>
          </>
        }
        footerComponent={
          <Stack
            spacing={{ base: 4, md: 8 }}
            px={{ base: 0, md: 3 }}
            flex="1"
            alignItems="center"
            isInline={modalType === modalId ? false : true}
          >
            <Button colorScheme="primary" onClick={handleBack} minW={6}>
              {modalType === modalId
                ? t("confirmModal.actions.goBack")
                : t("common:button.exit")}
            </Button>
            <Button
              colorScheme="primary"
              variant="outline"
              onClick={handleClose}
            >
              {t("confirmModal.actions.cancel")}
            </Button>
          </Stack>
        }
      />
    </ModalLayout>
  )
}

export default React.memo(DocumentVerification)
