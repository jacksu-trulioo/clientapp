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
import { format } from "date-fns"
import { Form, Formik } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import { useCountryList } from "~/hooks/useList"
import { useUser } from "~/hooks/useUser"
import { Gender, KycPersonalInformation } from "~/services/mytfo/types"

import { InputControl, SelectControl } from ".."
import Datepicker from "../DatePicker/DatePicker"
import { usePersonalInfoCountryDobSchema } from "./KycPersonalInformation.schema"
import KycPersonalInformationFormActions from "./KycPersonalInformationFormActions"
import { useKycPersonalInformationFormContext } from "./KycPersonalInformationFormContext"

const KycPersonalInfoCountryDOB = React.forwardRef<HTMLDivElement, unknown>(
  function KycPersonalInfoCountryDob(_props, _ref) {
    const { ref, handleSubmit } = useKycPersonalInformationFormContext()
    const { user } = useUser()
    const { t } = useTranslation("kyc")
    const countryList = useCountryList()

    const genderList = Object.keys(Gender)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: t(`common:select.options.gender.${key}`),
        value: Gender[key as keyof typeof Gender],
      }))

    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isTabletView = useBreakpointValue({
      base: false,
      md: true,
      lg: false,
    })
    const { data: kycPersonalInformation, error } =
      useSWR<KycPersonalInformation>("/api/user/kyc/personal-information")

    const validationSchema = usePersonalInfoCountryDobSchema()

    const isLoading = !kycPersonalInformation && !error

    const countryListOtherNationality = React.useMemo(() => {
      return countryList.filter(
        (country) =>
          country.value !==
          (kycPersonalInformation?.nationality || user?.profile.nationality),
      )
    }, [
      countryList,
      kycPersonalInformation?.nationality,
      user?.profile.nationality,
    ])

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
            {t("personalInformation.KycPersonalInfoCountryDob.heading")}
          </Heading>

          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color="gray.400"
            mb={{ base: 0, md: 6 }}
          >
            {t("personalInformation.KycPersonalInfoCountryDob.description")}
          </Text>
        </Container>

        <Center px={{ base: 0, md: 4, lg: 16 }} py={{ base: "48px", md: 0 }}>
          <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
        </Center>

        <Container
          flex={isTabletView ? "3" : "1"}
          px="0"
          {...(isMobileView && { px: "0", h: "100vh" })}
        >
          <Formik<
            Pick<
              KycPersonalInformation,
              | "gender"
              | "dateOfBirth"
              | "placeOfBirth"
              | "nationality"
              | "otherNationality"
              | "countryOfBirth"
            >
          >
            initialValues={{
              gender: kycPersonalInformation?.gender,
              dateOfBirth: kycPersonalInformation?.dateOfBirth
                ? new Date(kycPersonalInformation?.dateOfBirth)
                : undefined,
              countryOfBirth: kycPersonalInformation?.countryOfBirth,
              placeOfBirth: kycPersonalInformation?.placeOfBirth,
              nationality:
                kycPersonalInformation?.nationality ||
                user?.profile.nationality,
              otherNationality: kycPersonalInformation?.otherNationality,
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
                  <SelectControl
                    name="gender"
                    aria-label="gender"
                    label={t(
                      "personalInformation.KycPersonalInfoCountryDob.select.gender.label",
                    )}
                    selectProps={{
                      placeholder: t("common:select.placeholder"),
                      options: genderList,
                    }}
                  />
                  <Datepicker
                    name="dateOfBirth"
                    label={t(
                      "personalInformation.KycPersonalInfoCountryDob.input.dateOfBirth.label",
                    )}
                    selectedDate={formikProps?.values?.dateOfBirth}
                    placeholder={t("common:datepicker.placeholder")}
                    onDateChange={async (date: Date) => {
                      await formikProps.setFieldValue(
                        "dateOfBirth",
                        format(new Date(date), "yyyy-MM-dd"),
                      )
                    }}
                    minDate={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 85),
                      )
                    }
                    maxDate={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 18),
                      )
                    }
                    showMonthDropdown
                    showYearDropdown
                    yearDropdownItemNumber={85}
                  />

                  <SelectControl
                    name="countryOfBirth"
                    aria-label="countryOfBirth"
                    label={t(
                      "personalInformation.KycPersonalInfoCountryDob.select.countryOfBirth.label",
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
                      "personalInformation.KycPersonalInfoCountryDob.input.placeOfBirth.placeholder",
                    )}
                    inputProps={{
                      placeholder: t(
                        "personalInformation.KycPersonalInfoCountryDob.input.placeOfBirth.placeholder",
                      ),
                      pattern: "/^[a-zA-Z ]*$/",
                    }}
                  />
                  {/* User cannot change the nationality which he entered
                  previosly in pre propsal flow */}
                  <SelectControl
                    name="nationality"
                    aria-label="nationality"
                    isDisabled
                    label={t(
                      "personalInformation.KycPersonalInfoCountryDob.select.nationality.label",
                    )}
                    selectProps={{
                      placeholder: t("common:select.placeholder"),
                      options: countryList,
                    }}
                  />
                  <SelectControl
                    name="otherNationality"
                    aria-label="otherNationality"
                    label={t(
                      "personalInformation.KycPersonalInfoCountryDob.select.otherNationality.label",
                    )}
                    selectProps={{
                      placeholder: t("common:select.placeholder"),
                      options: countryListOtherNationality,
                      isClearable: true,
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

export default React.memo(KycPersonalInfoCountryDOB)
