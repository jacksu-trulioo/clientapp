import { useBreakpointValue } from "@chakra-ui/media-query"
import {
  Box,
  Button,
  chakra,
  Container,
  Heading,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import * as Yup from "yup"

import {
  CheckCircleIcon,
  EyeClosedIcon,
  EyeIcon,
  InputControl,
  LanguageSwitch,
  Link,
  Logo,
  RemoveCircleIcon,
  Seo,
} from "~/components"
import encryptBodyRequest from "~/utils/encryption"
import {
  ForgetPasswordChangeSuccessEvent,
  ForgetPasswordEmailVerifiedEvent,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import { validatePassword } from "~/utils/validatePassword"

const ChangePasswordScreen = () => {
  React.useEffect(() => {
    event(ForgetPasswordEmailVerifiedEvent)
  }, [])
  const { t, lang } = useTranslation("auth")
  const router = useRouter()
  const { email = "", expirydate = "", data = "" } = router.query
  const [isPasswordUpdated, setIsPasswordUpdated] = React.useState(false)
  const [isLinkExpired, setIsLinkExpired] = React.useState(false)
  const [passwordIsMasked, setPasswordIsMasked] = React.useState(true)
  const [confirmPasswordIsMasked, setConfirmPasswordIsMasked] =
    React.useState(true)
  const toast = useToast()

  const isMobileView = useBreakpointValue({ base: true, md: false })

  const showChangePasswordSuccess = () => {
    return (
      <>
        <CheckCircleIcon w="24" h="24" color="#B99855" />

        <Heading fontSize={["3xl"]} mb="6" fontStyle="normal">
          {t("change.passwordUpdatedSuccess.heading")}
        </Heading>
        <Text color="gray.400" fontSize={["sm", "md"]} mb="12">
          {t("change.passwordUpdatedSuccess.subheading")}
        </Text>

        <Button
          role="button"
          as={Link}
          href="/login"
          colorScheme="primary"
          loadingText={t("change.button.passwordUpdatedGoToLogin")}
        >
          {t("change.button.passwordUpdatedGoToLogin")}
        </Button>
      </>
    )
  }

  const showLinkExpired = () => {
    return (
      <>
        <RemoveCircleIcon w="24" h="24" color="#B99855" />

        <Heading fontSize={["3xl"]} mb="6">
          {t("change.linkExpired.heading")}
        </Heading>
        <Text color="gray.400" fontSize={["sm", "md"]} mb="12">
          {t("change.linkExpired.subheading")}
        </Text>

        <Button
          role="button"
          as={Link}
          href="/login"
          colorScheme="primary"
          loadingText={t("change.button.goToLogin")}
        >
          {t("change.button.backToLogin")}
        </Button>
      </>
    )
  }

  const validateConfirmPassword = async (
    confirmPassword: string,
    password: string,
  ): Promise<string> => {
    let error = ""

    await Yup.string()
      .test("passwords-match", t("change.validation.mismatch"), function (val) {
        return password === val
      })
      .validate(confirmPassword)
      .catch((e) => {
        error = e.message
      })

    return error
  }

  const validateForm = async (values: {
    newPassword: string
    confirmPassword: string
  }) => {
    const errors = {} as { newPassword: string; confirmPassword: string }

    const newPasswordError = await validatePassword(values.newPassword)
    if (newPasswordError) {
      errors.newPassword = newPasswordError
    }

    const confirmPasswordError = await validateConfirmPassword(
      values.newPassword,
      values.confirmPassword,
    )
    if (confirmPasswordError) {
      errors.confirmPassword = confirmPasswordError
    }

    return errors
  }

  const togglePasswordMask = (inputType: string) => {
    if (inputType == "newPassword") {
      setPasswordIsMasked(!passwordIsMasked)
    } else {
      setConfirmPasswordIsMasked(!confirmPasswordIsMasked)
    }
  }

  return (
    <>
      <Seo
        title={t("change.page.title")}
        description={t("change.page.description")}
      />
      <chakra.div as="main">
        <Logo
          pos="absolute"
          top={["24px", "48px"]}
          insetStart={["24px", "48px"]}
          height={["30px", "55px"]}
        />
        <LanguageSwitch
          pos="absolute"
          insetEnd={["24px", "48px"]}
          top={["24px", "48px"]}
        />

        <Container
          {...(!isMobileView && {
            h: "100vh",
          })}
          display="flex"
          flexDirection="column"
          maxW="sm"
          justifyContent="center"
          alignItems="center"
          margin="0 auto"
          textAlign="center"
          px={["10", "4"]}
          {...(isMobileView && {
            pt: "100px",
            pb: "7",
          })}
        >
          <>
            {isPasswordUpdated ? (
              showChangePasswordSuccess()
            ) : !isPasswordUpdated && !isLinkExpired ? (
              <>
                <Heading fontSize={["2xl", "3xl"]} mb="6">
                  {t("change.heading")}
                </Heading>

                <Text
                  color="gray.400"
                  fontSize={["sm", "lg"]}
                  mb={["120", "20"]}
                >
                  {t("change.subheading")}
                </Text>

                <Formik<{ newPassword: string; confirmPassword: string }>
                  initialValues={{
                    newPassword: "",
                    confirmPassword: "",
                  }}
                  validate={validateForm}
                  onSubmit={async (values) => {
                    try {
                      const params = {
                        password: values.newPassword,
                        email,
                        data,
                        expirydate,
                      }

                      await encryptBodyRequest(
                        params,
                        "/api/auth/change-password",
                        lang,
                      ).json<{
                        ok: boolean
                      }>()

                      toast({
                        title: t("change.toast.success.title"),
                        variant: "subtle",
                        status: "success",
                        isClosable: true,
                        position: "bottom",
                      })
                      event(ForgetPasswordChangeSuccessEvent)
                      setIsPasswordUpdated(true)
                    } catch (err) {
                      setIsLinkExpired(true)
                    }
                  }}
                >
                  {({ isSubmitting, values }) => (
                    <Form noValidate style={{ width: "100%" }}>
                      <InputControl
                        name="newPassword"
                        inputRightElementZIndex="overlay"
                        mb="4"
                        label={t("change.input.password.label")}
                        labelProps={{
                          fontSize: "sm",
                          fontWeight: "normal",
                          color: "gray.500",
                        }}
                        inputProps={{
                          type: passwordIsMasked ? "password" : "text",
                          placeholder: t("change.input.password.placeholder"),
                          autoFocus: true,
                        }}
                        validate={validatePassword}
                        customError={(error: string) => {
                          const showValidCheckmark = (term: string) =>
                            error.includes(term) ? (
                              <RemoveCircleIcon color="red.500" w="5" h="5" />
                            ) : (
                              <CheckCircleIcon color="green.500" w="5" h="5" />
                            )

                          return (
                            <Box
                              bg="gray.850"
                              rounded="md"
                              p="4"
                              mt="2"
                              textAlign="start"
                            >
                              <Text fontSize="sm" mb="5">
                                {t("change.validation.heading")}
                              </Text>
                              <Stack
                                fontSize="xs"
                                color="gray.500"
                                lineHeight="1"
                              >
                                <Stack isInline alignItems="center">
                                  {showValidCheckmark("lowercase")}
                                  <Text>
                                    {t("change.validation.lowercase")}
                                  </Text>
                                </Stack>
                                <Stack isInline alignItems="center">
                                  {showValidCheckmark("uppercase")}
                                  <Text>
                                    {t("change.validation.uppercase")}
                                  </Text>
                                </Stack>
                                <Stack isInline alignItems="center">
                                  {showValidCheckmark("digit")}
                                  <Text>{t("change.validation.numbers")}</Text>
                                </Stack>
                                <Stack isInline alignItems="center">
                                  {showValidCheckmark("special")}
                                  <Text>{t("change.validation.special")}</Text>
                                </Stack>
                                <Stack isInline alignItems="center">
                                  {showValidCheckmark("length")}
                                  <Text>{t("change.validation.length")}</Text>
                                </Stack>
                              </Stack>
                            </Box>
                          )
                        }}
                        inputRightElement={
                          <Button
                            variant="link"
                            colorScheme="primary"
                            onClick={() => {
                              togglePasswordMask("newPassword")
                            }}
                            _focus={{
                              backgroundColor: "none",
                            }}
                          >
                            {passwordIsMasked ? <EyeClosedIcon /> : <EyeIcon />}
                          </Button>
                        }
                      />

                      <InputControl
                        name="confirmPassword"
                        inputRightElementZIndex="overlay"
                        mb={["20", "12"]}
                        label={t("change.input.confirmPassword.label")}
                        labelProps={{
                          fontSize: "sm",
                          fontWeight: "normal",
                          color: "gray.500",
                        }}
                        inputProps={{
                          type: confirmPasswordIsMasked ? "password" : "text",
                          placeholder: t(
                            "change.input.confirmPassword.placeholder",
                          ),
                        }}
                        validate={(val) =>
                          validateConfirmPassword(val, values.newPassword)
                        }
                        inputRightElement={
                          <Button
                            variant="link"
                            colorScheme="primary"
                            onClick={() => {
                              togglePasswordMask("confirmPassword")
                            }}
                            _focus={{
                              backgroundColor: "none",
                            }}
                          >
                            {confirmPasswordIsMasked ? (
                              <EyeClosedIcon />
                            ) : (
                              <EyeIcon />
                            )}
                          </Button>
                        }
                      />

                      <Button
                        role="button"
                        isFullWidth
                        colorScheme="primary"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                        loadingText={t("change.button.changePassword")}
                        type="submit"
                      >
                        {t("change.button.changePassword")}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </>
            ) : (
              showLinkExpired()
            )}
          </>
        </Container>
      </chakra.div>
    </>
  )
}

export default ChangePasswordScreen
