import {
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import { OptionTypeBase } from "react-select"
import useSWR from "swr"

import {
  EmploymentActivity,
  EmploymentSector,
  KycPersonalInformation,
} from "~/services/mytfo/types"

import { InputControl, Radio, RadioGroupControl, SelectControl } from ".."
import { useEmploymentDetailsSchema } from "./KycPersonalInformation.schema"
import KycPersonalInformationFormActions from "./KycPersonalInformationFormActions"
import { useKycPersonalInformationFormContext } from "./KycPersonalInformationFormContext"

const KycEmploymentDetails = React.forwardRef<HTMLDivElement, unknown>(
  function KycEmploymentDetails(_props, _ref) {
    const { ref, handleSubmit } = useKycPersonalInformationFormContext()
    const { t } = useTranslation("kyc")
    const employmentActivityList = Object.keys(EmploymentActivity)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: t(
          `kyc:personalInformation.KycEmploymentDetails.select.employmentActivity.options.${key}`,
        ),
        value: EmploymentActivity[key as keyof typeof EmploymentActivity],
      }))
    const employmentSectorList = Object.keys(EmploymentSector)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: t(
          `kyc:personalInformation.KycEmploymentDetails.select.employmentSector.options.${key}`,
        ),
        value: EmploymentSector[key as keyof typeof EmploymentSector],
      }))
    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isTabletView = useBreakpointValue({
      base: false,
      md: true,
      lg: false,
    })
    const validationSchema = useEmploymentDetailsSchema()
    const validate = (
      values: Pick<
        KycPersonalInformation,
        "employmentDetails" | "employmentActivity"
      >,
    ) => {
      let errors = {}
      if (
        ![
          EmploymentActivity.Employed,
          EmploymentActivity.SelfEmployed,
          EmploymentActivity.Retired,
          EmploymentActivity.Unemployed,
          undefined,
        ].includes(values.employmentActivity)
      ) {
        errors = { ...errors, employmentActivity: t("common:errors.required") }
      }
      if (
        values.employmentActivity === EmploymentActivity.Employed ||
        values.employmentActivity === EmploymentActivity.SelfEmployed
      ) {
        if (!values?.employmentDetails?.employmentSector) {
          errors = {
            ...errors,
            employmentDetails: {
              //@ts-ignore
              ...errors?.employmentDetails,
              employmentSector: t("common:errors.required"),
            },
          }
        }

        if (!values.employmentDetails?.yearsOfProfessionalExperience) {
          if (values.employmentDetails?.yearsOfProfessionalExperience !== 0) {
            errors = {
              ...errors,
              employmentDetails: {
                //@ts-ignore
                ...errors.employmentDetails,
                yearsOfProfessionalExperience: t("common:errors.required"),
              },
            }
          }
        }
        if (!values.employmentDetails?.jobTitle) {
          errors = {
            ...errors,
            employmentDetails: {
              //@ts-ignore
              ...errors.employmentDetails,
              jobTitle: t("common:errors.required"),
            },
          }
        }

        if (!values.employmentDetails?.areYouDirectorOfListedCompany) {
          errors = {
            ...errors,
            employmentDetails: {
              //@ts-ignore
              ...errors.employmentDetails,
              areYouDirectorOfListedCompany: t("common:errors.required"),
            },
          }
        }
      }
      if (values.employmentActivity === EmploymentActivity.Retired) {
        if (!values?.employmentDetails?.yearsOfProfessionalExperience) {
          if (values.employmentDetails?.yearsOfProfessionalExperience !== 0) {
            errors = {
              ...errors,
              employmentDetails: {
                //@ts-ignore
                ...errors.employmentDetails,
                yearsOfProfessionalExperience: t("common:errors.required"),
              },
            }
          }
        }
        if (!values?.employmentDetails?.sectorOfLastEmployment) {
          errors = {
            ...errors,
            employmentDetails: {
              //@ts-ignore
              ...errors?.employmentDetails,
              sectorOfLastEmployment: t("common:errors.required"),
            },
          }
        }
        if (!values?.employmentDetails?.lastJobTitleHeld) {
          errors = {
            ...errors,
            employmentDetails: {
              //@ts-ignore
              ...errors?.employmentDetails,
              lastJobTitleHeld: t("common:errors.required"),
            },
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
    return (
      <Flex direction={{ base: "column", md: "row" }} py={{ base: 2, md: 16 }}>
        <Container flex="1" maxW={{ base: "full", md: "280px" }} px="0">
          <Heading
            mb={{ base: 8, md: 6 }}
            fontSize={{ base: "2xl", md: "3xl" }}
          >
            {t("personalInformation.KycEmploymentDetails.title")}
          </Heading>

          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color="gray.400"
            mb={{ base: 0, md: 6 }}
          >
            {t("personalInformation.KycEmploymentDetails.description")}
          </Text>
        </Container>

        <Center px={{ base: 0, md: 4, lg: 16 }} py={{ base: "48px", md: 0 }}>
          <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
        </Center>

        <Container flex={isTabletView ? "2" : "1"} px="0">
          <Formik<
            Pick<
              KycPersonalInformation,
              "employmentDetails" | "employmentActivity"
            >
          >
            initialValues={{
              employmentActivity: kycPersonalInformation?.employmentActivity,
              employmentDetails: {
                employmentSector:
                  kycPersonalInformation?.employmentDetails?.employmentSector,
                yearsOfProfessionalExperience:
                  kycPersonalInformation?.employmentDetails
                    ?.yearsOfProfessionalExperience,
                jobTitle:
                  kycPersonalInformation?.employmentDetails?.jobTitle || "",
                areYouDirectorOfListedCompany:
                  kycPersonalInformation?.employmentDetails
                    ?.areYouDirectorOfListedCompany === undefined
                    ? undefined
                    : kycPersonalInformation?.employmentDetails
                        ?.areYouDirectorOfListedCompany
                    ? "yes"
                    : "no",
                sectorOfLastEmployment:
                  kycPersonalInformation?.employmentDetails
                    ?.sectorOfLastEmployment,
                lastJobTitleHeld:
                  kycPersonalInformation?.employmentDetails?.lastJobTitleHeld ||
                  "",
              },
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            {...(isMobileView && {
              mb: "24",
            })}
            validate={validate}
            enableReinitialize={true}
          >
            {(formikProps) => (
              <Form style={{ width: "100%" }}>
                <SimpleGrid
                  columns={{ base: 1, md: 1 }}
                  spacing={8}
                  alignItems="baseline"
                  mb={8}
                >
                  <SelectControl
                    name="employmentActivity"
                    aria-label="employmentActivity"
                    label={t(
                      "personalInformation.KycEmploymentDetails.select.employmentActivity.label",
                    )}
                    selectProps={{
                      placeholder: t("common:select.placeholder"),
                      options: employmentActivityList,
                      onChange: (option: OptionTypeBase) => {
                        if (option?.value) {
                          const obj = formikProps.values.employmentDetails
                          const resetEmploymentDetails = Object.keys(
                            obj ?? {},
                          ).reduce((accumulator, key) => {
                            let keyValue = null
                            if (
                              [
                                "jobTitle",
                                "lastJobTitleHeld",
                                "yearsOfProfessionalExperience",
                                "areYouDirectorOfListedCompany",
                              ].includes(key)
                            ) {
                              keyValue = ""
                            }
                            return { ...accumulator, [key]: keyValue }
                          }, {})
                          formikProps.setFieldValue(
                            "employmentActivity",
                            option.value,
                          )
                          formikProps.setFieldValue(
                            "employmentDetails",
                            resetEmploymentDetails,
                            false,
                          )
                        }
                      },
                    }}
                  />
                  {formikProps?.values?.employmentActivity !==
                    EmploymentActivity.Unemployed &&
                    formikProps?.values?.employmentActivity && (
                      <>
                        {formikProps?.values?.employmentActivity ===
                          EmploymentActivity.Retired && (
                          <SelectControl
                            name="employmentDetails.sectorOfLastEmployment"
                            aria-label="sectorOfLastEmployment"
                            label={t(
                              "personalInformation.KycEmploymentDetails.select.sectorOfLastEmployment.label",
                            )}
                            selectProps={{
                              placeholder: t("common:select.placeholder"),
                              options: employmentSectorList,
                            }}
                          />
                        )}
                        {(formikProps?.values?.employmentActivity ===
                          EmploymentActivity.Employed ||
                          formikProps?.values?.employmentActivity ===
                            EmploymentActivity.SelfEmployed) && (
                          <SelectControl
                            name="employmentDetails.employmentSector"
                            aria-label="employmentSector"
                            label={t(
                              "personalInformation.KycEmploymentDetails.select.employmentSector.label",
                            )}
                            selectProps={{
                              placeholder: t("common:select.placeholder"),
                              options: employmentSectorList,
                            }}
                          />
                        )}
                        {[
                          EmploymentActivity.Employed,
                          EmploymentActivity.SelfEmployed,
                          EmploymentActivity.Retired,
                        ].includes(formikProps?.values?.employmentActivity) && (
                          <InputControl
                            aria-label="yearsOfProfessionalExperience"
                            name="employmentDetails.yearsOfProfessionalExperience"
                            pt="2"
                            label={t(
                              "personalInformation.KycEmploymentDetails.input.yearsOfProfessionalExperience.label",
                            )}
                            inputProps={{
                              placeholder: t(
                                "personalInformation.KycEmploymentDetails.input.yearsOfProfessionalExperience.placeholder",
                              ),
                            }}
                          />
                        )}
                        {formikProps?.values?.employmentActivity ===
                          EmploymentActivity.Retired && (
                          <InputControl
                            aria-label="lastJobTitleHeld"
                            name="employmentDetails.lastJobTitleHeld"
                            pt="2"
                            label={t(
                              "personalInformation.KycEmploymentDetails.input.lastJobTitleHeld.placeholder",
                            )}
                            inputProps={{
                              placeholder: t(
                                "personalInformation.KycEmploymentDetails.input.lastJobTitleHeld.placeholder",
                              ),
                            }}
                          />
                        )}
                        {(formikProps?.values?.employmentActivity ===
                          EmploymentActivity.Employed ||
                          formikProps?.values?.employmentActivity ===
                            EmploymentActivity.SelfEmployed) && (
                          <InputControl
                            aria-label="jobTitle"
                            name="employmentDetails.jobTitle"
                            pt="2"
                            label={t(
                              "personalInformation.KycEmploymentDetails.input.jobTitle.placeholder",
                            )}
                            inputProps={{
                              placeholder: t(
                                "personalInformation.KycEmploymentDetails.input.jobTitle.placeholder",
                              ),
                            }}
                          />
                        )}
                        {(formikProps?.values?.employmentActivity ===
                          EmploymentActivity.Employed ||
                          formikProps?.values?.employmentActivity ===
                            EmploymentActivity.SelfEmployed) && (
                          <RadioGroupControl
                            name="employmentDetails.areYouDirectorOfListedCompany"
                            direction={{ base: "column", md: "row" }}
                            {...(isMobileView && { variant: "filled" })}
                            label={t(
                              "personalInformation.KycEmploymentDetails.radio.areYouDirectorOfListedCompany.label",
                            )}
                            variant="filled"
                          >
                            {["yes", "no"].map((option) => (
                              <Radio key={option} value={option} me="2">
                                <Text>
                                  {t(
                                    `personalInformation.KycEmploymentDetails.radio.areYouDirectorOfListedCompany.options.${option}.title`,
                                  )}
                                </Text>
                              </Radio>
                            ))}
                          </RadioGroupControl>
                        )}
                      </>
                    )}
                </SimpleGrid>
                <KycPersonalInformationFormActions ref={ref} {...formikProps} />
              </Form>
            )}
          </Formik>
        </Container>
      </Flex>
    )
  },
)

export default React.memo(KycEmploymentDetails)
