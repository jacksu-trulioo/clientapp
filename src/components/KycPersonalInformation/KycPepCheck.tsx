/* eslint-disable react/jsx-no-undef */
import {
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/layout"
import {
  chakra,
  Stack,
  Tooltip,
  useBoolean,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import { Form, Formik } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import { useCountryList } from "~/hooks/useList"
import {
  AccountHolderRelationship,
  KycPersonalInformation,
  PepCheck,
} from "~/services/mytfo/types"

import {
  InfoIcon,
  InputControl,
  Radio,
  RadioGroupControl,
  SelectControl,
} from ".."
import Datepicker from "../DatePicker/DatePicker"
import { usePepCheckSchema } from "./KycPersonalInformation.schema"
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
    const validationSchema = usePepCheckSchema()
    const [isTooltipOpen, setIsTooltipOpen] = useBoolean()
    const pepList = Object.keys(PepCheck)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        key: key,
        label: t(
          `kyc:personalInformation.KycPepCheck.radio.options.${key}.title`,
        ),
        value: `${PepCheck[key as keyof typeof PepCheck]}`,
      }))
    const jurisdictionList = useCountryList()
    const accountHolderRelationshipList = Object.keys(AccountHolderRelationship)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: t(
          `kyc:personalInformation.KycPepCheck.select.accountHolderRelationship.options.${key}`,
        ),
        value:
          AccountHolderRelationship[
            key as keyof typeof AccountHolderRelationship
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
            {t("personalInformation.KycPepCheck.title")}
          </Heading>

          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color="gray.400"
            mb={{ base: 0, md: 6 }}
          >
            {t("personalInformation.page.description")}
          </Text>
        </Container>

        <Center px={{ base: 0, md: 4, lg: 16 }} py={{ base: "48px", md: 0 }}>
          <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
        </Center>

        <Container flex={isTabletView ? "2" : "1"} px="0">
          <Formik<Pick<KycPersonalInformation, "pepCheck">>
            initialValues={{
              pepCheck: {
                optionValue: kycPersonalInformation?.pepCheck?.optionValue
                  ? kycPersonalInformation?.pepCheck?.optionValue.toString()
                  : undefined,
                dateOfAppointment: kycPersonalInformation?.pepCheck
                  ?.dateOfAppointment
                  ? new Date(
                      kycPersonalInformation?.pepCheck?.dateOfAppointment,
                    )
                  : undefined,
                fullLegalName: kycPersonalInformation?.pepCheck?.fullLegalName,
                accountHolderRelationship:
                  kycPersonalInformation?.pepCheck?.accountHolderRelationship,
                jurisdiction: kycPersonalInformation?.pepCheck?.jurisdiction,
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
                    {t("personalInformation.KycPepCheck.radio.label")}
                  </Text>
                  <Tooltip
                    hasArrow
                    label={t("personalInformation.KycPepCheck.tooltip.text")}
                    placement="bottom"
                    isOpen={isTooltipOpen}
                  >
                    <chakra.span>
                      <InfoIcon
                        onMouseEnter={setIsTooltipOpen.on}
                        onMouseLeave={setIsTooltipOpen.off}
                        onClick={setIsTooltipOpen.on}
                        aria-label="Info icon"
                        color="primary.500"
                      />
                    </chakra.span>
                  </Tooltip>
                </Stack>
                <VStack spacing={["6", "8"]} alignItems="start" maxW="md">
                  <RadioGroupControl name="pepCheck.optionValue">
                    {pepList.map((option) => (
                      <>
                        <Radio
                          variant="filled"
                          key={option.label}
                          value={option.value}
                          width="full"
                        >
                          <Text>{option.label}</Text>
                        </Radio>
                        {`${formikProps.values.pepCheck?.optionValue}` ==
                        `${PepCheck[option.key as keyof typeof PepCheck]}` ? (
                          <VStack spacing="4" alignItems="start" maxW="md">
                            {formikProps.values.pepCheck?.optionValue ==
                              PepCheck.YesIamPepRelated && (
                              <>
                                <InputControl
                                  aria-label="fullLegalName"
                                  name="pepCheck.fullLegalName"
                                  pt="2"
                                  label={t(
                                    "personalInformation.KycPepCheck.input.fullLegalName.label",
                                  )}
                                  inputProps={{
                                    placeholder: t(
                                      "personalInformation.KycPepCheck.input.fullLegalName.label",
                                    ),
                                    width: "100%",
                                  }}
                                />
                                <SelectControl
                                  aria-label="accountHolderRelationship"
                                  name="pepCheck.accountHolderRelationship"
                                  label={t(
                                    "personalInformation.KycPepCheck.select.accountHolderRelationship.label",
                                  )}
                                  selectProps={{
                                    placeholder: t("common:select.placeholder"),
                                    options: accountHolderRelationshipList,
                                  }}
                                />
                                <SelectControl
                                  aria-label="jurisdiction"
                                  name="pepCheck.jurisdiction"
                                  label={t(
                                    "personalInformation.KycPepCheck.select.jurisdiction.label",
                                  )}
                                  selectProps={{
                                    placeholder: t("common:select.placeholder"),
                                    options: jurisdictionList,
                                  }}
                                />
                              </>
                            )}

                            {(formikProps.values.pepCheck?.optionValue ==
                              PepCheck.YesIamPep ||
                              formikProps.values.pepCheck?.optionValue ==
                                PepCheck.YesIamPepRelated) && (
                              <Datepicker
                                name="pepCheck.dateOfAppointment"
                                label={t(
                                  "personalInformation.KycPepCheck.input.dateOfAppointment.label",
                                )}
                                selectedDate={
                                  formikProps?.values?.pepCheck
                                    ?.dateOfAppointment
                                }
                                placeholder={t("common:datepicker.placeholder")}
                                onDateChange={async (date: Date) => {
                                  await formikProps.setFieldValue(
                                    "pepCheck.dateOfAppointment",
                                    new Date(date),
                                  )
                                }}
                                minDate={
                                  new Date(
                                    new Date().setFullYear(
                                      new Date().getFullYear() - 85,
                                    ),
                                  )
                                }
                                maxDate={new Date()}
                                showMonthDropdown
                                showYearDropdown
                                yearDropdownItemNumber={85}
                              />
                            )}
                          </VStack>
                        ) : null}
                      </>
                    ))}
                  </RadioGroupControl>
                </VStack>
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
