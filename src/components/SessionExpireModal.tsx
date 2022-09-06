import { useBreakpointValue } from "@chakra-ui/media-query"
import {
  Box,
  Button,
  Container as ChakraContainer,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useState } from "react"

import { ClockIcon } from "~/components"

type SessionModalProps = {
  isOpen: boolean
  onClose: () => void
  timer: number
}

const SessionModal = ({ isOpen, onClose, timer }: SessionModalProps) => {
  const { t } = useTranslation("common")
  const modalSize = useBreakpointValue({ base: "xs", md: "xs" })
  const [time, setTime] = useState(timer || 60)
  const { locale } = useRouter()

  useEffect(() => {
    if (time >= 1 && isOpen) {
      setTimeout(() => {
        setTime(time - 1)
      }, 1000)
    } else if (isOpen && time == 0) {
      onClose()
      logout()
    }
  })

  const logout = async () => {
    window.location.replace(`/api/auth/logout?lang=${locale}`)
  }

  return (
    <ChakraContainer>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose()
        }}
        size={modalSize}
        autoFocus={false}
        returnFocusOnClose={false}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent padding="10px 6px 12px">
          <ModalCloseButton />
          <ModalBody mt="12" p="0" textAlign="left">
            <ChakraContainer>
              <Text
                fontStyle="normal"
                fontWeight="300"
                fontSize="24px"
                lineHeight="120%"
                textAlign="center"
                color="#F9F9F9"
                margin="20px 0px"
              >
                {t("sessionExpireModal.title")}
              </Text>
              <Text
                fontStyle="normal"
                fontWeight="400"
                fontSize="14px"
                lineHeight="120%"
                textAlign="center"
                color="#828282"
                margin="20px 0px"
              >
                {t("sessionExpireModal.description")}
              </Text>
              <Text
                fontStyle="normal"
                fontWeight="400"
                fontSize="14px"
                lineHeight="120%"
                textAlign="center"
                color="#828282"
                margin="20px 0px"
              >
                {t("sessionExpireModal.message")}
              </Text>
              <Flex
                textAlign="center"
                justifyContent="center"
                alignItems="center"
                alignContent="center"
              >
                <Box textAlign="center">
                  <ClockIcon />
                </Box>
                <Box
                  fontStyle="normal"
                  fontWeight="400"
                  fontSize="12px"
                  lineHeight="120%"
                  color="#AAAAAA"
                  margin="20px 10px"
                  textAlign="center"
                >
                  {time} {t("sessionExpireModal.label.sec")}
                </Box>
              </Flex>
            </ChakraContainer>
          </ModalBody>

          <ModalFooter float="right" flexDirection="row">
            <Button
              colorScheme="primary"
              variant="outline"
              mr={3}
              size="xs"
              padding="15px"
              onClick={logout}
            >
              {t("sessionExpireModal.button.logout")}
            </Button>
            <Button
              colorScheme="primary"
              mr={3}
              size="xs"
              padding="15px"
              onClick={() => {
                onClose()
              }}
            >
              {t("sessionExpireModal.button.continueSession")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraContainer>
  )
}

export default SessionModal
