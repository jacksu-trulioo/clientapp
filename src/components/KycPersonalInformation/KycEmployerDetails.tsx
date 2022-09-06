import {
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/layout"
import {
  FormControl,
  FormLabel,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react"
import { Form, Formik } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import { useCountryList, usePhoneCountryCodeList } from "~/hooks/useList"
import {
  EmploymentActivity,
  EstimatedAnnualRevenue,
  EstimatedNumnberOfEmployees,
  KycPersonalInformation,
} from "~/services/mytfo/types"

import { InputControl, SelectControl } from ".."
import { useEmployerDetailsSchema } from "./KycPersonalInformation.schema"
import KycPersonalInformationFormActions from "./KycPersonalInformationFormActions"
import { useKycPersonalInformationFormContext } from "./KycPersonalInformationFormContext"

const KycEmployerDetails = React.forwardRef<HTMLDivElement, unknown>(
  function KycEmploymentDetails(_props, _ref) {
    const { ref, handleSubmit } = useKycPersonalInformationFormContext()
    const { t, lang } = useTranslation("kyc")
    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isTabletView = useBreakpointValue({
      base: false,
      md: true,
      lg: false,
    })
    const countryList = useCountryList()
    const phoneCountryCodeList = usePhoneCountryCodeList()
    const estimateAnnualRevenueList = Object.keys(EstimatedAnnualRevenue)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: t(
          `kyc:personalInformation.KycEmployerDetails.select.estimatedAnnualRevenue.options.${key}`,
        ),
        value:
          EstimatedAnnualRevenue[key as keyof typeof EstimatedAnnualRevenue],
      }))
    const estimatedNumberOfEmployeeList = Object.keys(
      EstimatedNumnberOfEmployees,
    )
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: t(
          `kyc:personalInformation.KycEmployerDetails.select.estimatedNumberOfEmployees.options.${key}`,
        ),
        value:
          EstimatedNumnberOfEmployees[
            key as keyof typeof EstimatedNumnberOfEmployees
          ],
      }))
    const validationSchema = useEmployerDetailsSchema()
    const validate = (
      values: Pick<KycPersonalInformation, "employerDetails">,
    ) => {
      let errors = {}
      if (isKsaEmployee) {
        switch (employmentActivity) {
          case EmploymentActivity.Employed:
            if (!values?.employerDetails?.buildingNumber) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  buildingNumber: t("common:errors.required"),
                },
              }
            }

            if (!values?.employerDetails?.streetName) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  streetName: t("common:errors.required"),
                },
              }
            }

            if (!values?.employerDetails?.phoneNumber) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  phoneNumber: t("common:errors.required"),
                },
              }
            }
            if (!values?.employerDetails?.phoneCountryCode) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  phoneCountryCode: t("common:errors.required"),
                },
              }
            }
            if (!values?.employerDetails?.district) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  district: t("common:errors.required"),
                },
              }
            }
            break
          case EmploymentActivity.SelfEmployed:
            if (!values?.employerDetails?.buildingNumber) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  buildingNumber: t("common:errors.required"),
                },
              }
            }

            if (!values?.employerDetails?.streetName) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  streetName: t("common:errors.required"),
                },
              }
            }

            if (!values?.employerDetails?.district) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  district: t("common:errors.required"),
                },
              }
            }

            if (!values?.employerDetails?.estimatedAnnualRevenue) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  estimatedAnnualRevenue: t("common:errors.required"),
                },
              }
            }

            if (!values?.employerDetails?.estimatedNumberOfEmployees) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  estimatedNumberOfEmployees: t("common:errors.required"),
                },
              }
            }
            break
          case EmploymentActivity.Retired:
            if (!values?.employerDetails?.buildingNumber) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  buildingNumber: t("common:errors.required"),
                },
              }
            }

            if (!values?.employerDetails?.streetName) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  streetName: t("common:errors.required"),
                },
              }
            }

            if (!values?.employerDetails?.district) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  district: t("common:errors.required"),
                },
              }
            }
        }
      } else {
        switch (employmentActivity) {
          case EmploymentActivity.Employed:
            if (!values?.employerDetails?.address) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  address: t("common:errors.required"),
                },
              }
            }

            if (!values?.employerDetails?.phoneNumber) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  phoneNumber: t("common:errors.required"),
                },
              }
            }
            if (!values?.employerDetails?.phoneCountryCode) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  phoneCountryCode: t("common:errors.required"),
                },
              }
            }
            break
          case EmploymentActivity.SelfEmployed:
            if (!values?.employerDetails?.address) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  address: t("common:errors.required"),
                },
              }
            }

            if (!values?.employerDetails?.estimatedAnnualRevenue) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  estimatedAnnualRevenue: t("common:errors.required"),
                },
              }
            }

            if (!values?.employerDetails?.estimatedNumberOfEmployees) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  estimatedNumberOfEmployees: t("common:errors.required"),
                },
              }
            }
            break
          case EmploymentActivity.Retired:
            if (!values?.employerDetails?.address) {
              errors = {
                ...errors,
                employerDetails: {
                  //@ts-ignore
                  ...errors?.employerDetails,
                  address: t("common:errors.required"),
                },
              }
            }
        }
      }

      return errors
    }
    const { data: kycPersonalInformation, error } =
      useSWR<KycPersonalInformation>("/api/user/kyc/personal-information")

    const isLoading = !kycPersonalInformation && !error
    // need to handle error state later
    if (isLoading || error) {
      return null
    }
    const isKsaEmployee =
      kycPersonalInformation?.employerDetails?.isEmployeeKsa ||
      kycPersonalInformation?.nationality === "SA"
    const employmentActivity = kycPersonalInformation?.employmentActivity
    const titleKey =
      employmentActivity === EmploymentActivity.Employed
        ? "employerDetails"
        : employmentActivity === EmploymentActivity.SelfEmployed
        ? "companyDetails"
        : "lastEmployerDetails"
    return (
      <Flex direction={{ base: "column", md: "row" }} py={{ base: 2, md: 16 }}>
        <Container flex="1" maxW={{ base: "full", md: "280px" }} px="0">
          <Heading
            mb={{ base: 8, md: 6 }}
            fontSize={{ base: "2xl", md: "3xl" }}
          >
            {t(`personalInformation.KycEmployerDetails.title.${titleKey}`)}
          </Heading>

          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color="gray.400"
            mb={{ base: 0, md: 6 }}
          >
            {t("personalInformation.KycEmployerDetails.description")}
          </Text>
        </Container>

        <Center px={{ base: 0, md: 4, lg: 16 }} py={{ base: "48px", md: 0 }}>
          <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
        </Center>

        <Container flex={isTabletView ? "2" : "1"} px="0">
          <Formik<Pick<KycPersonalInformation, "employerDetails">>
            initialValues={{
              employerDetails: {
                country: kycPersonalInformation?.employerDetails?.country || "",
                nameOfCompany:
                  kycPersonalInformation?.employerDetails?.nameOfCompany || "",
                buildingNumber:
                  kycPersonalInformation?.employerDetails?.buildingNumber || "",
                streetName:
                  kycPersonalInformation?.employerDetails?.streetName || "",
                address: kycPersonalInformation?.employerDetails?.address || "",
                district:
                  kycPersonalInformation?.employerDetails?.district || "",
                city: kycPersonalInformation?.employerDetails?.city || "",
                postcode:
                  kycPersonalInformation?.employerDetails?.postcode || "",
                phoneCountryCode:
                  kycPersonalInformation?.employerDetails?.phoneCountryCode ||
                  "",
                phoneNumber:
                  kycPersonalInformation?.employerDetails?.phoneNumber || "",
                estimatedNumberOfEmployees:
                  kycPersonalInformation?.employerDetails
                    ?.estimatedNumberOfEmployees,
                estimatedAnnualRevenue:
                  kycPersonalInformation?.employerDetails
                    ?.estimatedAnnualRevenue,
              },
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            {...(isMobileView && {
              mb: "24",
            })}
            validate={validate}
            enableReinitialize
          >
            {(formikProps) => (
              <Form style={{ width: "100%" }}>
                <SelectControl
                  name="employerDetails.country"
                  aria-label="country"
                  label={t(
                    "personalInformation.KycEmployerDetails.select.country.label",
                  )}
                  selectProps={{
                    placeholder: t("common:select.placeholder"),
                    options: countryList,
                  }}
                  width={{ base: "full", md: "270px" }}
                  mb={8}
                />
                <SimpleGrid
                  columns={{ base: 1, md: 2 }}
                  spacing={8}
                  alignItems="baseline"
                  mb={8}
                >
                  <InputControl
                    aria-label="nameOfCompany"
                    name="employerDetails.nameOfCompany"
                    pt="2"
                    label={t(
                      "personalInformation.KycEmployerDetails.input.nameOfCompany.label",
                    )}
                    inputProps={{
                      placeholder: t(
                        "personalInformation.KycEmployerDetails.input.nameOfCompany.placeholder",
                      ),
                    }}
                  />

                  {isKsaEmployee ? (
                    <InputControl
                      aria-label="buildingNumber"
                      name="employerDetails.buildingNumber"
                      pt="2"
                      label={t(
                        "personalInformation.KycEmployerDetails.input.buildingNumber.label",
                      )}
                      inputProps={{
                        placeholder: t(
                          "personalInformation.KycEmployerDetails.input.buildingNumber.placeholder",
                        ),
                      }}
                    />
                  ) : (
                    <InputControl
                      aria-label="address"
                      name="employerDetails.address"
                      pt="2"
                      label={t(
                        "personalInformation.KycEmployerDetails.input.address.label",
                      )}
                      inputProps={{
                        placeholder: t(
                          "personalInformation.KycEmployerDetails.input.address.placeholder",
                        ),
                      }}
                    />
                  )}
                  {isKsaEmployee && (
                    <>
                      <InputControl
                        aria-label="streetName"
                        name="employerDetails.streetName"
                        pt="2"
                        label={t(
                          "personalInformation.KycEmployerDetails.input.streetName.label",
                        )}
                        inputProps={{
                          placeholder: t(
                            "personalInformation.KycEmployerDetails.input.streetName.placeholder",
                          ),
                        }}
                      />
                      <InputControl
                        aria-label="district"
                        name="employerDetails.district"
                        pt="2"
                        label={t(
                          "personalInformation.KycEmployerDetails.input.district.label",
                        )}
                        inputProps={{
                          placeholder: t(
                            "personalInformation.KycEmployerDetails.input.district.placeholder",
                          ),
                        }}
                      />
                    </>
                  )}
                  <InputControl
                    aria-label="city"
                    name="employerDetails.city"
                    pt="2"
                    label={t(
                      "personalInformation.KycEmployerDetails.input.city.label",
                    )}
                    inputProps={{
                      placeholder: t(
                        "personalInformation.KycEmployerDetails.input.city.placeholder",
                      ),
                    }}
                  />
                  <InputControl
                    aria-label="postcode"
                    name="employerDetails.postcode"
                    pt="2"
                    label={t(
                      "personalInformation.KycEmployerDetails.input.postcode.label",
                    )}
                    inputProps={{
                      placeholder: t(
                        "personalInformation.KycEmployerDetails.input.postcode.placeholder",
                      ),
                    }}
                  />
                  {employmentActivity === EmploymentActivity.SelfEmployed && (
                    <>
                      <SelectControl
                        pt="2"
                        name="employerDetails.estimatedNumberOfEmployees"
                        aria-label="estimatedNumberOfEmployees"
                        label={t(
                          "personalInformation.KycEmployerDetails.select.estimatedNumberOfEmployees.label",
                        )}
                        selectProps={{
                          placeholder: t("common:select.placeholder"),
                          options: estimatedNumberOfEmployeeList,
                        }}
                      />
                      <SelectControl
                        pt="2"
                        name="employerDetails.estimatedAnnualRevenue"
                        aria-label="estimatedAnnualRevenue"
                        label={t(
                          "personalInformation.KycEmployerDetails.select.estimatedAnnualRevenue.label",
                        )}
                        selectProps={{
                          placeholder: t("common:select.placeholder"),
                          options: estimateAnnualRevenueList,
                        }}
                      />
                    </>
                  )}
                </SimpleGrid>
                {employmentActivity === EmploymentActivity.Employed && (
                  <FormControl mb={8}>
                    <FormLabel
                      color="gray.400"
                      display="flex"
                      alignItems="center"
                      pb="0"
                      mb="0"
                    >
                      {t(
                        "personalInformation.KycEmployerDetails.input.phoneNumber.label",
                      )}
                    </FormLabel>
                    <HStack
                      {...(!isMobileView && {
                        width: "70%",
                      })}
                      alignItems="baseline"
                      {...(lang === "ar" && {
                        flexDirection: "row-reverse",
                      })}
                    >
                      <SelectControl
                        name="employerDetails.phoneCountryCode"
                        aria-label="phoneCountryCode"
                        selectProps={{
                          options: phoneCountryCodeList,
                        }}
                        w="80%"
                        pl="0"
                        pr="2"
                      />

                      <InputControl
                        {...(lang === "ar" && {
                          marginRight: "0px !important",
                          marginLeft: "0.5rem !important",
                        })}
                        pt="2"
                        {...(lang === "ar" && {
                          width: "full",
                        })}
                        aria-label="phoneNumber"
                        name="employerDetails.phoneNumber"
                        inputProps={{
                          placeholder: t(
                            "personalInformation.KycEmployerDetails.input.phoneNumber.placeholder",
                          ),
                        }}
                      />
                    </HStack>
                  </FormControl>
                )}
                <KycPersonalInformationFormActions ref={ref} {...formikProps} />
              </Form>
            )}
          </Formik>
        </Container>
      </Flex>
    )
  },
)

export default React.memo(KycEmployerDetails)
