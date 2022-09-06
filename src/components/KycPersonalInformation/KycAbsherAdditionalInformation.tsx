import {
  Box,
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

import { useCountryList } from "~/hooks/useList"
import {
  KycPersonalInformation,
  NameTitle,
  YesOrNo,
} from "~/services/mytfo/types"

import { InputControl, Radio, RadioGroupControl, SelectControl } from ".."
import { useAbsherOtherDetailsSchema } from "./KycPersonalInformation.schema"
import KycPersonalInformationFormActions from "./KycPersonalInformationFormActions"
import { useKycPersonalInformationFormContext } from "./KycPersonalInformationFormContext"

const KysAbsherAdditionalInformation = React.forwardRef<
  HTMLDivElement,
  unknown
>(function KycPersonalInfoAddress(_props, _ref) {
  const { ref, handleSubmit } = useKycPersonalInformationFormContext()
  const { t } = useTranslation("kyc")
  const countryList = useCountryList()
  const countryListOtherNationality = React.useMemo(() => {
    return countryList.filter((country) => country.value !== "SA")
  }, [countryList])

  const titlesList = Object.keys(NameTitle)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: t(`common:select.options.title.${key}`),
      value: NameTitle[key as keyof typeof NameTitle],
    }))

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isTabletView = useBreakpointValue({ base: false, md: true, lg: false })
  const { data: kycPersonalInformation, error } =
    useSWR<KycPersonalInformation>("/api/user/kyc/personal-information")
  const validationSchema = useAbsherOtherDetailsSchema()
  const isLoading = !kycPersonalInformation && !error
  function getResidenceOutsideSaudiArabiaFlag(
    value: boolean | YesOrNo | undefined,
  ) {
    if (value === true) {
      return "yes"
    } else if (value === false) {
      return "no"
    } else {
      return undefined
    }
  }

  // need to handle error state later
  if (isLoading || error) {
    return null
  }

  return (
    <Flex direction={{ base: "column", md: "row" }} py={{ base: 2, md: 16 }}>
      <Container flex="1" maxW={{ base: "full", md: "280px" }} px="0">
        <Heading mb={{ base: 8, md: 6 }} fontSize={{ base: "2xl", md: "3xl" }}>
          {t("personalInformation.KycAbsherOtherDetails.heading")}
        </Heading>

        <Text
          fontSize={{ base: "xs", md: "sm" }}
          color="gray.400"
          mb={{ base: 0, md: 6 }}
        >
          {t("personalInformation.KycAbsherOtherDetails.description")}
        </Text>
      </Container>

      <Center px={{ base: 0, md: 4, lg: 16 }} py={{ base: "48px", md: 0 }}>
        <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
      </Center>

      <Container flex={isTabletView ? "3" : "1"} px="0">
        <Formik<KycPersonalInformation>
          initialValues={{
            title: kycPersonalInformation?.title || undefined,
            countryOfBirth: kycPersonalInformation?.countryOfBirth,
            placeOfBirth: kycPersonalInformation?.placeOfBirth,
            passportNumber: kycPersonalInformation?.passportNumber,
            otherNationality: kycPersonalInformation?.otherNationality,
            hasResidenceAddressOutsideSaudiArabia:
              getResidenceOutsideSaudiArabiaFlag(
                kycPersonalInformation?.hasResidenceAddressOutsideSaudiArabia,
              ),
            address2: {
              address: kycPersonalInformation?.address2?.address,
              city: kycPersonalInformation?.address2?.city,
              postcode: kycPersonalInformation?.address2?.postcode,
              country: kycPersonalInformation?.address2?.country,
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
                mb="8"
                alignItems="baseline"
              >
                <SelectControl
                  name="title"
                  aria-label="title"
                  label={t(
                    "personalInformation.KycAbsherOtherDetails.select.title.label",
                  )}
                  selectProps={{
                    placeholder: t("common:select.placeholder"),
                    options: titlesList,
                  }}
                />
                <Box></Box>
                <SelectControl
                  name="countryOfBirth"
                  aria-label="countryOfBirth"
                  label={t(
                    "personalInformation.KycAbsherOtherDetails.select.countryOfBirth.label",
                  )}
                  selectProps={{
                    placeholder: t("common:select.placeholder"),
                    options: countryList,
                  }}
                />
                <InputControl
                  aria-label="placeOfBirth"
                  name="placeOfBirth"
                  pt="2"
                  label={t(
                    "personalInformation.KycAbsherOtherDetails.input.placeOfBirth.placeholder",
                  )}
                  inputProps={{
                    placeholder: t(
                      "personalInformation.KycAbsherOtherDetails.input.placeOfBirth.placeholder",
                    ),
                    pattern: "/^[a-zA-Z ]*$/",
                  }}
                />
                <InputControl
                  aria-label="passport"
                  name="passportNumber"
                  pt="2"
                  label={t(
                    "personalInformation.KycAbsherOtherDetails.input.passport.placeholder",
                  )}
                  inputProps={{
                    placeholder: t(
                      "personalInformation.KycAbsherOtherDetails.input.passport.placeholder",
                    ),
                  }}
                />
                <SelectControl
                  name="otherNationality"
                  aria-label="otherNationality"
                  label={t(
                    "personalInformation.KycAbsherOtherDetails.select.otherNationality.label",
                  )}
                  selectProps={{
                    placeholder: t("common:select.placeholder"),
                    options: countryListOtherNationality,
                    isClearable: true,
                  }}
                />
                <SelectControl
                  name="countryOfResidence"
                  aria-label="countryOfResidence"
                  label={t(
                    "personalInformation.KycAbsherOtherDetails.select.countryOfResidence.label",
                  )}
                  isDisabled={true}
                  selectProps={{
                    placeholder: t("common:select.placeholder"),
                    options: countryList,
                    value: countryList.find((option) => option.value === "SA"),
                  }}
                />
              </SimpleGrid>
              <RadioGroupControl
                name="hasResidenceAddressOutsideSaudiArabia"
                direction={{ base: "column", md: "row" }}
                mb={{ base: "8", md: "12" }}
                label={t(
                  "personalInformation.KycAbsherOtherDetails.radio.hasResidenceAddressOutsideSaudiArabia.label",
                )}
                variant="filled"
                onChange={(event) => {
                  const target = event?.target as HTMLInputElement
                  if (target.value === "no") {
                    formikProps.resetForm({
                      values: {
                        ...formikProps.values,
                        hasResidenceAddressOutsideSaudiArabia: "no",
                        address2: {
                          address: undefined,
                          city: undefined,
                          postcode: undefined,
                          country: undefined,
                        },
                      },
                    })
                  }
                }}
              >
                {["yes", "no"].map((option) => (
                  <Radio key={option} value={option} me="2">
                    <Text>
                      {t(
                        `personalInformation.KycAbsherOtherDetails.radio.hasResidenceAddressOutsideSaudiArabia.options.${option}.title`,
                      )}
                    </Text>
                  </Radio>
                ))}
              </RadioGroupControl>
              {formikProps.values.hasResidenceAddressOutsideSaudiArabia ===
                "yes" && (
                <SimpleGrid
                  columns={{ base: 1, md: 2 }}
                  spacing={8}
                  alignItems="baseline"
                >
                  <InputControl
                    aria-label="address"
                    name="address2.address"
                    pt="2"
                    label={t(
                      "personalInformation.KycAbsherOtherDetails.input.address.label",
                    )}
                    inputProps={{
                      placeholder: t(
                        "personalInformation.KycAbsherOtherDetails.input.address.placeholder",
                      ),
                    }}
                  />
                  <InputControl
                    aria-label="city"
                    name="address2.city"
                    pt="2"
                    label={t(
                      "personalInformation.KycAbsherOtherDetails.input.city.placeholder",
                    )}
                    inputProps={{
                      placeholder: t(
                        "personalInformation.KycAbsherOtherDetails.input.city.placeholder",
                      ),
                    }}
                  />

                  <InputControl
                    aria-label="postcode"
                    name="address2.postcode"
                    pt="2"
                    label={t(
                      "personalInformation.KycAbsherOtherDetails.input.postcode.label",
                    )}
                    inputProps={{
                      placeholder: t(
                        "personalInformation.KycAbsherOtherDetails.input.postcode.placeholder",
                      ),
                    }}
                  />
                  <SelectControl
                    name="address2.country"
                    aria-label="country"
                    label={t(
                      "personalInformation.KycAbsherOtherDetails.select.country.label",
                    )}
                    selectProps={{
                      placeholder: t("common:select.placeholder"),
                      options: countryList,
                    }}
                  />
                </SimpleGrid>
              )}
              <KycPersonalInformationFormActions ref={ref} {...formikProps} />
            </Form>
          )}
        </Formik>
      </Container>
    </Flex>
  )
})

export default React.memo(KysAbsherAdditionalInformation)
