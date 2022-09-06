import {
  Button,
  Center,
  chakra,
  Circle,
  Container,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { Form, Formik } from "formik"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import * as Yup from "yup"

import {
  BackgroundImageContainer,
  InputControl,
  LanguageSwitch,
  Link,
  Logo,
  MailIcon,
  Seo,
} from "~/components"
import encryptBodyRequest from "~/utils/encryption"
import { ForgetPasswordSendEmailVerificationEvent } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

const resendInterval = 10000

const ForgotPasswordScreen = () => {
  const { t, lang } = useTranslation("auth")
  const toast = useToast()
  const [isSending, setIsSending] = React.useState(false)
  const [isResendEnabled, setIsResendEnabled] = React.useState(true)
  const isMobileView = useBreakpointValue({ base: true, md: false })

  let timerId: ReturnType<typeof setTimeout>

  const setResendTimeout = () => {
    timerId = setTimeout(() => setIsResendEnabled(false), resendInterval)
  }

  const handleResendVerification = async (email: string) => {
    try {
      setIsResendEnabled(true)

      setResendTimeout()

      setIsSending(true)

      await encryptBodyRequest(
        { email },
        "/api/auth/request-password-reset",
        lang,
      ).json<{
        ok: boolean
      }>()

      toast({
        title: t("forgot.toast.success.title"),
        variant: "subtle",
        status: "success",
        isClosable: true,
        position: "bottom",
      })
    } catch (error) {
      const toastId = "error"

      if (!toast.isActive(toastId)) {
        toast({
          title: t("forgot.toast.error.title"),
          status: "error",
          isClosable: true,
          variant: "subtle",
          position: "bottom",
          id: toastId,
        })
      }
    } finally {
      setIsSending(false)
    }
  }

  // Prevent "resend" action from being triggered until after 10 seconds has passed on page load.
  React.useEffect(() => {
    setResendTimeout()
    return () => clearTimeout(timerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Seo
        title={t("forgot.page.title")}
        description={t("forgot.page.description")}
      />

      <BackgroundImageContainer as="main">
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
          maxW={["sm", "md"]}
          justifyContent="center"
          alignItems="center"
          {...(!isMobileView && {
            margin: "0 auto",
          })}
          {...(isMobileView && {
            pb: "7",
            mt: "150px",
          })}
        >
          <Formik<{ email: string }>
            initialValues={{
              email: "",
            }}
            validate={(values) => {
              const errors: { email?: string } = {}

              if (values.email?.includes("@")) {
                Yup.string()
                  .required(t("common:errors.required"))
                  .email(t("common:errors.email"))
                  .validate(values.email)
                  .catch((e) => {
                    errors.email = e.message
                  })
                return errors
              } else {
                Yup.string()
                  .required(t("common:errors.required"))
                  .max(25, t("common:errors.maxChar"))
                  .validate(values.email)
                  .catch((e) => {
                    errors.email = e.message
                  })
                return errors
              }
            }}
            // validationSchema={Yup.object({
            //   email: Yup.string()
            //     .email(t("common:errors.email"))
            //     .required(t("common:errors.required")),
            // })}
            onSubmit={async (values, { setStatus }) => {
              try {
                event(ForgetPasswordSendEmailVerificationEvent)
                await encryptBodyRequest(
                  values,
                  "/api/auth/request-password-reset",
                  lang,
                ).json<{
                  ok: boolean
                  response: Record<string, unknown>
                }>()

                setStatus("submitted")

                toast({
                  title: t("forgot.toast.success.title"),
                  variant: "subtle",
                  status: "success",
                  isClosable: true,
                  position: "bottom",
                })
              } catch (error) {
                const toastId = "error"

                if (!toast.isActive(toastId)) {
                  toast({
                    title: t("forgot.toast.error.title"),
                    status: "error",
                    isClosable: true,
                    variant: "subtle",
                    position: "bottom",
                    id: toastId,
                  })
                }
              }
            }}
          >
            {({ isSubmitting, status, values }) => {
              return status && status === "submitted" ? (
                <Flex direction="column" h="100vh">
                  <Container flex="1">
                    <Center h="full">
                      <VStack spacing="8" textAlign="center">
                        <Circle bgColor="gray.800" size="24">
                          <MailIcon color="primary.500" w="62px" h="62px" />
                        </Circle>

                        <Heading fontSize={["2xl", "3xl"]} mb="6">
                          {t("forgot.emailSentSuccess.heading")}
                        </Heading>

                        <Trans
                          i18nKey="auth:forgot.emailSentSuccess.subheading"
                          components={[
                            <Text
                              key="0"
                              maxW="md"
                              color="gray.400"
                              fontSize={["sm", "lg"]}
                            />,
                            <chakra.strong key="1" />,
                          ]}
                          values={{
                            email: values.email,
                          }}
                        />

                        <Stack
                          direction={["column", "row"]}
                          fontSize={["xs", "sm"]}
                        >
                          <Text maxW={["xs", "2xl"]} color="gray.500">
                            {t("forgot.text.didNotReceiveEmail")}
                          </Text>
                          <Button
                            variant="link"
                            colorScheme="primary"
                            size="sm"
                            onClick={() =>
                              handleResendVerification(values.email)
                            }
                            loadingText={t("forgot.link.resend")}
                            isLoading={isSending}
                            spinnerPlacement="end"
                            disabled={isResendEnabled}
                          >
                            {t("forgot.link.resend")}
                          </Button>
                        </Stack>
                      </VStack>
                    </Center>
                  </Container>

                  <Container>
                    <Divider />
                    <Center h="full" py="14">
                      <Stack direction={["column", "row"]} fontSize="sm">
                        <Center>
                          <Button
                            as={Link}
                            href="/login"
                            variant="link"
                            colorScheme="primary"
                            size="sm"
                          >
                            {t("forgot.link.backToLogin")}
                          </Button>
                        </Center>
                      </Stack>
                    </Center>
                  </Container>
                </Flex>
              ) : (
                <Form noValidate style={{ width: "100%" }}>
                  <Heading fontSize={["2xl", "3xl"]} mb="6" textAlign="center">
                    {t("forgot.heading")}
                  </Heading>

                  <Text
                    color="gray.400"
                    fontSize={["sm", "lg"]}
                    mb={["14", "20"]}
                    textAlign="center"
                  >
                    {t("forgot.subheading")}
                  </Text>

                  <InputControl
                    id="email"
                    name="email"
                    label={t("forgot.input.email.label")}
                    inputProps={{
                      type: "email",
                      placeholder: t("forgot.input.email.placeholder"),
                    }}
                    mb="12"
                  />

                  <Button
                    role="button"
                    isFullWidth
                    colorScheme="primary"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    loadingText={t("forgot.button.send")}
                    type="submit"
                    mb={["14", "10"]}
                  >
                    {t("forgot.button.send")}
                  </Button>
                  <Center>
                    <Button
                      as={Link}
                      href="/login"
                      variant="link"
                      colorScheme="primary"
                      size="sm"
                    >
                      {t("forgot.link.backToLogin")}
                    </Button>
                  </Center>
                </Form>
              )
            }}
          </Formik>
        </Container>
      </BackgroundImageContainer>
    </>
  )
}

export default ForgotPasswordScreen
