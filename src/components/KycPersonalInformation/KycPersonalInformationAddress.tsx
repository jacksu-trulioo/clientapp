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
import useSWR from "swr"
import * as Yup from "yup"

import { useCountryList } from "~/hooks/useList"
import { useUser } from "~/hooks/useUser"
import { KycPersonalInformation } from "~/services/mytfo/types"
import {
  alphaEnglishAllowedRegex,
  alphaNumericSpaceAllowedRegex,
  alphaNumericSpaceSpecialAllowedRegex,
} from "~/utils/constants/regex"

import { InputControl, SelectControl } from ".."
import KycPersonalInformationFormActions from "./KycPersonalInformationFormActions"
import { useKycPersonalInformationFormContext } from "./KycPersonalInformationFormContext"

const KycPersonalInfoAddress = React.forwardRef<HTMLDivElement, unknown>(
  function KycPersonalInfoAddress(_props, _ref) {
    const { ref, handleSubmit } = useKycPersonalInformationFormContext()
    const { t } = useTranslation("kyc")
    const countryList = useCountryList()
    const { user } = useUser()
    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isTabletView = useBreakpointValue({
      base: false,
      md: true,
      lg: false,
    })
    const { data: kycPersonalInformation, error } =
      useSWR<KycPersonalInformation>("/api/user/kyc/personal-information")
    let validationSchema
    const isLoading = !kycPersonalInformation && !error

    // need to handle error state later
    if (isLoading || error) {
      return null
    }

    const isKSA =
      user?.profile.nationality === "SA" ||
      kycPersonalInformation?.nationality === "SA" ||
      false
    const userCountryOfResidence = user?.profile.countryOfResidence
    if (isKSA) {
      validationSchema = Yup.object().shape({
        address1: Yup.object().shape({
          buildingNumber: Yup.string()
            .trim()
            .max(50, t("common:errors.maxChar"))
            .matches(alphaNumericSpaceSpecialAllowedRegex, {
              excludeEmptyString: true,
              message: t(
                "common:errors.alphaEnglishNumericSpaceSpecialAllowed",
              ),
            })
            .required(t("common:errors.required"))
            .nullable(),
          streetName: Yup.string()
            .trim()
            .max(50, t("common:errors.maxChar"))
            .matches(alphaNumericSpaceSpecialAllowedRegex, {
              excludeEmptyString: true,
              message: t(
                "common:errors.alphaEnglishNumericSpaceSpecialAllowed",
              ),
            })
            .required(t("common:errors.required"))
            .nullable(),
          district: Yup.string()
            .trim()
            .matches(alphaEnglishAllowedRegex, {
              excludeEmptyString: true,
              message: t("common:errors.alphaEnglishAllowed"),
            })
            .max(50, t("common:errors.maxChar"))
            .required(t("common:errors.required"))
            .matches(/^[a-zA-Z0-9\s]*$/, {
              excludeEmptyString: true,
              message: t("common:errors.alphaEnglishNumericSpaceAllowed"),
            })
            .nullable(),
          city: Yup.string()
            .trim()
            .max(50, t("common:errors.maxChar"))
            .matches(alphaEnglishAllowedRegex, {
              excludeEmptyString: true,
              message: t("common:errors.alphaEnglishAllowed"),
            })
            .required(t("common:errors.required"))
            .nullable(),
          postcode: Yup.string()
            .matches(alphaNumericSpaceAllowedRegex, {
              excludeEmptyString: true,
              message: t("common:errors.alphaNumericSpaceAllowed"),
            })
            .max(50, t("common:errors.maxChar"))
            .nullable(),
          country: Yup.string()
            .required(t("common:errors.required"))
            .nullable(),
        }),
      })
    } else {
      validationSchema = Yup.object().shape({
        address1: Yup.object().shape({
          address: Yup.string()
            .trim()
            .required(t("common:errors.required"))
            .max(50, t("common:errors.maxChar"))
            .matches(alphaNumericSpaceSpecialAllowedRegex, {
              excludeEmptyString: true,
              message: t(
                "common:errors.alphaEnglishNumericSpaceSpecialAllowed",
              ),
            })
            .nullable(),
          city: Yup.string()
            .trim()
            .required(t("common:errors.required"))
            .max(50, t("common:errors.maxChar"))
            .matches(alphaEnglishAllowedRegex, {
              excludeEmptyString: true,
              message: t("common:errors.alphaEnglishAllowed"),
            })
            .nullable(),
          postcode: Yup.string()
            .matches(alphaNumericSpaceAllowedRegex, {
              excludeEmptyString: true,
              message: t("common:errors.alphaNumericSpaceAllowed"),
            })
            .max(50, t("common:errors.maxChar"))
            .nullable(),
          country: Yup.string()
            .required(t("common:errors.required"))
            .nullable(),
        }),
      })
    }
    return (
      <Flex direction={{ base: "column", md: "row" }} py={{ base: 2, md: 16 }}>
        <Container flex="1" maxW={{ base: "full", md: "280px" }} px="0">
          <Heading
            mb={{ base: 8, md: 6 }}
            fontSize={{ base: "2xl", md: "3xl" }}
          >
            {t("personalInformation.kycPersonalInfoAddress.heading")}
          </Heading>

          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color="gray.400"
            mb={{ base: 0, md: 6 }}
          >
            {isKSA
              ? t(
                  "personalInformation.kycPersonalInfoAddress.descriptionIdDetails1",
                )
              : t(
                  "personalInformation.kycPersonalInfoAddress.descriptionIdDetails2",
                )}
          </Text>
        </Container>

        <Center px={{ base: 0, md: 4, lg: 16 }} py={{ base: "48px", md: 0 }}>
          <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
        </Center>

        <Container flex={isTabletView ? "2" : "1"} px="0">
          <Formik<Pick<KycPersonalInformation, "address1">>
            initialValues={{
              address1: {
                address: kycPersonalInformation?.address1?.address,
                city: kycPersonalInformation?.address1?.city,
                postcode: kycPersonalInformation?.address1?.postcode,
                country: userCountryOfResidence,
                district: kycPersonalInformation?.address1?.district,
                streetName: kycPersonalInformation?.address1?.streetName,
                buildingNumber:
                  kycPersonalInformation?.address1?.buildingNumber,
              },
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            {...(isMobileView && {
              mb: "24",
            })}
            enableReinitialize
          >
            {(formikProps) => (
              <Form style={{ width: "100%" }}>
                <SimpleGrid
                  columns={{ base: 1, md: 2 }}
                  spacing={8}
                  alignItems="baseline"
                >
                  {isKSA ? (
                    <>
                      <InputControl
                        aria-label="buildingNumber"
                        name="address1.buildingNumber"
                        pt="2"
                        label={t(
                          "personalInformation.kycPersonalInfoAddress.input.buildingNumber.label",
                        )}
                        inputProps={{
                          placeholder: t(
                            "personalInformation.kycPersonalInfoAddress.input.buildingNumber.placeholder",
                          ),
                        }}
                      />
                      <InputControl
                        aria-label="streetName"
                        name="address1.streetName"
                        pt="2"
                        label={t(
                          "personalInformation.kycPersonalInfoAddress.input.streetName.label",
                        )}
                        inputProps={{
                          placeholder: t(
                            "personalInformation.kycPersonalInfoAddress.input.streetName.placeholder",
                          ),
                        }}
                      />
                      <InputControl
                        aria-label="district"
                        name="address1.district"
                        pt="2"
                        label={t(
                          "personalInformation.kycPersonalInfoAddress.input.district.label",
                        )}
                        inputProps={{
                          placeholder: t(
                            "personalInformation.kycPersonalInfoAddress.input.district.placeholder",
                          ),
                        }}
                      />
                    </>
                  ) : (
                    <InputControl
                      aria-label="address"
                      name="address1.address"
                      pt="2"
                      label={t(
                        "personalInformation.kycPersonalInfoAddress.input.address.label",
                      )}
                      inputProps={{
                        placeholder: t(
                          "personalInformation.kycPersonalInfoAddress.input.address.placeholder",
                        ),
                      }}
                    />
                  )}
                  <InputControl
                    aria-label="city"
                    name="address1.city"
                    pt="2"
                    label={t(
                      "personalInformation.kycPersonalInfoAddress.input.city.placeholder",
                    )}
                    inputProps={{
                      placeholder: t(
                        "personalInformation.kycPersonalInfoAddress.input.city.placeholder",
                      ),
                    }}
                  />

                  <InputControl
                    aria-label="postcode"
                    name="address1.postcode"
                    pt="2"
                    label={t(
                      "personalInformation.kycPersonalInfoAddress.input.postcode.label",
                    )}
                    inputProps={{
                      placeholder: t(
                        "personalInformation.kycPersonalInfoAddress.input.postcode.placeholder",
                      ),
                    }}
                  />
                  <SelectControl
                    name="address1.country"
                    aria-label="country"
                    label={t(
                      "personalInformation.kycPersonalInfoAddress.select.country.label",
                    )}
                    isDisabled
                    selectProps={{
                      placeholder: t("common:select.placeholder"),
                      options: countryList,
                    }}
                  />
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

export default React.memo(KycPersonalInfoAddress)
