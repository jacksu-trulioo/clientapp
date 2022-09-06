import { Box, Heading, Text, VStack } from "@chakra-ui/layout"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/modal"
import { useRouter } from "next/router"
import QRCode from "qrcode.react"
import React, { useEffect } from "react"
import useSWR from "swr"

import { StartKycIdVerificationHybridFlow } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

interface QrCodeGeneratorModalType {
  heading: string
  title: string
  children?: React.ReactNode
  isOpen: boolean
  onClose: () => void
  qrCodeUrl: string
}

function QrCodeGeneratorModal(props: QrCodeGeneratorModalType) {
  const router = useRouter()

  const { data: hybridFlow } = useSWR("/api/user/kyc/hybrid-flow", {
    refreshInterval: 3000,
  })

  useEffect(() => {
    if (hybridFlow?.isHybridFlow) {
      event(StartKycIdVerificationHybridFlow)
      router.push("/kyc/document-verification")
    }
  }, [hybridFlow, router])

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
            <Heading fontSize="lg" fontWeight={400}>
              {props.heading}
            </Heading>
            <Text fontSize="md" fontWeight={400}>
              {props.title}
            </Text>
            <Box>
              <QRCode value={props.qrCodeUrl} size={150} includeMargin={true} />
            </Box>
            <Box mb={4}>{props.children}</Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default React.memo(QrCodeGeneratorModal)
