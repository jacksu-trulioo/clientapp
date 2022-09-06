import { Center, Container, Flex, Text, VStack } from "@chakra-ui/layout"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { ModalHeader, ModalLayout } from "~/components"
import MobileVerification from "~/components/OnboardingProfile/MobileVerification"
import { useUser } from "~/hooks/useUser"

interface OtpVerificationProps {
  scheduleSubmit?: () => {}
  scheduleCallOnSubmit?: boolean
  showOtpScreen?: () => void
  updatedPhoneNumber?: string
}

function OtpVerification(props: OtpVerificationProps) {
  const {
    scheduleSubmit,
    showOtpScreen,
    updatedPhoneNumber,
    scheduleCallOnSubmit = false,
  } = props
  const { t } = useTranslation("profile")
  const { user } = useUser()
  const router = useRouter()

  return (
    <>
      <ModalLayout
        title={t("otpVerification.page.title")}
        description={t("otpVerification.page.description")}
        header={
          <ModalHeader
            ps={{ base: "0", md: 4 }}
            boxShadow="0 0 0 4px var(--chakra-colors-gray-900)"
            headerRight={
              <>
                <Text
                  color="primary.500"
                  fontSize="md"
                  mr="8"
                  cursor="pointer"
                  onClick={scheduleCallOnSubmit ? showOtpScreen : router.back}
                >
                  {t("otpVerification.button.exit")}
                </Text>
              </>
            }
            showExitModalOnLogo={false}
          />
        }
      >
        <Flex direction="column" pt="44">
          <Container flex="1">
            <Center h="full">
              <VStack textAlign="center">
                <Text fontSize="2xl">{t("otpVerification.label.heading")}</Text>
                <Text
                  maxW={"305px"}
                  color="gray.500"
                  fontSize={"md"}
                  textAlign="center"
                >
                  {t(`onboarding.subheading.1`, {
                    mobileNumber:
                      (updatedPhoneNumber
                        ? updatedPhoneNumber.slice(-4)
                        : user?.profile?.phoneNumber?.slice(-4)) || "",
                  })}
                </Text>

                <MobileVerification
                  isOldUser={true}
                  scheduleSubmit={scheduleSubmit}
                  scheduleCallOnSubmit={scheduleCallOnSubmit}
                  showOtpScreen={showOtpScreen}
                  updatedPhoneNumber={updatedPhoneNumber}
                />
              </VStack>
            </Center>
          </Container>
        </Flex>
      </ModalLayout>
    </>
  )
}

export default OtpVerification
