import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal"
import { Button, HStack } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { useCallback, useState } from "react"

import { useStepperStoredState } from "./useStepperStoredState"

export const RestoreModal: React.VFC = () => {
  const { state, restore, purge } = useStepperStoredState()
  const [restoreModalOpen, setRestoreModalOpen] = useState(!!state)
  const { t } = useTranslation("wealthAddAssets")

  const onCloseModal = useCallback(() => {
    setRestoreModalOpen(false)
  }, [])

  const onRestore = useCallback(() => {
    restore()
    onCloseModal()
  }, [onCloseModal, restore])

  const onPurge = useCallback(() => {
    purge()
    onCloseModal()
  }, [onCloseModal, purge])

  return (
    <Modal isOpen={restoreModalOpen} onClose={onCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("restoreModal.title")}</ModalHeader>
        <ModalCloseButton onClick={onCloseModal} />
        <ModalBody>{t("restoreModal.body")}</ModalBody>
        <ModalFooter>
          <HStack>
            <Button variant="ghost" bg="gray.600" onClick={onCloseModal}>
              {t("restoreModal.buttons.no")}
            </Button>
            <Button onClick={onRestore}>{t("restoreModal.buttons.yes")}</Button>
            <Button variant="solid" bg="red.500" onClick={onPurge}>
              {t("restoreModal.buttons.purge")}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

RestoreModal.displayName = "RestoreModal"

export default RestoreModal
