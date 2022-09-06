import {
  Button,
  ButtonProps,
  HTMLChakraProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Logo } from "~/components"

import { LinkProps } from "./Link"

interface SaveAndExitButtonProps extends HTMLChakraProps<"div"> {
  onSave?: () => void
  onSaveButtonProps?: ButtonProps & LinkProps
  showExitModalOnLogo?: boolean
  modalHeading?: string
  modalDescription?: string
  primaryButtonLabel?: string
}

const SaveAndExitButton = React.forwardRef<
  HTMLDivElement,
  SaveAndExitButtonProps
>(function SaveAndExitButton(props, ref) {
  const {
    onSave,
    onSaveButtonProps,
    showExitModalOnLogo,
    modalHeading,
    modalDescription,
    primaryButtonLabel,
    ...rest
  } = props
  const { t } = useTranslation("common")
  const { onOpen, onClose, isOpen } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen} variant="ghost" colorScheme="primary">
        {showExitModalOnLogo ? (
          <Logo height="28px" _hover={{ cursor: "pointer" }} />
        ) : (
          t("common:button.saveAndExit")
        )}
      </Button>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        autoFocus={false}
        returnFocusOnClose={false}
        {...rest}
      >
        <ModalOverlay />

        <ModalContent ref={ref}>
          <ModalCloseButton />
          <ModalHeader>
            {modalHeading || t("modal.saveAndExit.title")}
          </ModalHeader>
          <ModalBody>
            {modalDescription || t("modal.saveAndExit.description")}
          </ModalBody>

          <ModalFooter>
            <VStack>
              <Button
                colorScheme="primary"
                minWidth="140px"
                variant="solid"
                {...(onSave && { onClick: onSave })}
                {...onSaveButtonProps}
              >
                {primaryButtonLabel || t("button.saveAndExit")}
              </Button>
              <Button
                colorScheme="primary"
                minWidth="140px"
                variant="ghost"
                onClick={onClose}
              >
                {t("button.cancel")}
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
})

export default React.memo(SaveAndExitButton)
