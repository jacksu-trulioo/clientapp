import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import React from "react"

type ConfirmModalBoxProps = {
  isOpen: boolean
  onClose: Function
  bodyContent: string
  secondButtonText: string
  secondButtonOnClick: () => void
  firstButtonText: string
  firstButtonOnClick: () => void
}

const ConfirmModalBox = ({
  isOpen,
  onClose,
  bodyContent,
  secondButtonText,
  secondButtonOnClick,
  firstButtonText,
  firstButtonOnClick,
}: ConfirmModalBoxProps) => {
  return (
    <Modal
      data-testid="confirm-modal"
      isOpen={isOpen}
      onClose={() => {
        onClose()
      }}
      size={"sm"}
      autoFocus={false}
      returnFocusOnClose={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton data-testid="close-btn" left="unset" right="10px" />
        <ModalBody p="10px 20px 15px" mt="12">
          <Text
            fontSize="24px"
            fontWeight="300"
            color="gray.300"
            lineHeight="120%"
            textAlign="center"
            data-testid="modal-body"
          >
            {bodyContent}
          </Text>
        </ModalBody>
        <ModalFooter p="28px">
          <Flex style={{ gap: "16px" }} w="100%">
            <Button
              fontSize={{ base: "16px", lgp: "14px" }}
              colorScheme="primary"
              variant="outline"
              h="32px"
              w="50%"
              onClick={firstButtonOnClick}
              data-testid="first-btn"
            >
              {firstButtonText}
            </Button>
            <Button
              fontSize={{ base: "16px", lgp: "14px" }}
              colorScheme="primary"
              variant="outline"
              h="32px"
              w="50%"
              onClick={secondButtonOnClick}
              data-testid="second-btn"
            >
              {secondButtonText}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ConfirmModalBox
