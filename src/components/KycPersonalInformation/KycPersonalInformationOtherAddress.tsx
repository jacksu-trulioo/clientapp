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

import { useCountryList } from "~/hooks/useList"
import { KycPersonalInformation } from "~/services/mytfo/types"

import { InputControl, Radio, RadioGroupControl, SelectControl } from ".."
import { usePersonalInfoOtherAddressSchema } from "./KycPersonalInformation.schema"
import KycPersonalInformationFormActions from "./KycPersonalInformationFormActions"
import { useKycPersonalInformationFormContext } from "./KycPersonalInformationFormContext"

const KycPersonalInfoOtherAddress = React.forwardRef<HTMLDivElement, unknown>(
  function KycPersonalInfoAddress(_props, _ref) {
    const { ref, handleSubmit } = useKycPersonalInformationFormContext()
    const { t } = useTranslation("kyc")
    const countryList = useCountryList()
    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isTabletView = useBreakpointValue({
      base: false,
      md: true,
      lg: false,
    })
    const { data: kycPersonalInformation, error } =
      useSWR<KycPersonalInformation>("/api/user/kyc/personal-information")
    const validationSchema = usePersonalInfoOtherAddressSchema()
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
            {t("personalInformation.kycPersonalInfoOtherAddress.heading")}
          </Heading>

          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color="gray.400"
            mb={{ base: 0, md: 6 }}
          >
            {t(
              "personalInformation.kycPersonalInfoOtherAddress.descriptionIdDetails",
            )}
          </Text>
        </Container>

        <Center px={{ base: 0, md: 4, lg: 16 }} py={{ base: "48px", md: 0 }}>
          <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
        </Center>

        <Container flex={isTabletView ? "2" : "1"} px="0">
          <Formik<
            Pick<
              KycPersonalInformation,
              "hasResidenceAddressOutsideSaudiArabia" | "address2"
            >
          >
            initialValues={{
              hasResidenceAddressOutsideSaudiArabia:
                kycPersonalInformation?.hasResidenceAddressOutsideSaudiArabia ===
                true
                  ? "yes"
                  : kycPersonalInformation?.hasResidenceAddressOutsideSaudiArabia ===
                    false
                  ? "no"
                  : undefined,
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
                <RadioGroupControl
                  name="hasResidenceAddressOutsideSaudiArabia"
                  direction={{ base: "column", md: "row" }}
                  mb={{ base: "8", md: "12" }}
                  label={t(
                    "personalInformation.kycPersonalInfoOtherAddress.radio.hasResidenceAddressOutsideSaudiArabia.label",
                  )}
                  variant="filled"
                  onChange={() => {
                    if (
                      formikProps.values
                        .hasResidenceAddressOutsideSaudiArabia === "yes"
                    ) {
                      formikProps.resetForm({
                        values: {
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
                          `personalInformation.kycPersonalInfoOtherAddress.radio.hasResidenceAddressOutsideSaudiArabia.options.${option}.title`,
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
                        "personalInformation.kycPersonalInfoOtherAddress.input.address.label",
                      )}
                      inputProps={{
                        placeholder: t(
                          "personalInformation.kycPersonalInfoOtherAddress.input.address.placeholder",
                        ),
                      }}
                    />
                    <InputControl
                      aria-label="city"
                      name="address2.city"
                      pt="2"
                      label={t(
                        "personalInformation.kycPersonalInfoOtherAddress.input.city.placeholder",
                      )}
                      inputProps={{
                        placeholder: t(
                          "personalInformation.kycPersonalInfoOtherAddress.input.city.placeholder",
                        ),
                      }}
                    />

                    <InputControl
                      aria-label="postcode"
                      name="address2.postcode"
                      pt="2"
                      label={t(
                        "personalInformation.kycPersonalInfoOtherAddress.input.postcode.label",
                      )}
                      inputProps={{
                        placeholder: t(
                          "personalInformation.kycPersonalInfoOtherAddress.input.postcode.placeholder",
                        ),
                      }}
                    />
                    <SelectControl
                      name="address2.country"
                      aria-label="country"
                      label={t(
                        "personalInformation.kycPersonalInfoOtherAddress.select.country.label",
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
  },
)

export default React.memo(KycPersonalInfoOtherAddress)
