import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react"
import { Form, Formik, useField } from "formik"
import ky from "ky"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import * as Yup from "yup"

import { FeedbackSubmissionScreen } from "~/services/mytfo/types"

import TextareaControl from "./TextareaControl"

function FeedbackOptions({ name }: { name: string }) {
  const [, meta, helpers] = useField(name)
  const { t } = useTranslation("common")

  const { value } = meta
  const { setValue } = helpers

  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2} width="full">
      {["Poor", "Average", "Good", "Excellent"].map((option) => {
        return (
          <Center
            borderRadius="md"
            aria-label="timeSlot"
            bg="gray.800"
            height="40px"
            key={option}
            _hover={{
              cursor: "pointer",
            }}
            color="primary.500"
            onClick={() => setValue(option)}
            {...(option === value && {
              border: "2px solid",
              borderColor: "primary.500",
            })}
          >
            <Text>{t(`modal.feedback.option.rating.${option}`)}</Text>
          </Center>
        )
      })}
    </SimpleGrid>
  )
}

type FeedbackModalProps = {
  isOpen: boolean
  onClose: () => void
  hideReferalOption?: boolean
  submissionScreen: FeedbackSubmissionScreen
}

const FeedbackModal = ({
  isOpen,
  onClose,
  submissionScreen,
  hideReferalOption,
}: FeedbackModalProps) => {
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const { t } = useTranslation("common")
  const toast = useToast()
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closeOnOverlayClick={false}
    >
      <ModalOverlay bg="blackAlpha.800" backdropFilter="none" />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody mt={10} mb={4} textAlign="start">
          <Formik
            initialValues={{
              details: undefined,
              generateLink: false,
              rating: undefined,
            }}
            validationSchema={Yup.object().shape({
              rating: Yup.string().required(t("errors.atleastOne")),
              details: Yup.string().max(100, t("common:errors.maxChar")),
            })}
            onSubmit={async (values) => {
              try {
                await ky.post("/api/user/feedback", {
                  json: { ...values, submissionScreen },
                })
                onClose()
                const feedbackToastId = "feedbackToastIdSuccess"
                if (!toast.isActive(feedbackToastId)) {
                  toast({
                    id: feedbackToastId,
                    title: t("modal.feedback.text.thanks"),
                    variant: "subtle",
                    status: "success",
                    isClosable: true,
                    position: isMobileView ? "top" : "bottom",
                  })
                }
              } catch (e) {
                const feedbackToastId = "feedbackToastId"
                if (!toast.isActive(feedbackToastId)) {
                  toast({
                    id: feedbackToastId,
                    title: t("toast.generic.error.title"),
                    variant: "subtle",
                    status: "error",
                    isClosable: true,
                    position: "bottom",
                  })
                }
              }
            }}
          >
            {(formikProps) => (
              <Form style={{ width: "100%" }}>
                <Text fontSize="xl" mb={5} color="white">
                  {t("modal.feedback.title")}
                </Text>
                <FormControl
                  isInvalid={
                    !!formikProps.errors.rating && formikProps.touched.rating
                  }
                  mb="6"
                >
                  <FormLabel>{t("modal.feedback.text.rating")}</FormLabel>
                  <FeedbackOptions name="rating" />
                  <FormErrorMessage>
                    {formikProps?.errors?.rating}
                  </FormErrorMessage>
                </FormControl>
                <Text fontSize="sm" color="gray.400" mb={3}>
                  {t("modal.feedback.text.additionalInfo")}
                </Text>
                <TextareaControl name="details" mb="5" />
                {!hideReferalOption ? (
                  <FormControl display="flex" mb="5">
                    <Switch
                      id="generateLink"
                      name="generateLink"
                      colorScheme="primary"
                      isChecked={formikProps.values.generateLink}
                      onChange={(e) => {
                        formikProps.setFieldValue(
                          "generateLink",
                          e.target.checked,
                        )
                      }}
                      me="2"
                    />
                    <FormLabel htmlFor="email-alerts" mb="0">
                      {t("modal.feedback.text.uniqueLink")}
                    </FormLabel>
                  </FormControl>
                ) : (
                  false
                )}
                <Stack
                  direction={{ base: "column-reverse", md: "row" }}
                  justifyContent="flex-end"
                  spacing={4}
                >
                  <Button
                    colorScheme="primary"
                    variant="outline"
                    {...(!isMobileView && { width: "140px" })}
                    isFullWidth={isMobileView}
                    onClick={onClose}
                  >
                    {t("button.cancel")}
                  </Button>
                  <Button
                    colorScheme="primary"
                    variant="solid"
                    {...(!isMobileView && { width: "140px" })}
                    isFullWidth={isMobileView}
                    type="submit"
                    isLoading={formikProps?.isSubmitting}
                  >
                    {t("button.submit")}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default FeedbackModal
