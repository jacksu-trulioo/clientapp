import {
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/layout"
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  PinInput,
  PinInputField,
  Portal,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import { Form, Formik, FormikProps } from "formik"
import ky from "ky"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR, { mutate } from "swr"

import { useHijiriMonthList, useHijiriYearList } from "~/hooks/useList"
import {
  Gender,
  KycAbsherCitizenInfo,
  KycPersonalInformation,
  KycSendOtpResponse,
  KycValidateOtpResponse,
  Preference,
} from "~/services/mytfo/types"
import { CompleteNationalSsoOtpPage } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

import { InputControl, SelectControl, Toast } from ".."
import KycLocationConsentModal from "./KycLocationConsentModal"
import { usePersonalInfoSSOSchema } from "./KycPersonalInformation.schema"
import { useKycPersonalInformationFormContext } from "./KycPersonalInformationFormContext"

const KycPersonalInformationSSOId = React.forwardRef<HTMLDivElement, unknown>(
  function KycPersonalInfoNationalId(_props, _ref) {
    const { ref, handleSubmit: absherHandleSubmit } =
      useKycPersonalInformationFormContext()
    const { t } = useTranslation("kyc")
    const monthList = useHijiriMonthList()
    const yearList = useHijiriYearList()
    const [otp, setOtp] = React.useState<string>()
    const [isInValidOtp, setIsInValidOtp] = React.useState<boolean>(false)
    const [secondsRemaining, setSecondsRemaining] = React.useState<number>(300)
    const intervalId = React.useRef<NodeJS.Timeout>()
    const [otpError, setOtpError] = React.useState<string>()
    const [showOtpPage, setShowOptPage] = React.useState(false)
    const [showOtpErrorToast, setShowOtpErrorToast] = React.useState(false)
    const [showNationalIdErrorToast, setShowNationalIdErrorToast] =
      React.useState(false)
    const [showHijriErrorToast, setShowHijriErrorToast] = React.useState(false)
    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isTabletView = useBreakpointValue({
      base: false,
      md: true,
      lg: false,
    })
    const {
      onOpen: onOpenGeoModal,
      onClose: onCloseGeoModal,
      isOpen: isOpenGeoModal,
    } = useDisclosure()

    const isFullWidth = useBreakpointValue({ base: true, md: false })
    const { data: kycPersonalInformation, error } =
      useSWR<KycPersonalInformation>("/api/user/kyc/personal-information")
    const { data: preferenceData } = useSWR<Preference>("/api/user/preference")

    const validationSchema = usePersonalInfoSSOSchema()

    const handleGeoLocation = React.useCallback(
      async function handleGeoLocation(concent: boolean) {
        try {
          await ky.patch("/api/user/preference/location-consent", {
            json: { concent },
          })
          onCloseGeoModal()
          await mutate<Preference>("/api/user/preference")
        } catch (e) {}
      },
      [onCloseGeoModal],
    )

    const isLoading = !kycPersonalInformation && !error && !preferenceData

    React.useEffect(() => {
      if (otp) {
        setOtp(undefined)
      }
      if (otpError) {
        setIsInValidOtp(false)
        setOtpError(undefined)
      }
      if (showOtpPage) {
        setSecondsRemaining(300)
        intervalId.current = setInterval(() => {
          setSecondsRemaining((prevCount) => prevCount - 1)
        }, 1000)
        return () => {
          clearInterval(intervalId.current as NodeJS.Timeout)
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showOtpPage])

    React.useEffect(() => {
      if (secondsRemaining === 0) {
        clearInterval(intervalId.current as NodeJS.Timeout)
        setOtpError(
          t("personalInformation.kycSSOId.input.otp.errors.otpExpired"),
        )
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secondsRemaining])

    const hideOTPPage = React.useCallback(() => {
      setShowOptPage(false)
      setShowOtpErrorToast(false)
      setShowHijriErrorToast(false)
      setShowNationalIdErrorToast(false)
    }, [
      setShowOptPage,
      setShowOtpErrorToast,
      setShowNationalIdErrorToast,
      setShowHijriErrorToast,
    ])

    React.useEffect(() => {
      if (preferenceData?.shareLocationConsent === null && !showOtpPage) {
        onOpenGeoModal()
      }
    }, [showOtpPage, preferenceData?.shareLocationConsent, onOpenGeoModal])

    // need to handle error state later
    if (isLoading || error) {
      return null
    }

    async function handleResendOtp(
      values: KycPersonalInformation,
      setSubmitting: (isSubmitting: boolean) => void,
    ) {
      try {
        setSubmitting(true)
        await ky
          .post("/api/user/kyc/send-otp", {
            json: { nationalIdNumber: values.nationalIdNumber },
          })
          .json<KycSendOtpResponse>()
        setSubmitting(false)
      } catch (e) {
        setSubmitting(false)
      }
      setSubmitting(false)
      setOtpError(undefined)
      setIsInValidOtp(false)
      setShowOptPage(false)
      setShowOptPage(true)
    }

    async function handleSubmit(values: {
      nationalIdNumber: undefined
      monthOfBirth: undefined
      yearOfBirth: undefined
    }) {
      try {
        setShowNationalIdErrorToast(false)
        setShowHijriErrorToast(false)
        setShowOtpErrorToast(false)
        const response = await ky
          .post("/api/user/kyc/send-otp", {
            json: { nationalIdNumber: values.nationalIdNumber },
          })
          .json<KycSendOtpResponse>()
        if (response.otpExpiry === 0) {
          setShowNationalIdErrorToast(true)
          setTimeout(() => {
            setShowNationalIdErrorToast(false)
          }, 5000)
        } else {
          setShowOptPage(true)
        }
      } catch (e) {
        setShowNationalIdErrorToast(true)
        setTimeout(() => {
          setShowNationalIdErrorToast(false)
        }, 5000)
      }
    }

    const handleOtpSubmit = async (
      formikProps: FormikProps<{
        nationalIdNumber: undefined
        monthOfBirth: undefined
        yearOfBirth: undefined
      }>,
    ) => {
      if (!otp) {
        setIsInValidOtp(true)
        setOtpError(t("common:errors.required"))
        setTimeout(() => {
          setIsInValidOtp(false)
        }, 5000)
      } else if (otp && otp?.length !== 6) {
        setIsInValidOtp(true)
        setOtpError(
          t("personalInformation.kycSSOId.input.otp.errors.otpInvalid"),
        )
      } else {
        try {
          formikProps.setSubmitting(true)
          setShowHijriErrorToast(false)
          setShowNationalIdErrorToast(false)
          const response = await ky
            .post("/api/user/kyc/validate-otp", {
              json: {
                nationalIdNumber: formikProps.values.nationalIdNumber,
                otp: otp,
              },
            })
            .json<KycValidateOtpResponse>()
          if (response.token) {
            try {
              const citizen = await ky
                .post("/api/user/kyc/citizen-info", {
                  json: {
                    dob: `${formikProps.values.monthOfBirth}-${formikProps.values.yearOfBirth}`,
                    token: response.token,
                  },
                })
                .json<KycAbsherCitizenInfo>()
              formikProps.setSubmitting(false)
              // get-citizen info returns 200 despite invalid month and year entered.
              // Only way to check if its invalid is response field should not be null.
              if (
                citizen.englishFirstName === null &&
                citizen.firstName === null
              ) {
                setShowHijriErrorToast(true)
                setTimeout(() => {
                  setShowHijriErrorToast(false)
                }, 5000)
                return
              }
              const citizenDetails = {
                firstName: citizen.englishFirstName,
                middleName: citizen.englishSecondName,
                lastName: citizen.englishLastName,
                gender: citizen.gender === "M" ? Gender.Male : Gender.Female,
                dateOfBirth: citizen.dateOfBirth
                  ? new Date(citizen.dateOfBirth.split("-").reverse().join("-"))
                  : undefined,
                nationalIdNumber: String(formikProps.values.nationalIdNumber),
                nationality: "SA",
                isAbsher: true,
                address1: {
                  city: citizen.city,
                  postcode: citizen.postCode,
                  country: "SA",
                  district: citizen.district,
                  streetName: citizen.streetName,
                  buildingNumber: citizen.buildingNumber,
                },
              }
              absherHandleSubmit(citizenDetails)
              event(CompleteNationalSsoOtpPage)
            } catch (e) {
              formikProps.setSubmitting(false)
              setShowHijriErrorToast(true)
              setTimeout(() => {
                setShowHijriErrorToast(false)
              }, 5000)
              return
            }
          } else {
            formikProps.setSubmitting(false)
            setShowOtpErrorToast(true)
            setTimeout(() => {
              setShowOtpErrorToast(false)
            }, 5000)
          }
        } catch (e) {
          formikProps.setSubmitting(false)
          setShowOtpErrorToast(true)
          setTimeout(() => {
            setShowOtpErrorToast(false)
          }, 5000)
        }
      }
    }

    return (
      <>
        <Flex
          direction={{ base: "column", md: "row" }}
          py={{ base: 2, md: 16 }}
        >
          <Container flex="1" maxW={{ base: "full", md: "280px" }} px="0">
            <Heading
              mb={{ base: 8, md: 6 }}
              fontSize={{ base: "2xl", md: "3xl" }}
            >
              {t("personalInformation.kycSSOId.heading")}
            </Heading>

            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.400"
              mb={{ base: 0, md: 6 }}
            >
              {t(
                `personalInformation.kycSSOId.${
                  showOtpPage ? "descriptionOtpDetails" : "descriptionIdDetails"
                }`,
              )}
            </Text>
          </Container>

          <Center px={{ base: 0, md: 4, lg: 16 }} py={{ base: "48px", md: 0 }}>
            <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
          </Center>

          <Container flex={isTabletView ? "2" : "1"} px="0">
            <Formik
              initialValues={{
                nationalIdNumber: undefined,
                monthOfBirth: undefined,
                yearOfBirth: undefined,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              {...(isMobileView && {
                mb: "24",
              })}
            >
              {(formikProps) => (
                <>
                  {showOtpPage ? (
                    <>
                      <Text mb="12" color="gray.500" fontSize="sm">
                        {t("personalInformation.kycSSOId.text.otpMessage")}
                      </Text>
                      <FormControl
                        isInvalid={isInValidOtp || !!otpError}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleOtpSubmit(formikProps)
                          }
                        }}
                      >
                        <HStack mb="4">
                          <PinInput
                            placeholder="-"
                            size="lg"
                            id="otp"
                            colorScheme="primary"
                            otp
                            onChange={(e) => {
                              if (isInValidOtp) {
                                setIsInValidOtp(false)
                              }
                              if (otpError) {
                                setOtpError(undefined)
                              }
                              setOtp(e)
                            }}
                            isInvalid={isInValidOtp}
                          >
                            <PinInputField isInvalid={isInValidOtp} />
                            <PinInputField isInvalid={isInValidOtp} />
                            <PinInputField isInvalid={isInValidOtp} />
                            <PinInputField isInvalid={isInValidOtp} />
                            <PinInputField isInvalid={isInValidOtp} />
                            <PinInputField isInvalid={isInValidOtp} />
                          </PinInput>
                        </HStack>
                        {otpError && (
                          <FormErrorMessage mb="12">
                            {otpError}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      {otpError !==
                        t(
                          "personalInformation.kycSSOId.input.otp.errors.otpExpired",
                        ) && (
                        <Text fontSize="sm" color="gray.400" mb="12">
                          {`${t(
                            "personalInformation.kycSSOId.text.otpExpiryMessage",
                          )} ${secondsRemaining}`}
                        </Text>
                      )}

                      <Stack
                        direction={{ base: "column", md: "row" }}
                        spacing={{ base: 4, md: 2 }}
                        alignItems="baseline"
                      >
                        <Text fontSize="sm" color="gray.400">
                          {t(
                            "personalInformation.kycSSOId.text.otpResendMessage",
                          )}
                        </Text>
                        <Button
                          variant="link"
                          colorScheme="primary"
                          size="sm"
                          onClick={() =>
                            handleResendOtp(
                              formikProps.values,
                              formikProps.setSubmitting,
                            )
                          }
                        >
                          {t("personalInformation.kycSSOId.button.resendOtp")}
                        </Button>
                      </Stack>
                    </>
                  ) : (
                    <Form
                      style={{ width: "100%" }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          formikProps.submitForm()
                        }
                      }}
                    >
                      <SimpleGrid columns={1} spacing={8} alignItems="baseline">
                        <InputControl
                          aria-label="nationalIdNumber"
                          name="nationalIdNumber"
                          pt="2"
                          label={t(
                            "personalInformation.kycSSOId.input.nationalId.label",
                          )}
                          inputProps={{
                            type: "number",
                            placeholder: t(
                              "personalInformation.kycSSOId.input.nationalId.placeholder",
                            ),
                          }}
                        />
                        <FormControl>
                          <FormLabel htmlFor="monthOfBirth">
                            {t(
                              "personalInformation.kycSSOId.select.monthOfBirth.label",
                            )}
                          </FormLabel>

                          <Stack
                            direction={{ base: "column", md: "row" }}
                            spacing={{ base: 4, md: 3 }}
                            alignItems="flex-start"
                          >
                            <SelectControl
                              name="monthOfBirth"
                              aria-label="monthOfBirth"
                              selectProps={{
                                placeholder: t(
                                  "personalInformation.kycSSOId.select.monthOfBirth.placeholder",
                                ),
                                options: monthList,
                              }}
                            />
                            <SelectControl
                              name="yearOfBirth"
                              aria-label="yearOfBirth"
                              label="  "
                              selectProps={{
                                placeholder: t(
                                  "personalInformation.kycSSOId.select.yearOfBirth.placeholder",
                                ),
                                options: yearList,
                              }}
                            />
                          </Stack>
                        </FormControl>
                      </SimpleGrid>
                    </Form>
                  )}
                  <Portal containerRef={ref as React.RefObject<HTMLDivElement>}>
                    <Stack
                      isInline
                      spacing={{ base: 4, md: 8 }}
                      px={{ base: 0, md: 3 }}
                      flex="1"
                      justifyContent="flex-end"
                    >
                      {showOtpPage ? (
                        <>
                          <Button
                            colorScheme="primary"
                            variant="outline"
                            minW={{ base: "auto", md: "110px" }}
                            onClick={hideOTPPage}
                            isFullWidth={isFullWidth}
                          >
                            {t("common:button.back")}
                          </Button>
                          <Button
                            colorScheme="primary"
                            minW={{ base: "auto", md: "110px" }}
                            isDisabled={!!otpError}
                            onClick={() => {
                              handleOtpSubmit(formikProps)
                            }}
                            isLoading={formikProps.isSubmitting}
                            loadingText={t("common:button.next")}
                            isFullWidth={isFullWidth}
                          >
                            {t("common:button.next")}
                          </Button>
                        </>
                      ) : (
                        <Button
                          colorScheme="primary"
                          minW={{ base: "auto", md: "110px" }}
                          type="submit"
                          isLoading={formikProps.isSubmitting}
                          onClick={formikProps.submitForm}
                          loadingText={t("common:button.next")}
                          isFullWidth={isFullWidth}
                        >
                          {t("common:button.next")}
                        </Button>
                      )}
                    </Stack>
                  </Portal>
                </>
              )}
            </Formik>
          </Container>
        </Flex>
        {showOtpErrorToast && (
          <Flex
            justifyContent="center"
            position="fixed"
            zIndex="popover"
            {...(!isMobileView && {
              width: "fit-content",
            })}
            margin="0 auto"
            bottom={isMobileView ? "100px" : "0"}
            right={isMobileView ? "5px" : "0"}
            left={isMobileView ? "5px" : "0"}
          >
            <Toast
              description={t(
                "personalInformation.kycSSOId.input.otp.errors.otpInvalid",
              )}
              onClick={() => {
                setShowOtpErrorToast(false)
              }}
            />
          </Flex>
        )}
        {showNationalIdErrorToast && (
          <Flex
            justifyContent="center"
            position="fixed"
            zIndex="popover"
            {...(!isMobileView && {
              width: "fit-content",
            })}
            margin="0 auto"
            bottom={isMobileView ? "100px" : "0"}
            right={isMobileView ? "5px" : "0"}
            left={isMobileView ? "5px" : "0"}
          >
            <Toast
              description={t(
                "personalInformation.kycSSOId.errors.invalidNationalId",
              )}
              onClick={() => {
                setShowNationalIdErrorToast(false)
              }}
            />
          </Flex>
        )}
        {showHijriErrorToast && (
          <Flex
            justifyContent="center"
            position="fixed"
            zIndex="popover"
            {...(!isMobileView && {
              width: "fit-content",
            })}
            margin="0 auto"
            bottom={isMobileView ? "100px" : "0"}
            right={isMobileView ? "5px" : "0"}
            left={isMobileView ? "5px" : "0"}
          >
            <Toast
              description={t(
                "personalInformation.kycSSOId.errors.invalidHijiri",
              )}
              onClick={() => {
                setShowHijriErrorToast(false)
              }}
            />
          </Flex>
        )}
        <KycLocationConsentModal
          handleGeoLocation={handleGeoLocation}
          isOpenGeoModal={isOpenGeoModal}
        />
      </>
    )
  },
)

export default React.memo(KycPersonalInformationSSOId)
