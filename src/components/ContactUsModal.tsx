import { Button } from "@chakra-ui/button"
import { Circle, Flex, Heading, Text } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/media-query"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  UseModalProps,
} from "@chakra-ui/modal"
import { VStack } from "@chakra-ui/react"
import { useToast } from "@chakra-ui/toast"
import { Form, Formik } from "formik"
import ky from "ky"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import * as Yup from "yup"

import {
  ChatIcon,
  MailIcon,
  SelectControl,
  TextareaControl,
} from "~/components"
import { ContactedClientServiceMessageEvent } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

function ContactUsModal(props: UseModalProps) {
  const { isOpen, onClose } = props
  const { t, lang } = useTranslation("common")
  const toast = useToast()
  const toastId = "enquiry-toast-error"

  const [showSuccess, setShowSuccess] = React.useState(false)

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const modalSize = useBreakpointValue({ base: "sm", md: "2xl", lg: "3xl" })

  // to avoid key event being passed to sidebar
  function handleKeyDown(event: React.SyntheticEvent) {
    event.stopPropagation()
  }

  function handleClose() {
    showSuccess && setShowSuccess(false)
    onClose()
  }

  function renderSuccessMessage() {
    return (
      <>
        <Circle size="96px" bg="gray.800" mb="60px">
          <MailIcon w="62" h="62" color="primary.500" />
        </Circle>
        <Heading mb="4" color="white" size="lg">
          {t("modal.emailSent.title")}
        </Heading>
        <Text color="gray.500">{t("modal.emailSent.description")}</Text>
      </>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={modalSize}
      autoFocus={false}
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent mx={{ base: "6", md: "initial" }}>
        <ModalCloseButton />
        <ModalBody
          px={["6", "24"]}
          py="60px"
          bgColor="gray.900"
          borderRadius="inherit"
          {...(showSuccess && {
            py: "140px",
            px: ["10", "160px"],
          })}
        >
          <Flex flexDirection="column" alignItems="center">
            {showSuccess ? (
              renderSuccessMessage()
            ) : (
              <>
                <ChatIcon h="10" w="10" color="secondary.500" mb="10" />
                <Heading mb="4" color="white" size="lg">
                  {t("modal.submitEnquiry.title")}
                </Heading>
                <Text
                  color="gray.500"
                  mb="10"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {t("modal.submitEnquiry.description")}
                </Text>

                <Formik
                  initialValues={{ enquiryText: "", reason: "" }}
                  validationSchema={Yup.object({
                    enquiryText: Yup.string().required(t("errors.required")),
                    reason: Yup.string().required(t("errors.required")),
                  })}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      await ky
                        .post("/api/user/inquiry/email", {
                          json: {
                            supportDetails: values.enquiryText,
                            supportType: values.reason,
                          },
                          headers: {
                            "Accept-Language": lang,
                          },
                        })
                        .json()

                      setShowSuccess(true)
                      setSubmitting(false)
                    } catch (e) {
                      if (!toast.isActive(toastId)) {
                        toast({
                          id: toastId,
                          title: t("toast.enquiry.error.title"),
                          variant: "subtle",
                          status: "error",
                          isClosable: true,
                          position: "bottom",
                        })
                      }
                      setSubmitting(false)
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form style={{ width: "100%" }}>
                      <VStack spacing="3">
                        <SelectControl
                          name="reason"
                          selectProps={{
                            placeholder: t("modal.placeholder"),
                            options: [
                              {
                                label: t("modal.reasons.learnMore.label"),
                                value: t("modal.reasons.learnMore.value"),
                              },
                              {
                                label: t("modal.reasons.general.label"),
                                value: t("modal.reasons.general.value"),
                              },
                              {
                                label: t("modal.reasons.technical.label"),
                                value: t("modal.reasons.technical.value"),
                              },
                            ],
                          }}
                        />
                        <TextareaControl
                          name="enquiryText"
                          placeholder={t("textarea.placeholder")}
                          textAreaProps={{
                            onKeyDown: handleKeyDown,
                            resize: "none",
                            height: "150px",
                            maxLength: 300,
                          }}
                          mb="6"
                        />
                        <Button
                          variant="solid"
                          colorScheme="primary"
                          type="submit"
                          isFullWidth={isMobileView}
                          disabled={isSubmitting}
                          onClick={() =>
                            event(ContactedClientServiceMessageEvent)
                          }
                        >
                          {t("button.submit")}
                        </Button>
                      </VStack>
                    </Form>
                  )}
                </Formik>
              </>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ContactUsModal
