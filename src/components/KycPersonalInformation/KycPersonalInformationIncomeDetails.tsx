import {
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import {
  KycAnnualIncome,
  KycNetWorth,
  KycPersonalInformation,
  KycSourceOfFunds,
  KycSourceOfWealth,
} from "~/services/mytfo/types"

import { SelectControl, TextareaControl } from ".."
import { useIncomeDetailsSchema } from "./KycPersonalInformation.schema"
import KycPersonalInformationFormActions from "./KycPersonalInformationFormActions"
import { useKycPersonalInformationFormContext } from "./KycPersonalInformationFormContext"

interface Option {
  label: string | number
  value: string | number
}

const KycPersonalInformationIncomeDetails = React.forwardRef<
  HTMLDivElement,
  unknown
>(function KycPersonalInfoForm(_props, _ref) {
  const { ref, handleSubmit } = useKycPersonalInformationFormContext()
  const { t } = useTranslation("kyc")

  const annualIncomeList = Object.keys(KycAnnualIncome)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: t(
        `personalInformation.kycIncomeDetails.select.annualIncome.options.${key}`,
      ),
      value: KycAnnualIncome[key as keyof typeof KycAnnualIncome],
    }))

  const netWorthList = Object.keys(KycNetWorth)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: t(
        `personalInformation.kycIncomeDetails.select.netWorth.options.${key}`,
      ),
      value: KycNetWorth[key as keyof typeof KycNetWorth],
    }))

  const sourceOfWealthList = Object.keys(KycSourceOfWealth)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: t(
        `personalInformation.kycIncomeDetails.select.sourceOfWealth.options.${key}`,
      ),
      value: KycSourceOfWealth[key as keyof typeof KycSourceOfWealth],
    }))
    .sort((a, b) => {
      if (a.value.toLowerCase() === "other") return 1
      return a.value.toLowerCase().localeCompare(b.value.toLowerCase())
    })
  const sourceOfFundsList = Object.keys(KycSourceOfFunds)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: t(
        `personalInformation.kycIncomeDetails.select.sourceOfFunds.options.${key}`,
      ),
      value: KycSourceOfFunds[key as keyof typeof KycSourceOfFunds],
    }))
    .sort((a, b) => {
      if (a.value.toLowerCase() === "other") return 1
      return a.value.toLowerCase().localeCompare(b.value.toLowerCase())
    })

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isTabletView = useBreakpointValue({ base: false, md: true, lg: false })
  const validationSchema = useIncomeDetailsSchema()
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
        <Heading mb={{ base: 8, md: 6 }} fontSize={{ base: "2xl", md: "3xl" }}>
          {t("personalInformation.kycIncomeDetails.heading")}
        </Heading>

        <Text
          fontSize={{ base: "xs", md: "sm" }}
          color="gray.400"
          mb={{ base: 0, md: 6 }}
        >
          {t("personalInformation.kycIncomeDetails.description")}
        </Text>
      </Container>

      <Center px={{ base: 0, md: 4, lg: 16 }} py={{ base: 12, md: 0 }}>
        <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
      </Center>

      <Container
        flex={isTabletView ? "2" : "1"}
        {...(isTabletView && { maxW: "500px" })}
        {...(isMobileView && { px: "0", h: "100vh" })}
      >
        <Formik<KycPersonalInformation>
          initialValues={{
            incomeDetails: {
              annualIncome:
                kycPersonalInformation?.incomeDetails?.annualIncome ||
                undefined,
              netWorth:
                kycPersonalInformation?.incomeDetails?.netWorth || undefined,
              sourceOfFunds:
                kycPersonalInformation?.incomeDetails?.sourceOfFunds || [],
              sourceOfWealth:
                kycPersonalInformation?.incomeDetails?.sourceOfWealth || [],
              sourceOfFundsOtherText:
                kycPersonalInformation?.incomeDetails?.sourceOfFundsOtherText ||
                undefined,
            },
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          {...(isMobileView && {
            mb: 24,
          })}
          enableReinitialize
        >
          {(formikProps) => (
            <Form style={{ width: "100%" }}>
              <VStack spacing="8">
                <SelectControl
                  name="incomeDetails.annualIncome"
                  aria-label="annualIncome"
                  label={t(
                    "personalInformation.kycIncomeDetails.select.annualIncome.label",
                  )}
                  selectProps={{
                    placeholder: t("common:select.placeholder"),
                    options: annualIncomeList,
                  }}
                />

                <SelectControl
                  name="incomeDetails.netWorth"
                  aria-label="netWorth"
                  label={t(
                    "personalInformation.kycIncomeDetails.select.netWorth.label",
                  )}
                  selectProps={{
                    placeholder: t("common:select.placeholder"),
                    options: netWorthList,
                  }}
                  tooltip={t(
                    "personalInformation.kycIncomeDetails.select.netWorth.tooltip.text",
                  )}
                />

                <SelectControl
                  name="incomeDetails.sourceOfWealth"
                  aria-label="sourceOfWealth"
                  label={t(
                    "personalInformation.kycIncomeDetails.select.sourceOfWealth.label",
                  )}
                  selectProps={{
                    placeholder: t("common:select.placeholder"),
                    options: sourceOfWealthList,
                    isMulti: true,
                  }}
                  tooltip={t(
                    "personalInformation.kycIncomeDetails.select.sourceOfWealth.tooltip.text",
                  )}
                />

                <SelectControl
                  name="incomeDetails.sourceOfFunds"
                  aria-label="sourceOfFunds"
                  label={t(
                    "personalInformation.kycIncomeDetails.select.sourceOfFunds.label",
                  )}
                  selectProps={{
                    placeholder: t("common:select.placeholder"),
                    options: sourceOfFundsList,
                    isMulti: true,
                    onChange: (selectOptions) => {
                      if (Array.isArray(selectOptions)) {
                        const values = selectOptions?.map(
                          (x: Option) => x.value,
                        )
                        formikProps.setFieldValue(
                          "incomeDetails.sourceOfFunds",
                          values,
                        )
                        if (!values?.includes(KycSourceOfFunds.Other)) {
                          formikProps.setFieldValue(
                            "incomeDetails.sourceOfFundsOtherText",
                            null,
                          )
                          formikProps.setFieldTouched(
                            "incomeDetails.sourceOfFundsOtherText",
                            false,
                          )
                        }
                      }
                    },
                  }}
                  tooltip={t(
                    "personalInformation.kycIncomeDetails.select.sourceOfFunds.tooltip.text",
                  )}
                />
                {formikProps?.values?.incomeDetails?.sourceOfFunds?.includes(
                  KycSourceOfFunds.Other,
                ) && (
                  <>
                    <TextareaControl
                      name="incomeDetails.sourceOfFundsOtherText"
                      placeholder={t(
                        "personalInformation.kycIncomeDetails.input.sourceOfFundsOtherTextPlaceholder",
                      )}
                      mt="2"
                    />
                  </>
                )}
              </VStack>
              <KycPersonalInformationFormActions ref={ref} {...formikProps} />
            </Form>
          )}
        </Formik>
      </Container>
    </Flex>
  )
})

export default React.memo(KycPersonalInformationIncomeDetails)
