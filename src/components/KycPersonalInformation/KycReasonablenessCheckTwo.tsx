import {
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/layout"
import { Stack, useBreakpointValue, VStack } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import {
  KycPersonalInformation,
  PhoneNumberNotMatchTaxResidence,
} from "~/services/mytfo/types"

import { InputControl, Radio, RadioGroupControl } from ".."
import { useKycReasonablenessCheckTwoSchema } from "./KycPersonalInformation.schema"
import KycPersonalInformationFormActions from "./KycPersonalInformationFormActions"
import { useKycPersonalInformationFormContext } from "./KycPersonalInformationFormContext"

const KycPepCheck = React.forwardRef<HTMLDivElement, unknown>(
  function KycPepCheck(_props, _ref) {
    const { ref, handleSubmit } = useKycPersonalInformationFormContext()
    const { t } = useTranslation("kyc")
    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isTabletView = useBreakpointValue({
      base: false,
      md: true,
      lg: false,
    })
    const validationSchema = useKycReasonablenessCheckTwoSchema()
    const checkList = Object.keys(PhoneNumberNotMatchTaxResidence)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        key: key,
        label: t(
          `kyc:personalInformation.kycReasonablenessCheck.radio.phoneNumberNotMatchTaxResidence.options.${key}`,
        ),
        value:
          PhoneNumberNotMatchTaxResidence[
            key as keyof typeof PhoneNumberNotMatchTaxResidence
          ],
      }))

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
            {t("personalInformation.kycReasonablenessCheck.title")}
          </Heading>

          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color="gray.400"
            mb={{ base: 0, md: 6 }}
          >
            {t("personalInformation.kycReasonablenessCheck.description")}
          </Text>
        </Container>

        <Center px={{ base: 0, md: 4, lg: 16 }} py={{ base: 12, md: 0 }}>
          <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
        </Center>

        <Container flex={isTabletView ? "2" : "1"} px="0">
          <Formik<Pick<KycPersonalInformation, "reasonablenessCheck">>
            initialValues={{
              reasonablenessCheck: {
                addressNotMatchTaxResidence: {
                  checkValue:
                    kycPersonalInformation?.reasonablenessCheck
                      ?.addressNotMatchTaxResidence?.checkValue,
                  otherText:
                    kycPersonalInformation?.reasonablenessCheck
                      ?.addressNotMatchTaxResidence?.otherText,
                  isValid:
                    kycPersonalInformation?.reasonablenessCheck
                      ?.addressNotMatchTaxResidence?.isValid,
                },
                phoneNumberNotMatchTaxResidence: {
                  checkValue:
                    kycPersonalInformation?.reasonablenessCheck
                      ?.phoneNumberNotMatchTaxResidence?.checkValue,
                  otherText:
                    kycPersonalInformation?.reasonablenessCheck
                      ?.phoneNumberNotMatchTaxResidence?.otherText,
                  isValid:
                    kycPersonalInformation?.reasonablenessCheck
                      ?.phoneNumberNotMatchTaxResidence?.isValid,
                },
                nationalityNotMatchTaxResidence: {
                  checkValue:
                    kycPersonalInformation?.reasonablenessCheck
                      ?.nationalityNotMatchTaxResidence?.checkValue,
                  otherText:
                    kycPersonalInformation?.reasonablenessCheck
                      ?.nationalityNotMatchTaxResidence?.otherText,
                  isValid:
                    kycPersonalInformation?.reasonablenessCheck
                      ?.nationalityNotMatchTaxResidence?.isValid,
                },
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
                <Stack isInline alignItems="flex-end" mb="7">
                  <Text fontSize="sm" color="gray.400">
                    {t(
                      "personalInformation.kycReasonablenessCheck.radio.phoneNumberNotMatchTaxResidence.label",
                    )}
                  </Text>
                </Stack>
                <VStack spacing={["6", "8"]} alignItems="start">
                  <RadioGroupControl
                    name="reasonablenessCheck.phoneNumberNotMatchTaxResidence.checkValue"
                    onChange={async (
                      valueChangeEvent: React.ChangeEvent<HTMLInputElement>,
                    ) => {
                      await formikProps.setFieldValue(
                        "reasonablenessCheck.phoneNumberNotMatchTaxResidence.checkValue",
                        valueChangeEvent?.target?.value,
                      )
                      if (
                        valueChangeEvent?.target?.value ===
                        PhoneNumberNotMatchTaxResidence.PhoneNumberNotMatchTaxResidence2
                      ) {
                        await formikProps.setFieldValue(
                          "reasonablenessCheck.phoneNumberNotMatchTaxResidence.otherText",
                          null,
                        )
                        await formikProps.setFieldTouched(
                          "reasonablenessCheck.phoneNumberNotMatchTaxResidence.otherText",
                          false,
                        )
                      }
                    }}
                  >
                    {checkList.map((option) => (
                      <>
                        <Radio
                          variant="filled"
                          key={option.label}
                          value={option.value}
                          width="full"
                        >
                          <Text>{option.label}</Text>
                        </Radio>
                      </>
                    ))}
                  </RadioGroupControl>
                </VStack>
                {formikProps.values.reasonablenessCheck
                  ?.phoneNumberNotMatchTaxResidence?.checkValue ===
                  PhoneNumberNotMatchTaxResidence.PhoneNumberNotMatchTaxResidence2 && (
                  <>
                    <InputControl
                      name="reasonablenessCheck.phoneNumberNotMatchTaxResidence.otherText"
                      inputProps={{
                        placeholder: t(
                          "personalInformation.kycReasonablenessCheck.input.placeholder",
                        ),
                      }}
                      mt="2"
                    />
                  </>
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

export default React.memo(KycPepCheck)
