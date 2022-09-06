import {
  Box,
  chakra,
  Container,
  Flex,
  HStack,
  HTMLChakraProps,
  Text,
} from "@chakra-ui/react"
import ky from "ky"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { CloseIcon, SecurityLockIcon } from "~/components"
import { useUser } from "~/hooks/useUser"

export interface VerifyPhoneNotificationProps
  extends HTMLChakraProps<"header"> {
  onCloseClick: () => void
}

function VerifyPhoneNotification(props: VerifyPhoneNotificationProps) {
  const { t } = useTranslation("common")
  const { user, isLoading } = useUser()

  const sendOtpVerification = async () => {
    await router.push("/otp-verification")
    await ky.post("/api/auth/send-otp", {
      json: {
        phoneNumber: `${user?.profile?.phoneCountryCode}${user?.profile?.phoneNumber}`,
      },
    })
  }

  if (isLoading || user?.phoneNumberVerified) return null

  return (
    <Box
      maxW="full"
      w="auto"
      h={[12, 8]}
      mb={{ base: 4 }}
      bgColor="gray.850"
      zIndex="1"
      position="fixed"
      left="0"
      right="0"
      {...props}
    >
      <Container
        px={{ base: 4, md: 6, lg: 12, xl: 14 }}
        flex="1"
        maxW="5xl"
        h="full"
      >
        <Flex justifyContent="space-between" alignItems="center" h="full">
          <Box>
            <HStack>
              <SecurityLockIcon w="6" h="6" pt={1} color="secondary.500" />
              <Text fontSize="xs" fontWeight={400}>
                {t("modal.verifyPhoneNumber.description")}
                <chakra.span
                  onClick={sendOtpVerification}
                  textDecoration="underline"
                  color="primary.500"
                  cursor="pointer"
                  px={1}
                >
                  {t("modal.verifyPhoneNumber.cta")}
                </chakra.span>
              </Text>
            </HStack>
          </Box>
          <Box onClick={props.onCloseClick} cursor="pointer">
            <CloseIcon boxSize={5} color="primary.500" />
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default VerifyPhoneNotification
