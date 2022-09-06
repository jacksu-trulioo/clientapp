import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"

const KycLocationConsentModal = (props: {
  handleGeoLocation: (arg0: boolean) => void
  isOpenGeoModal: boolean
}) => {
  const { handleGeoLocation, isOpenGeoModal } = props
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const { t } = useTranslation("kyc")
  return (
    <Modal
      onClose={() => handleGeoLocation(false)}
      size={isMobileView ? "xs" : "2xl"}
      isOpen={isOpenGeoModal}
      isCentered={true}
      autoFocus={false}
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            color="white"
            px={{ base: 2, md: 6 }}
          >
            {t("geoLocationConsentModal.heading")}
          </Heading>
        </ModalHeader>
        <ModalCloseButton onClick={() => handleGeoLocation(false)} />

        <ModalBody px={{ base: 2, md: "6" }}>
          <Text mb="10" fontSize={{ base: "sm", md: "md" }}>
            {t("geoLocationConsentModal.description")}
          </Text>
        </ModalBody>

        <ModalFooter mb="8">
          <Flex justifyContent="center" direction="row" w="full" gridGap="3">
            <Button
              variant="outline"
              colorScheme="primary"
              onClick={() => handleGeoLocation(false)}
            >
              {t("geoLocationConsentModal.actions.dontAllow")}
            </Button>
            <Button
              colorScheme="primary"
              variant="solid"
              onClick={() => handleGeoLocation(true)}
              px="8"
            >
              {t("geoLocationConsentModal.actions.allow")}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default KycLocationConsentModal
