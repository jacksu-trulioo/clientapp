import { useBreakpointValue } from "@chakra-ui/media-query"
import {
  Button,
  Center,
  CloseButton,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import { Form, Formik } from "formik"
import ky from "ky"
import NextLink from "next/link"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import * as Yup from "yup"

import {
  BackgroundImageContainer,
  EyeClosedIcon,
  EyeIcon,
  InputControl,
  LanguageSwitch,
  Link,
  Logo,
  Seo,
  SocialButtons,
  WarningIcon,
} from "~/components"
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import { Preference, User } from "~/services/mytfo/types"
import { getFeedbackCookieStatus } from "~/utils/clientUtils/feedbackCookieUtilities"
import {
  REDIRECT_CLIENT_TO,
  REDIRECT_ROLE,
} from "~/utils/constants/redirectPath"
import encryptBodyRequest from "~/utils/encryption"
import {
  ForgetPasswordEvent,
  LoginStartedEvent,
  LoginSuccessfullyEvent,
  SignUpStartEvent,
} from "~/utils/googleEvents"
import { login as ClientLogin, utmCapture } from "~/utils/googleEventsClient"
import { clientEvent, event, userIdFunc } from "~/utils/gtag"
import { isMinimumProfileCompleted } from "~/utils/isMinimumProfileCompleted"

function LoginScreen() {
  const { user, error } = useUser()
  const router = useRouter()
  const toast = useToast()
  const { t, lang } = useTranslation("auth")
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const [passwordIsMasked, setPasswordIsMasked] = React.useState(true)

  // Required to prevent duplicate toasts.
  const toastId = "toast-error"
  const toastIdRef = React.useRef(0)

  function close() {
    if (toastIdRef?.current) {
      toast.close(toastIdRef.current)
    }
  }

  // Redirect if authenticated.
  React.useEffect(() => {
    if (user && !error) {
      router.replace("/")
    }
  }, [error, router, user])

  const togglePasswordMask = () => {
    setPasswordIsMasked(!passwordIsMasked)
  }

  const validateEmail = async (value: string): Promise<string> => {
    let error = ""

    if (value?.includes("@")) {
      await Yup.string()
        .required(t("common:errors.required"))
        .email(t("common:errors.email"))
        .validate(value)
        .catch((e) => {
          error = e.message
        })
      return error
    } else {
      await Yup.string()
        .required(t("common:errors.required"))
        .max(25, t("common:errors.maxChar"))
        .validate(value)
        .catch((e) => {
          error = e.message
        })
      return error
    }
  }

  const validatePassword = React.useCallback(
    async (value: string): Promise<string> => {
      let error = ""

      await Yup.string()
        .required(t("common:errors.required"))
        .validate(value)
        .catch((e) => {
          error = e.message
        })
      return error
    },
    [t],
  )

  const validateForm = async (values: { email: string; password: string }) => {
    const errors = {} as { email: string; password: string }
    const emailError = await validateEmail(values.email)
    if (emailError) {
      errors.email = emailError
    }
    const passwordError = await validatePassword(values.password)
    if (passwordError) {
      errors.password = passwordError
    }
    return errors
  }
  let isAndroid =
    typeof window !== "undefined"
      ? Boolean(navigator.userAgent.match(/Android/i))
      : false

  return (
    <>
      <Seo
        title={t("login.page.title")}
        description={t("login.page.description")}
      />

      <BackgroundImageContainer as="main">
        <Flex
          direction={lang == "ar" ? "row-reverse" : "row"}
          width="full"
          justifyContent="space-between"
          p="10"
        >
          <NextLink passHref href={`https://www.tfoco.com/${lang}/`}>
            <a target="_blank">
              <Logo height={["30px", "55px"]} />
            </a>
          </NextLink>
          <LanguageSwitch />
        </Flex>

        <Container
          display="flex"
          flexDirection="column"
          maxW="sm"
          justifyContent="center"
          alignItems="center"
          margin="0 auto"
          {...(isMobileView && {
            pb: "7",
          })}
        >
          <Heading fontSize={["2xl", "3xl"]} mb="6">
            {t("login.heading")}
          </Heading>

          <Text
            color="gray.400"
            fontSize={["sm", "lg"]}
            mb="8"
            textAlign="center"
          >
            {t("login.subheading")}
          </Text>

          <Formik<{ email: string; password: string }>
            initialValues={{
              email: "",
              password: "",
            }}
            validate={validateForm}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={async (values) => {
              try {
                close()
                event(LoginStartedEvent)
                const res: { redirectTo?: string } = await encryptBodyRequest(
                  values,
                  "/api/auth/login",
                ).json()

                const preference: Preference = await ky
                  .get("/api/user/preference")
                  .json()

                const user: User = await ky.get("/api/user").json()
                userIdFunc(user?.userId)
                let profileCompleted = true

                if (
                  !user?.emailVerified &&
                  !user?.roles?.includes(REDIRECT_ROLE)
                ) {
                  await router.push("/verify")
                  return
                }

                if (
                  !user?.roles?.includes(REDIRECT_ROLE) &&
                  (!user.profile ||
                    (user?.profile && !isMinimumProfileCompleted(user.profile)))
                ) {
                  profileCompleted = false
                }

                const { query = {} } = router

                if (query.utm_source && res?.redirectTo == REDIRECT_CLIENT_TO) {
                  clientEvent(
                    utmCapture,
                    "Client UTM Captured",
                    JSON.stringify(query),
                    user?.mandateId as string,
                    user?.email,
                  )
                }

                let returnToPath
                let returnTo = query.returnTo as string

                if (returnTo) {
                  if (
                    res?.redirectTo == REDIRECT_CLIENT_TO &&
                    returnTo == "/"
                  ) {
                    returnToPath = "/client"
                  } else {
                    returnToPath = returnTo
                  }
                } else if (
                  res?.redirectTo === REDIRECT_CLIENT_TO &&
                  !returnTo
                ) {
                  returnToPath = "/client"
                } else {
                  returnToPath = profileCompleted ? "/" : "/onboarding/profile"
                }

                const path =
                  preference?.language === "AR"
                    ? "/ar" + returnToPath
                    : returnToPath
                if (res?.redirectTo == REDIRECT_CLIENT_TO) {
                  // NOTE: Checking & Setting Cookie
                  getFeedbackCookieStatus(
                    siteConfig.clientFeedbackSessionVariableName,
                  )
                  clientEvent(
                    ClientLogin,
                    "true",
                    "Client successfully login through credentials",
                    user?.mandateId as string,
                    user?.email,
                  )
                } else {
                  event(LoginSuccessfullyEvent)
                }
                if (lang.toUpperCase() !== preference?.language || returnTo) {
                  // if test cases fails uncomment this code
                  // await router.push(path)
                  window.location.replace(path)
                } else {
                  await router.push(path)
                }
              } catch (error) {
                // Show toast error.
                if (!toast.isActive(toastId)) {
                  clientEvent(
                    ClientLogin,
                    "false",
                    t("login.toast.error.title"),
                    user?.mandateId as string,
                    values.email,
                  )
                  toastIdRef.current = toast({
                    isClosable: true,
                    position: "bottom",
                    render: () => (
                      <HStack
                        py="3"
                        ps="10px"
                        pe="4"
                        bg="gray.800"
                        direction="row"
                        alignItems="center"
                        borderStart="6px solid var(--chakra-colors-red-500)"
                        borderRadius="2px"
                        role="alert"
                        justifyContent="center"
                      >
                        <HStack>
                          <WarningIcon w="20px" h="20px" color="red.500" />
                          <Text fontSize="md" color="white">
                            {t("login.toast.error.title")}
                          </Text>
                        </HStack>

                        <CloseButton onClick={close} />
                      </HStack>
                    ),
                  }) as number
                }
              }
            }}
          >
            {({ isSubmitting, values, setFieldError }) => (
              <Form noValidate style={{ width: "100%" }}>
                <InputControl
                  name="email"
                  mb="7"
                  inputProps={{
                    type: "email",
                    placeholder: t("login.input.email.placeholder"),
                  }}
                  label={t("login.input.email.placeholder")}
                  onChange={async () => {
                    const emailError = await validateEmail(values.email)
                    if (
                      emailError === t("common:errors.required") ||
                      !emailError
                    )
                      setFieldError("email", "")
                  }}
                />

                <InputControl
                  name="password"
                  inputRightElementZIndex="overlay"
                  inputProps={{
                    type: passwordIsMasked ? "password" : "text",
                    placeholder: t("login.input.password.placeholder"),
                  }}
                  label={t("login.input.password.placeholder")}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.value) {
                      setFieldError("password", "")
                    }
                  }}
                  inputRightElement={
                    <Button
                      variant="link"
                      colorScheme="primary"
                      onClick={togglePasswordMask}
                      _focus={{
                        backgroundColor: "none",
                      }}
                    >
                      {passwordIsMasked ? <EyeClosedIcon /> : <EyeIcon />}
                    </Button>
                  }
                />

                <Button
                  as={Link}
                  onClick={() => event(ForgetPasswordEvent)}
                  href="/password/forgot"
                  variant="link"
                  colorScheme="primary"
                  size="sm"
                  mt="4"
                  mb="8"
                >
                  {t("login.link.forgotPassword")}
                </Button>

                <Button
                  role="button"
                  isFullWidth
                  colorScheme="primary"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  loadingText={t("login.button.login")}
                  type="submit"
                  mb={["20", "10"]}
                >
                  {t("login.button.login")}
                </Button>

                <Grid
                  templateColumns="1fr 1.5fr 1fr"
                  alignItems="center"
                  mb="8"
                >
                  <Divider />
                  <Text color="gray.400" fontSize="sm" textAlign="center">
                    {t("login.text.social")}
                  </Text>
                  <Divider />
                </Grid>

                <Center
                  mb={{ base: "12", md: "14" }}
                  gridGap={{ base: 8, md: 5 }}
                >
                  <SocialButtons noAppleLogo={isAndroid} />
                </Center>

                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="baseline"
                >
                  <Text color="gray.400" fontSize="sm">
                    {t("login.text.noAccount")}
                  </Text>
                  <Button
                    as={Link}
                    onClick={() => event(SignUpStartEvent)}
                    href="/signup"
                    variant="link"
                    colorScheme="primary"
                    size="sm"
                  >
                    {t("login.link.signup")}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Container>
      </BackgroundImageContainer>
    </>
  )
}

export default LoginScreen
