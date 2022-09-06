import { Divider } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/media-query"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal"
import {
  Box,
  Button,
  chakra,
  Container,
  Flex,
  Heading,
  ListItem,
  ModalFooter,
  OrderedList,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { Form, Formik } from "formik"
import NextLink from "next/link"
import { useRouter } from "next/router"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import LinkedInTag from "react-linkedin-insight"
import * as Yup from "yup"

import {
  BackgroundImageContainer,
  Checkbox,
  CheckCircleIcon,
  EyeClosedIcon,
  EyeIcon,
  InputControl,
  LanguageSwitch,
  LeftArrowIcon,
  Link,
  RemoveCircleIcon,
  Seo,
  SignUpLogo,
} from "~/components"
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import encryptBodyRequest from "~/utils/encryption"
import { SignUpAcceptedTermsConditionEvent } from "~/utils/googleEvents"
import { event, twitterEvent } from "~/utils/gtag"
import { validatePassword } from "~/utils/validatePassword"

type SignUpInput = {
  email: string

  password: string
}

function SignupScreen() {
  const { user, error } = useUser()

  const router = useRouter()

  const { t, lang } = useTranslation("auth")

  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const isMobileView = useBreakpointValue({ base: true, md: false })

  const { tfoWebsite } = siteConfig

  const [passwordIsMasked, setPasswordIsMasked] = React.useState(true)

  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true })

  const [tosChecked, setTosChecked] = React.useState(false)

  const emailRef = React.useRef<HTMLInputElement>(null)

  const togglePasswordMask = () => {
    setPasswordIsMasked(!passwordIsMasked)
  }

  React.useEffect(() => {
    twitterEvent("signup")
  }, [])

  // Required to prevent duplicate toasts.

  const toastId = "toast-error"

  const validateEmail = React.useCallback(
    async (value: string): Promise<string> => {
      let error = ""

      await Yup.string()

        .email(t("common:errors.email"))

        .required(t("common:errors.required"))

        .validate(value)

        .catch((e) => {
          error = e.message
        })

      return error
    },

    [t],
  )

  const handleAcceptAll = () => {
    setTosChecked(true)

    onClose()
  }

  const validateForm = async (values: SignUpInput) => {
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

  // Redirect if authenticated.

  React.useEffect(() => {
    if (user && !error) {
      router.replace("/")
    }
  }, [error, router, user])

  React.useEffect(() => {
    setTimeout(() => {
      emailRef?.current?.focus()
    }, 500)
  }, [])

  return (
    <>
      <Seo
        title={t("signup.page.title")}
        description={t("signup.page.description")}
      />

      <Flex direction={{ base: "column", md: "row", lg: "row" }} w="full">
        <BackgroundImageContainer
          as="main"
          hideBgImage={false}
          bgColor={"gray.900"}
          display="flex"
          flexDirection="column"
          flex={1}
        >
          <Flex
            direction={lang == "ar" ? "row-reverse" : "row"}
            width="full"
            justifyContent="space-between"
            px="4"
            pt="4"
            pb="0"
            mb="12"
          >
            <Flex alignItems="center" dir="ltr">
              <LeftArrowIcon
                me="4"
                w={6}
                h={6}
                color="primary.500"
                onClick={() => {
                  router.push("/signup")
                }}
              />

              <Divider orientation="vertical" me="4" color="#4D4D4D" />

              <NextLink passHref href={`https://www.tfoco.com/${lang}/`}>
                <a target="_blank">
                  <SignUpLogo height="7" />
                </a>
              </NextLink>
            </Flex>

            <LanguageSwitch />
          </Flex>

          <Container
            display="flex"
            flexDirection="column"
            maxW="sm"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            margin="0 auto"
            h="90vh"
          >
            <Text fontSize="xl" mb="3" color="gray.300">
              {t("signup.heading.rightPane")}
            </Text>

            <Text fontSize="sm" mb="6" color="gray.400">
              {t("signup.heading.rightPaneSubheading")}
            </Text>

            <Formik<SignUpInput>
              initialValues={{
                email: "",

                password: "",
              }}
              validate={validateForm}
              onSubmit={async (values) => {
                LinkedInTag.track("8782993")

                twitterEvent("boot-up")

                const payload = {
                  ...values,

                  signupUrl:
                    encodeURIComponent(window?.location?.toString()) || "",
                }

                try {
                  event(SignUpAcceptedTermsConditionEvent)

                  await encryptBodyRequest(
                    payload,

                    "/api/auth/signup",

                    lang,
                  ).json()

                  return router.replace("/verify")
                } catch (error) {
                  // Show toast error.

                  if (!toast.isActive(toastId)) {
                    toast({
                      id: toastId,

                      title: t("signup.toast.error.title"),

                      variant: "subtle",

                      status: "error",

                      isClosable: true,

                      position: "bottom",
                    })
                  }
                }
              }}
            >
              {({ isSubmitting, isValid, dirty, touched, values }) => (
                <Form noValidate style={{ width: "100%" }}>
                  <InputControl
                    id="email"
                    name="email"
                    mb="8"
                    inputProps={{
                      type: "email",

                      placeholder: t("signup.input.email.placeholder"),

                      ref: emailRef,
                    }}
                  />

                  <InputControl
                    name="password"
                    inputRightElementZIndex="overlay"
                    mb="8"
                    inputProps={{
                      type: passwordIsMasked ? "password" : "text",

                      placeholder: t("signup.input.password.placeholder"),
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
                    customError={(error: string) => {
                      const showValidCheckmark = (term: string) =>
                        error.includes(term) ? (
                          <RemoveCircleIcon color="red.500" w="5" h="5" />
                        ) : (
                          <CheckCircleIcon color="green.500" w="5" h="5" />
                        )

                      return (
                        (touched?.password || values?.password) && (
                          <Box
                            bg="gray.850"
                            rounded="md"
                            p="4"
                            mt="2"
                            textAlign="start"
                            zIndex="modal"
                            position="absolute"
                            width="inherit"
                          >
                            <Text fontSize="sm" mb="5">
                              {t("signup.input.validation.heading")}
                            </Text>

                            <Stack
                              fontSize="xs"
                              color="gray.500"
                              lineHeight="1"
                            >
                              <Stack isInline alignItems="center">
                                {showValidCheckmark("lowercase")}

                                <Text>
                                  {t("signup.input.validation.lowercase")}
                                </Text>
                              </Stack>

                              <Stack isInline alignItems="center">
                                {showValidCheckmark("uppercase")}

                                <Text>
                                  {t("signup.input.validation.uppercase")}
                                </Text>
                              </Stack>

                              <Stack isInline alignItems="center">
                                {showValidCheckmark("digit")}

                                <Text>
                                  {t("signup.input.validation.numbers")}
                                </Text>
                              </Stack>

                              <Stack isInline alignItems="center">
                                {showValidCheckmark("special")}

                                <Text>
                                  {t("signup.input.validation.special")}
                                </Text>
                              </Stack>

                              <Stack isInline alignItems="center">
                                {showValidCheckmark("length")}

                                <Text>
                                  {t("signup.input.validation.length")}
                                </Text>
                              </Stack>
                            </Stack>
                          </Box>
                        )
                      )
                    }}
                  />

                  <Flex gridGap="11px">
                    <Checkbox
                      aria-label="termsOfService"
                      size="sm"
                      borderColor="primary.500"
                      mb="12"
                      isChecked={tosChecked}
                      onChange={(e) => setTosChecked(e.target.checked)}
                    />

                    <Text
                      fontSize="xs"
                      color="gray.400"
                      ms="0"
                      ps="0"
                      textAlign="start"
                    >
                      {t("signup.checkbox.label")}

                      <chakra.span
                        color="primary.500"
                        textDecoration="underline"
                        onClick={onOpen}
                        cursor="pointer"
                        ms="1"
                      >
                        {t("signup.checkbox.termsService")}
                      </chakra.span>
                    </Text>
                  </Flex>

                  <Button
                    isFullWidth
                    colorScheme="primary"
                    isLoading={isSubmitting}
                    disabled={
                      isSubmitting || !(isValid && dirty) || !tosChecked
                    }
                    loadingText={t("signup.button.submit")}
                    mb="8"
                    name="sign-up"
                    type="submit"
                  >
                    {t("signup.button.submit")}
                  </Button>

                  <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    size="xl"
                    scrollBehavior="inside"
                    autoFocus={false}
                    returnFocusOnClose={false}
                  >
                    <ModalOverlay />

                    <ModalContent
                      sx={{
                        ...(isMobileView && {
                          "& > div": {
                            px: "7",
                          },
                        }),

                        mx: "3",
                      }}
                      maxW={{ base: "full", md: "80%" }}
                    >
                      <ModalHeader>
                        <SignUpLogo
                          pos="absolute"
                          top={["12px", "12px"]}
                          insetStart={["24px", "24px"]}
                          height={["7", "7"]}
                        />

                        <Heading
                          fontSize={{ base: "lg", md: "xl" }}
                          color="white"
                          textAlign={{ base: "center", md: "start" }}
                        >
                          {t("signup.tos.title")}
                        </Heading>
                      </ModalHeader>

                      <ModalCloseButton />

                      <ModalBody
                        name="tos"
                        textAlign="start"
                        mb="3"
                        sx={{
                          ol: {
                            counterReset: "--item",
                          },

                          "ol.first_level li:before": {
                            content: " counters(--item, '.') '. '   ",

                            counterIncrement: "--item",

                            right: lang === "ar" && "-20px",

                            color: "white",
                          },

                          "ol.second_level li:before": {
                            content: " counters(--item, '.') ' '   ",

                            counterIncrement: "--item",

                            right: lang === "ar" && "-20px",

                            color: "gray.400",
                          },

                          "ol li": {
                            display: "block",

                            position: "relative",
                          },

                          "ol.third_level": {
                            counterReset: "--item",
                          },

                          "ol.third_level li:before": {
                            content: " '('  counter(--item, lower-alpha) ')' ",

                            counterIncrement: "--item",

                            position: "absolute",

                            me: "100%",

                            right: "1",

                            color: "gray.400",
                          },
                        }}
                      >
                        <style jsx global>{`
                          --item: 1;
                        `}</style>

                        <Trans
                          i18nKey="auth:signup.tos.content"
                          components={[
                            <Box key="0" mb="6" />,

                            <Text key="1" my="1" />,

                            <OrderedList
                              key="2"
                              my="2"
                              className="first_level"
                            />,

                            <ListItem key="3" my="2" />,

                            <OrderedList key="4" className="second_level" />,

                            <ListItem key="5" my="2" color="contrast.200" />,

                            <OrderedList
                              key="6"
                              className="third_level"
                              ms="10"
                              my="2"
                            />,

                            <ListItem key="7" color="gray.400" />,

                            <chakra.span key="8" fontWeight="extrabold" />,

                            <Text
                              key="9"
                              fontSize={{ base: "sm", md: "md" }}
                              color="gray.400"
                              mb="4"
                            />,

                            <Divider
                              key="10"
                              orientation="horizontal"
                              borderColor="gray.850"
                              border="1px solid"
                              mb="1"
                              mt="1"
                            />,

                            <Text
                              key="11"
                              fontSize={{ base: "sm", md: "md" }}
                              color="gray.400"
                              mb="3"
                            />,

                            <chakra.span
                              key="12"
                              color="primary.500"
                              fontSize={{ base: "sm", md: "md" }}
                            />,

                            <Text
                              key="13"
                              fontSize={{ base: "md", md: "lg" }}
                              fontWeight="extrabold"
                              my="3"
                              color="contrast.200"
                            />,

                            <Text
                              key="14"
                              fontSize={{ base: "md", md: "lg" }}
                              fontWeight="extrabold"
                              textAlign="center"
                              mt="3"
                              mb="4"
                              color="contrast.200"
                            />,

                            <chakra.span
                              key="15"
                              fontSize={{ base: "md", md: "lg" }}
                              fontWeight="extrabold"
                              color="contrast.200"
                            />,

                            <Text key="16" color="contrast.200" />,

                            <Link
                              key="17"
                              color="primary"
                              href={tfoWebsite + lang}
                              target="_blank"
                              fontSize={{ base: "sm", md: "md" }}
                            />,
                          ]}
                        />

                        <Divider />

                        <Box mt="6">
                          <Text
                            fontSize={{ base: "md", md: "lg" }}
                            fontWeight="extrabold"
                            color="contrast.200"
                            mb="2"
                          >
                            {t("signup.contactUs.heading")}
                          </Text>

                          <Text mb="2">{t("signup.contactUs.subheading")}</Text>

                          <Text>{t("signup.contactUs.services")}</Text>

                          <Text color="primary.500" fontSize="md">
                            {t("signup.contactUs.email")}
                          </Text>
                        </Box>
                      </ModalBody>

                      <Divider />

                      <ModalFooter w="full" minHeight="fit-content">
                        <Flex
                          justifyContent={isDesktop ? "space-between" : ""}
                          direction={{ base: "column-reverse", md: "row" }}
                          w="full"
                          alignItems={isMobileView ? "center" : ""}
                        >
                          <Button
                            variant="ghost"
                            colorScheme="primary"
                            onClick={onClose}
                            name="cancel"
                            {...(isMobileView && {
                              width: "50%",
                            })}
                          >
                            {t("common:button.cancel")}
                          </Button>

                          <Button
                            colorScheme="primary"
                            onClick={handleAcceptAll}
                            name="accept-all"
                            {...(isMobileView && {
                              mb: "2",

                              width: "50%",
                            })}
                          >
                            {t("common:button.acceptAll")}
                          </Button>
                        </Flex>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </Form>
              )}
            </Formik>
          </Container>
        </BackgroundImageContainer>
      </Flex>
    </>
  )
}

export default SignupScreen
