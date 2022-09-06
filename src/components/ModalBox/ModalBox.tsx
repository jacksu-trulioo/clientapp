import {
  Button,
  Container,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react"
import React from "react"

type ModalProps = {
  modalTitle: string
  modalDescription: string
  primaryButtonText: string
  isSecondaryButton?: boolean
  secondaryButtonText?: string
  onClose: Function
  onPrimaryClick: Function
  isOpen: boolean
}

export function ModalBox({
  modalTitle,
  modalDescription,
  primaryButtonText,
  isSecondaryButton,
  secondaryButtonText,
  onClose,
  onPrimaryClick,
  isOpen,
  ...rest
}: ModalProps) {
  return (
    <Container>
      <Modal
        onClose={() => onClose()}
        isOpen={isOpen}
        isCentered
        autoFocus={false}
        returnFocusOnClose={false}
        {...rest}
      >
        <ModalOverlay />

        <ModalContent>
          <ModalCloseButton left="unset !important" right="10px" />
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalBody>{modalDescription}</ModalBody>

          <ModalFooter>
            <VStack>
              <Button
                colorScheme="primary"
                minWidth="140px"
                variant="solid"
                onClick={() => onPrimaryClick()}
              >
                {primaryButtonText}
              </Button>
              {isSecondaryButton ? (
                <Button
                  colorScheme="primary"
                  minWidth="140px"
                  variant="ghost"
                  onClick={() => onClose()}
                >
                  {secondaryButtonText}
                </Button>
              ) : (
                false
              )}
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  )
}

export default ModalBox
