import {
  Box,
  Container,
  Heading,
  ListItem,
  OrderedList,
  VStack,
} from "@chakra-ui/layout"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/modal"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"

interface HowToScanQrModalType {
  children?: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

function HowToScanQrModal(props: HowToScanQrModalType) {
  const { t } = useTranslation("kyc")
  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={props.isOpen}
      onClose={props.onClose}
      size="lg"
      isCentered={true}
      autoFocus={false}
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={10}>
          <VStack
            spacing={6}
            justifyContent="center"
            alignItems="center"
            mb={6}
          >
            <ModalCloseButton />
            <Heading fontSize="3xl" fontWeight={400}>
              {t("howToScanQrModal.heading")}
            </Heading>
            <Container maxW="sm" centerContent>
              <Trans
                i18nKey={"kyc:howToScanQrModal.description"}
                components={[
                  <OrderedList key="0" fontSize="md" fontWeight={400} mx={2} />,
                  ...[1, 2, 3, 4].map((key) => <ListItem key={key} />),
                ]}
              />
            </Container>
            <Box mb={4}>{props.children}</Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default React.memo(HowToScanQrModal)
