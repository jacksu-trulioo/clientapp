import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/layout"
import { Button, FormControl, FormLabel, useToast } from "@chakra-ui/react"
import { Form, Formik, FormikProps } from "formik"
import ky, { HTTPError } from "ky"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import ReactCountryFlag from "react-country-flag"
import { OptionTypeBase } from "react-select"
import { useSWRConfig } from "swr"
import useSWRImmutable from "swr/immutable"
import * as Yup from "yup"

import {
  BackgroundImageContainer,
  BoxStepper,
  InputControl,
  LanguageSwitch,
  Logo,
  PageContainer,
  SelectControl,
  Seo,
} from "~/components"
import MobileVerification from "~/components/OnboardingProfile/MobileVerification"
import {
  useOnboardingProfileWizard,
  withOnboardingProfileWizard,
} from "~/components/OnboardingProfile/OnboardingProfileContext"
import StepLayout from "~/components/OnboardingProfile/StepLayout"
import { useCountryList, usePhoneCountryCodeList } from "~/hooks/useList"
import { useUser } from "~/hooks/useUser"
import {
  CountryCode,
  ErrorJsonResponse,
  Location,
  Profile,
} from "~/services/mytfo/types"
import { alphaEnglishAllowedRegex } from "~/utils/constants/regex"
import countryCodes from "~/utils/data/countryCodes"
import {
  profileOnboardingEvent,
  SignUpRegisterSuccessfullyEvent,
} from "~/utils/googleEvents"
import { event, twitterEvent } from "~/utils/gtag"
import { isMinimumProfileCompleted } from "~/utils/isMinimumProfileCompleted"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function OnboardingProfileScreen() {
  const { t, lang } = useTranslation("profile")
  const countryList = useCountryList()
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const phoneCountryCodeList = usePhoneCountryCodeList()
  const { user, isLoading } = useUser()
  const minimumProfileCompleted = isMinimumProfileCompleted(user?.profile)
  const { next, step } = useOnboardingProfileWizard()
  const toast = useToast()

  const { data: locationData, error: locationError } =
    useSWRImmutable<Location>("/api/user/location")
  const isLocationLoading = !locationData && !locationError

  const direction = lang === "ar" ? "rtl" : "ltr"
  const phoneNumberRef = React.useRef<HTMLInputElement>(null)

  const getInitialFlag = (phoneCountryCode?: string) => {
    if (!phoneCountryCode) {
      return undefined
    }
    const countryCodeoption = phoneCountryCodeList.find(
      (option) => option.value === phoneCountryCode,
    )
    return countryCodeoption?.label?.split(" ")?.[0]
  }

  const getInitialPhoneCountryCode = (countryCode?: string) => {
    if (!countryCode) {
      return undefined
    }
    const countryCodeoption = phoneCountryCodeList.find((option) =>
      option.label.startsWith(countryCode),
    )
    return countryCodeoption?.label?.split(" ")?.[1]
  }

  if (minimumProfileCompleted && user?.phoneNumberVerified) {
    router.push("/")
  }

  React.useEffect(() => {
    twitterEvent("onboarding")
  }, [])

  if (isLoading || isLocationLoading) {
    return (
      <BackgroundImageContainer>
        <PageContainer
          isLoading={true}
          as="section"
          maxW="full"
          px="0"
          mt={{ base: 8, md: 8, lg: 0 }}
        ></PageContainer>
      </BackgroundImageContainer>
    )
  }

  return (
    <>
      <Seo
        title={t("onboarding.page.title")}
        description={t("onboarding.page.description")}
      />

      <BackgroundImageContainer as="main">
        <Flex
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          width="full"
          position="fixed"
          zIndex="sticky"
          bg="transparent"
          p={["6", "12"]}
          pb={["0", "0"]}
        >
          <Logo height={["30px", "55px"]} />
          <BoxStepper
            currentStep={step + 1}
            steps={3}
            mr={{ base: 0, md: 16 }}
          />
          <LanguageSwitch />
        </Flex>

        {
          <Flex direction="column" pt="44">
            <Container flex="1">
              <Center h="full">
                <VStack spacing="4" textAlign="center" maxW="full">
                  <Heading fontSize={["2xl", "3xl"]} size="xl" color="white">
                    {t(`onboarding.heading.${step}`)}
                  </Heading>

                  <Text
                    maxW={["xs", "sm"]}
                    color="gray.500"
                    fontSize={["sm", "lg"]}
                  >
                    {t(`onboarding.subheading.${step}`, {
                      mobileNumber: user?.profile?.phoneNumber?.slice(-4) || "",
                    })}
                  </Text>
                  <StepLayout>
                    <Formik<Profile>
                      initialValues={{
                        firstName: user?.profile?.firstName || "",
                        lastName: user?.profile?.lastName || "",
                        countryOfResidence:
                          user?.profile?.countryOfResidence ||
                          locationData?.countryCode,
                        phoneCountryCode:
                          user?.profile?.phoneCountryCode ||
                          getInitialPhoneCountryCode(
                            locationData?.countryCode,
                          ) ||
                          "",
                        phoneNumber: user?.profile?.phoneNumber || "",
                        flagName:
                          getInitialFlag(user?.profile?.phoneCountryCode) ||
                          locationData?.countryCode ||
                          "",
                      }}
                      validationSchema={Yup.object({
                        firstName: Yup.string()
                          .matches(alphaEnglishAllowedRegex, {
                            excludeEmptyString: true,
                            message: t("common:errors.alphaEnglishAllowed"),
                          })
                          .max(50, t("common:errors.maxChar"))
                          .required(t("common:errors.required")),
                        flagName: Yup.string(),
                        lastName: Yup.string()
                          .matches(alphaEnglishAllowedRegex, {
                            excludeEmptyString: true,
                            message: t("common:errors.alphaEnglishAllowed"),
                          })
                          .max(50, t("common:errors.maxChar"))
                          .required(t("common:errors.required")),
                        countryOfResidence: Yup.mixed<CountryCode>()
                          // oneOf should accept readonly array.
                          // https://github.com/jquense/yup/issues/1298
                          .oneOf([...countryCodes], t("common:errors.required"))
                          .required(t("common:errors.required"))
                          .nullable(),
                        phoneCountryCode: Yup.string().required(
                          t("common:errors.required"),
                        ),
                        phoneNumber: Yup.string()
                          .matches(/^[0-9]*$/, t("common:errors.numberAllowed"))
                          .required(t("common:errors.required"))
                          .when("phoneCountryCode", {
                            is: (value: string) => {
                              return value === "+966" || value === "+971"
                            },

                            then: Yup.string()
                              .required(t("common:errors.required"))
                              .max(
                                9,
                                t("common:errors.phoneNumberLength", {
                                  digit: 9,
                                }),
                              )
                              .min(
                                9,
                                t("common:errors.phoneNumberLength", {
                                  digit: 9,
                                }),
                              )
                              .nullable(),
                          })
                          .when("phoneCountryCode", {
                            is: (value: string) => {
                              return (
                                value === "+974" ||
                                value === "+965" ||
                                value === "+968" ||
                                value === "+973"
                              )
                            },
                            then: Yup.string()
                              .required(t("common:errors.required"))
                              .max(
                                8,
                                t("common:errors.phoneNumberLength", {
                                  digit: 8,
                                }),
                              )
                              .min(
                                8,
                                t("common:errors.phoneNumberLength", {
                                  digit: 8,
                                }),
                              )
                              .nullable(),
                          })
                          .when("phoneCountryCode", {
                            is: (value: string) => {
                              return (
                                value !== "+966" &&
                                value !== "+965" &&
                                value !== "+973" &&
                                value !== "+968" &&
                                value !== "+974" &&
                                value !== "+971"
                              )
                            },
                            then: Yup.string()
                              .required(t("common:errors.required"))
                              .max(
                                15,
                                t("common:errors.phoneNumberLengthMax", {
                                  digit: 15,
                                }),
                              )
                              .nullable(),
                          }),
                      })}
                      onSubmit={async (values: Profile) => {
                        try {
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          const { flagName, ...rest } = values
                          const newJsonObj = { ...rest }
                          twitterEvent("onboard-on-continue")
                          event(SignUpRegisterSuccessfullyEvent)
                          event(profileOnboardingEvent)
                          await mutate(
                            "/api/user",
                            async () => {
                              return ky
                                .post("/api/user/profile", {
                                  json: newJsonObj,
                                })
                                .json<Profile>()
                            },
                            true,
                          )

                          await ky.post("/api/auth/send-otp", {
                            json: {
                              phoneNumber: `${values.phoneCountryCode}${values.phoneNumber}`,
                            },
                          })
                          next()
                        } catch (e) {
                          if ((e as HTTPError).name === "HTTPError") {
                            const res: ErrorJsonResponse = await (
                              e as HTTPError
                            ).response.json()
                            if (
                              res?.message?.includes(
                                "not a valid phone number",
                              ) ||
                              res?.message?.includes("not a mobile number") ||
                              res?.message?.includes(
                                "String does not match pattern",
                              )
                            ) {
                              toast({
                                title: t("onboarding.error.invalidNumber"),
                                variant: "subtle",
                                status: "error",
                                isClosable: true,
                                position: "bottom",
                              })
                            } else {
                              toast({
                                title: t("onboarding.error.generic"),
                                variant: "subtle",
                                status: "error",
                                isClosable: true,
                                position: "bottom",
                              })
                            }
                          } else {
                            toast({
                              title: t("onboarding.error.generic"),
                              variant: "subtle",
                              status: "error",
                              isClosable: true,
                              position: "bottom",
                            })
                          }
                        }
                      }}
                    >
                      {(formikProps: FormikProps<Profile>) => (
                        <Form
                          style={{ width: "100%", marginTop: "32px" }}
                          autoComplete="off"
                        >
                          <VStack
                            spacing={["6", "8"]}
                            alignItems="start"
                            maxW="sm"
                          >
                            <Flex
                              direction="row"
                              justifyContent="space-between"
                              w="full"
                            >
                              <InputControl
                                width="48%"
                                name="firstName"
                                label={t("onboarding.input.firstName.label")}
                                inputProps={{
                                  placeholder: t(
                                    "onboarding.input.firstName.label",
                                  ),
                                  "aria-label": t(
                                    "onboarding.input.firstName.label",
                                  ),
                                  maxLength: 100,
                                  disabled: !!user?.profile?.firstName,
                                }}
                              />

                              <InputControl
                                width="48%"
                                name="lastName"
                                label={t("onboarding.input.lastName.label")}
                                inputProps={{
                                  placeholder: t(
                                    "onboarding.input.lastName.label",
                                  ),
                                  "aria-label": t(
                                    "onboarding.input.lastName.label",
                                  ),
                                  maxLength: 100,
                                  disabled: !!user?.profile?.lastName,
                                }}
                              />
                            </Flex>

                            <Box w="full">
                              <SelectControl
                                name="countryOfResidence"
                                label={t(
                                  "onboarding.select.countryOfResidence.label",
                                )}
                                selectProps={{
                                  placeholder: t(
                                    "onboarding.select.countryOfResidence.placeholder",
                                  ),
                                  options: countryList,
                                  onChange: (option: OptionTypeBase) => {
                                    formikProps.setFieldValue(
                                      "countryOfResidence",
                                      option.value,
                                    )
                                    const phoneCountryCodeOption =
                                      phoneCountryCodeList.find((pccl) =>
                                        pccl.label.startsWith(option.value),
                                      )
                                    formikProps.setFieldValue(
                                      "phoneCountryCode",
                                      phoneCountryCodeOption?.value,
                                    )
                                    formikProps.setFieldValue(
                                      "flagName",
                                      option?.value,
                                    )
                                    phoneNumberRef?.current?.focus()
                                  },
                                }}
                                isDisabled={!!user?.profile?.countryOfResidence}
                              />
                            </Box>
                            <FormControl>
                              <FormLabel
                                color="gray.400"
                                display="flex"
                                alignItems="center"
                                pb="0"
                                mb="0"
                              >
                                {t("onboarding.select.phoneCountryCode.label")}
                              </FormLabel>
                              <Stack
                                alignItems="flex-start"
                                direction={
                                  direction === "rtl" ? "row-reverse" : "row"
                                }
                              >
                                <SelectControl
                                  name="phoneCountryCode"
                                  selectProps={{
                                    placeholder: t(
                                      "onboarding.select.phoneCountryCode.placeholder",
                                    ),
                                    options: phoneCountryCodeList,
                                    blurInputOnSelect: true,
                                    onChange: (option: OptionTypeBase) => {
                                      const countryCodeValue =
                                        option?.label.split(" ")[0]

                                      formikProps.setFieldValue(
                                        "flagName",
                                        countryCodeValue,
                                      )

                                      formikProps.setFieldValue(
                                        "phoneCountryCode",
                                        option?.value,
                                      )
                                    },
                                  }}
                                  inputLeftElement={
                                    formikProps?.values?.flagName && (
                                      <ReactCountryFlag
                                        countryCode={
                                          formikProps?.values?.flagName
                                        }
                                        svg
                                        title={formikProps?.values?.flagName}
                                        style={{
                                          width: "20px",
                                          height: "30px",
                                        }}
                                      />
                                    )
                                  }
                                  isDisabled={user?.phoneNumberVerified}
                                  w="80%"
                                />
                                <InputControl
                                  name="phoneNumber"
                                  pt="2"
                                  inputProps={{
                                    "aria-label": "phone number",
                                    disabled: !!user?.phoneNumberVerified,
                                    ref: phoneNumberRef,
                                  }}
                                />
                              </Stack>
                            </FormControl>
                          </VStack>

                          <Text my="6" color="gray.600" fontSize="sm" maxW="sm">
                            {t("onboarding.text.onboardingOtp")}
                          </Text>

                          <Box display="block" maxW="sm">
                            <Button
                              isFullWidth
                              colorScheme="primary"
                              isLoading={formikProps.isSubmitting}
                              disabled={formikProps.isSubmitting}
                              loadingText={t(
                                "onboarding.button.sendVerification",
                              )}
                              type="submit"
                            >
                              {t("onboarding.button.sendVerification")}
                            </Button>
                          </Box>
                        </Form>
                      )}
                    </Formik>
                    <MobileVerification />
                  </StepLayout>
                </VStack>
              </Center>
            </Container>
          </Flex>
        }
      </BackgroundImageContainer>
    </>
  )
}

export default withOnboardingProfileWizard(
  withPageAuthRequired(OnboardingProfileScreen),
)
