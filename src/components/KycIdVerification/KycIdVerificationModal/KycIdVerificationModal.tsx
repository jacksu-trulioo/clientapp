import {
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react"
import { ReactElement } from "react"

type KycIdVerificationModalProps = Pick<
  ModalProps,
  "isOpen" | "onClose" | "isCentered"
> & {
  title?: string
  content: ReactElement
  footerComponent?: ReactElement
}

const KycIdVerificationModal = ({
  title,
  content,
  isOpen = false,
  onClose,
  footerComponent,
  isCentered = false,
}: KycIdVerificationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={isCentered}>
      <ModalOverlay />
      <ModalContent w="100%" maxW="530px">
        <ModalCloseButton />
        <ModalBody pt={16} pb={footerComponent ? 0 : 16} px={8}>
          <Heading
            fontWeight={400}
            fontSize="lg"
            as="h2"
            color="white"
            textAlign="center"
            mb={6}
          >
            {title}
          </Heading>
          {content}
        </ModalBody>
        {footerComponent && (
          <ModalFooter pt={12} pb={10}>
            {footerComponent}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}

export default KycIdVerificationModal
