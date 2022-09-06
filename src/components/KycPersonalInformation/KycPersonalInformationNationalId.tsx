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

import { InputControl } from "~/components"
import { KycPersonalInformation } from "~/services/mytfo/types"

import KycPersonalInformationFormActions from "./KycPersonalInformationFormActions"
import { useKycPersonalInformationFormContext } from "./KycPersonalInformationFormContext"

const KycPersonalInfoNationalId = React.forwardRef<HTMLDivElement, unknown>(
  function KycPersonalInfoNationalId(_props, _ref) {
    const { ref, handleSubmit } = useKycPersonalInformationFormContext()
    const { t } = useTranslation("kyc")
    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isTabletView = useBreakpointValue({
      base: false,
      md: true,
      lg: false,
    })
    const { data: kycPersonalInformation, error } =
      useSWR<KycPersonalInformation>("/api/user/kyc/personal-information")

    const isLoading = !kycPersonalInformation && !error

    // need to handle error state later
    if (isLoading || error) {
      return null
    }

    function getNationalIdValidation(nationality: string) {
      if (nationality === "SA") {
        return Yup.string()
          .matches(/^\d+$/, t("common:errors.numberAllowed"))
          .length(
            10,
            t(
              "personalInformation.kycPersonalInfoNationalId.input.nationalId.errors.lengthKSA",
            ),
          )
          .required(t("common:errors.required"))
          .nullable()
      } else if (nationality === "BH") {
        return Yup.string()
          .matches(/^\d+$/, t("common:errors.numberAllowed"))
          .length(
            9,
            t(
              "personalInformation.kycPersonalInfoNationalId.input.nationalId.errors.lengthBahrain",
            ),
          )
          .required(t("common:errors.required"))
          .nullable()
      } else {
        return Yup.string()
          .matches(
            /^[a-zA-Z0-9\-]*$/,
            t("common:errors.alphaEnglishNumericDashesAllowed"),
          )
          .max(
            15,
            t(
              "personalInformation.kycPersonalInfoNationalId.input.nationalId.errors.lengthOther",
            ),
          )
          .required(t("common:errors.required"))
          .nullable()
      }
    }

    const validationSchema = Yup.object().shape({
      nationalIdNumber: getNationalIdValidation(
        kycPersonalInformation?.nationality || "",
      ),
      passportNumber: Yup.string()
        .trim()
        .matches(/^[a-zA-Z0-9]*$/, {
          excludeEmptyString: true,
          message: t("common:errors.alphaEnglishAllowed"),
        })
        .max(10, t("common:errors.maxLength"))
        .required(t("common:errors.required"))
        .nullable(),
    })

    return (
      <Flex direction={{ base: "column", md: "row" }} py={{ base: 2, md: 16 }}>
        <Container flex="1" maxW={{ base: "full", md: "280px" }} px="0">
          <Heading
            mb={{ base: 8, md: 6 }}
            fontSize={{ base: "2xl", md: "3xl" }}
          >
            {t("personalInformation.kycPersonalInfoNationalId.heading")}
          </Heading>

          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color="gray.400"
            mb={{ base: 0, md: 6 }}
          >
            {t("personalInformation.kycPersonalInfoNationalId.description")}
          </Text>
        </Container>

        <Center px={{ base: 0, md: 4, lg: 16 }} py={{ base: "48px", md: 0 }}>
          <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
        </Center>

        <Container flex={isTabletView ? "2" : "1"} px="0">
          <Formik<KycPersonalInformation>
            initialValues={{
              nationalIdNumber: kycPersonalInformation?.nationalIdNumber,
              passportNumber: kycPersonalInformation?.passportNumber,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            {...(isMobileView && {
              mb: "24",
            })}
          >
            {(formikProps) => (
              <Form style={{ width: "100%" }}>
                <SimpleGrid columns={1} spacing={8} alignItems="baseline">
                  <InputControl
                    aria-label="nationalIdNumber"
                    name="nationalIdNumber"
                    pt="2"
                    label={t(
                      "personalInformation.kycPersonalInfoNationalId.input.nationalId.label",
                    )}
                    inputProps={{
                      placeholder: t(
                        "personalInformation.kycPersonalInfoNationalId.input.nationalId.placeholder",
                      ),
                    }}
                  />
                  <InputControl
                    aria-label="passport"
                    name="passportNumber"
                    pt="2"
                    label={t(
                      "personalInformation.kycPersonalInfoNationalId.input.passport.placeholder",
                    )}
                    inputProps={{
                      placeholder: t(
                        "personalInformation.kycPersonalInfoNationalId.input.passport.placeholder",
                      ),
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

export default React.memo(KycPersonalInfoNationalId)
