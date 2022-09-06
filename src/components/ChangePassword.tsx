import { Button } from "@chakra-ui/button"
import { Center, VStack } from "@chakra-ui/layout"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal"
import {
  Box,
  chakra,
  Circle,
  Heading,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react"
import { Form, Formik } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import * as Yup from "yup"

import {
  CalendarIcon,
  CheckCircleIcon,
  InputControl,
  MailIcon,
  RemoveCircleIcon,
} from "~/components"
import encryptBodyRequest from "~/utils/encryption"
import { PasswordChangeSuccessEvent } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import { validatePassword } from "~/utils/validatePassword"

type ChangePasswordInput = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
  apiError: string
}

function ChangePassword({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { t, lang } = useTranslation("profile")
  const [isMobileView] = useMediaQuery("(max-width: 45em)")
  const [isPasswordChanged, setIsPasswordChanged] = React.useState(false)

  const validateForm = async (values: ChangePasswordInput) => {
    const errors = {} as {
      oldPassword: string
      newPassword: string
      confirmPassword: string
    }

    const passwordError = await validatePassword(values.newPassword)
    if (passwordError) {
      errors.newPassword = passwordError
    }

    return errors
  }

  const showPasswordSuccessfulComponent = () => {
    return (
      <>
        <Center>
          <ModalHeader whiteSpace="nowrap">
            <Circle
              bgColor="gray.800"
              size="24"
              ml="auto"
              mr="auto"
              mb={["20", "6"]}
            >
              {isMobileView ? (
                <CalendarIcon color="primary.500" w="62px" h="62px" />
              ) : (
                <MailIcon color="primary.500" w="62px" h="62px" />
              )}
            </Circle>
            <Heading fontSize={["2xl", "3xl"]} mb={["4", "6"]}>
              {t("changePassword.passwordChanged.heading")}
            </Heading>
          </ModalHeader>
        </Center>
        <ModalBody pb={6}>
          <Text mb={["66px", "6"]}>
            {t("changePassword.passwordChanged.subheading")}
          </Text>
          <Button
            as={chakra.a}
            colorScheme="primary"
            href={`/api/auth/logout?lang=${lang}`}
          >
            {t("changePassword.button.logout")}
          </Button>
        </ModalBody>
      </>
    )
  }

  return (
    <Modal
      closeOnOverlayClick={isPasswordChanged ? false : true}
      isOpen={isOpen}
      onClose={onClose}
      size={isMobileView ? "xs" : "md"}
      isCentered={isPasswordChanged ? true : false}
      autoFocus={false}
      returnFocusOnClose={false}
    >
      <ModalOverlay
        sx={{
          "-webkit-backdrop-filter": "blur(8px) !important",
        }}
      />
      <ModalContent>
        {isPasswordChanged ? (
          showPasswordSuccessfulComponent()
        ) : (
          <>
            <Center>
              <ModalHeader whiteSpace="nowrap">
                {t("changePassword.heading")}
              </ModalHeader>
            </Center>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Formik<ChangePasswordInput>
                initialValues={{
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                  apiError: "",
                }}
                validate={validateForm}
                validationSchema={Yup.object({
                  oldPassword: Yup.string().required(
                    t("common:errors.required"),
                  ),
                  newPassword: Yup.string().required(
                    t("common:errors.required"),
                  ),
                  confirmPassword: Yup.string()
                    .required(t("common:errors.required"))
                    .notOneOf(
                      [Yup.ref("oldPassword")],
                      t("changePassword.validation.samePasswordsErr"),
                    )
                    .oneOf(
                      [Yup.ref("newPassword")],
                      t("changePassword.validation.confirmPasswordErr"),
                    ),
                })}
                onSubmit={async (values, actions) => {
                  try {
                    await encryptBodyRequest(
                      values,
                      "/api/auth/update-password",
                      lang,
                    ).json()
                    event(PasswordChangeSuccessEvent)
                    setIsPasswordChanged(true)
                  } catch (e) {
                    actions.setFieldError(
                      "oldPassword",
                      t("changePassword.error.updatePasswordErr"),
                    )
                  }
                }}
              >
                {({ isSubmitting, touched, values }) => (
                  <Form style={{ width: "100%" }}>
                    <VStack spacing={["8", "6"]}>
                      <InputControl
                        name="oldPassword"
                        label={t("changePassword.label.oldPassword")}
                        inputProps={{
                          type: "password",
                          placeholder: t(
                            "changePassword.placeholder.oldPassword",
                          ),
                        }}
                      />

                      <InputControl
                        name="newPassword"
                        label={t("changePassword.label.password")}
                        inputProps={{
                          type: "password",
                          placeholder: t(
                            "changePassword.placeholder.newPassword",
                          ),
                        }}
                        customError={(error: string) => {
                          const validateTerm = (term: string) => {
                            return error.includes(term) ? (
                              <RemoveCircleIcon color="red.500" w="5" h="5" />
                            ) : (
                              <CheckCircleIcon color="green.500" w="5" h="5" />
                            )
                          }

                          return (
                            (touched?.newPassword || values?.newPassword) && (
                              <Box
                                bg="gray.850"
                                rounded="md"
                                p="4"
                                mt="2"
                                textAlign="start"
                              >
                                <Text fontSize="sm" mb="5">
                                  {t("changePassword.validation.heading")}
                                </Text>
                                <Stack
                                  fontSize="xs"
                                  color="gray.500"
                                  lineHeight="1"
                                >
                                  <Stack isInline alignItems="center">
                                    {validateTerm("lowercase")}
                                    <Text>
                                      {t("changePassword.validation.lowercase")}
                                    </Text>
                                  </Stack>
                                  <Stack isInline alignItems="center">
                                    {validateTerm("uppercase")}
                                    <Text>
                                      {t("changePassword.validation.uppercase")}
                                    </Text>
                                  </Stack>
                                  <Stack isInline alignItems="center">
                                    {validateTerm("digit")}
                                    <Text>
                                      {t("changePassword.validation.numbers")}
                                    </Text>
                                  </Stack>
                                  <Stack isInline alignItems="center">
                                    {validateTerm("special")}
                                    <Text>
                                      {t("changePassword.validation.special")}
                                    </Text>
                                  </Stack>
                                  <Stack isInline alignItems="center">
                                    {validateTerm("length")}
                                    <Text>
                                      {t("changePassword.validation.length")}
                                    </Text>
                                  </Stack>
                                </Stack>
                              </Box>
                            )
                          )
                        }}
                      />
                      <InputControl
                        name="confirmPassword"
                        label={t("changePassword.label.confirmPassword")}
                        inputProps={{
                          type: "password",
                          placeholder: t(
                            "changePassword.placeholder.confirmPassword",
                          ),
                        }}
                      />
                      <Button
                        role="button"
                        isFullWidth={!isMobileView ? false : true}
                        colorScheme="primary"
                        loadingText={t("changePassword.button.update")}
                        type="submit"
                        mb="2"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        {t("changePassword.button.update")}
                      </Button>
                    </VStack>
                  </Form>
                )}
              </Formik>
            </ModalBody>

            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ChangePassword
