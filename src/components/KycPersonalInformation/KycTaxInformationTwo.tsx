import {
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/layout"
import {
  chakra,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useBreakpointValue,
} from "@chakra-ui/react"
import { FieldArray, Form, Formik } from "formik"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import { useCountryList } from "~/hooks/useList"
import {
  KycPersonalInformation,
  NoTinReason,
  TinInformation,
} from "~/services/mytfo/types"

import {
  CheckboxControl,
  InfoIcon,
  InputControl,
  Link,
  SelectControl,
} from ".."
import { useTaxInformationTwoSchema } from "./KycPersonalInformation.schema"
import KycPersonalInformationFormActions from "./KycPersonalInformationFormActions"
import { useKycPersonalInformationFormContext } from "./KycPersonalInformationFormContext"

//@ts-ignore
export const TinInformationList = ({ form }) => {
  const { t } = useTranslation("kyc")
  const countryList = useCountryList()
  const noTinReasonList = Object.keys(NoTinReason)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: t(
        `kyc:personalInformation.kycTaxInformation.select.reasonForNoTin.options.${key}`,
      ),
      value: NoTinReason[key as keyof typeof NoTinReason],
    }))
  const isMobileView = useBreakpointValue({ base: true, md: false })
  return (
    <Form>
      <Flex direction="column">
        {form.values.taxInformation.tinInformation.map(
          (tinInformationElement: TinInformation, index: number) => (
            <VStack key={index} alignItems="flex-start" spacing={6} mb={8}>
              <Text fontSize="14px" color="gray.600">
                {
                  countryList.find((country) => {
                    return (
                      country.value ==
                      tinInformationElement.countriesOfTaxResidency
                    )
                  })?.label
                }
              </Text>
              <Stack
                direction={["column", "row"]}
                alignItems="flex-start"
                spacing={isMobileView ? 3 : 8}
                width="full"
              >
                <InputControl
                  width={isMobileView ? "full" : "sm"}
                  name={`taxInformation.tinInformation[${index}].globalTaxIdentificationNumber`}
                  inputProps={{
                    placeholder: t(
                      "personalInformation.kycTaxInformation.input.globalTaxIdentificationNumber.placeholder",
                    ),
                  }}
                  isDisabled={tinInformationElement.haveNoTin}
                  label={
                    <Stack isInline alignItems="flex-end" mb={2}>
                      <Text fontSize="sm" color="gray.400">
                        {t(
                          "personalInformation.kycTaxInformation.input.globalTaxIdentificationNumber.label",
                        )}
                      </Text>
                      <Popover>
                        <PopoverTrigger>
                          <chakra.span ps="2" lineHeight="1">
                            <InfoIcon
                              boxSize="14px"
                              aria-label="Info icon"
                              color="primary.500"
                            />
                          </chakra.span>
                        </PopoverTrigger>
                        <PopoverContent
                          outline="0 !important"
                          bg="gunmetal.500"
                          boxShadow="red"
                          sx={{
                            _focus: { outline: "0 !important" },
                          }}
                        >
                          <PopoverArrow bg="gunmetal.500" />
                          <PopoverBody fontSize="sm">
                            <Trans
                              i18nKey={
                                "kyc:personalInformation.kycTaxInformation.input.globalTaxIdentificationNumber.tooltip.text"
                              }
                              components={{
                                link: (
                                  <Link
                                    textDecoration="underline"
                                    href="https://www.oecd.org/"
                                    target="_blank"
                                  />
                                ),
                              }}
                            />
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Stack>
                  }
                />
                <Stack {...(!isMobileView && { pt: "8" })}>
                  <CheckboxControl
                    name={`taxInformation.tinInformation[${index}].haveNoTin`}
                    label={t(
                      "personalInformation.kycTaxInformation.checkbox.haveTin.label",
                    )}
                    onChange={(
                      changeEvent: React.ChangeEvent<HTMLInputElement>,
                    ) => {
                      const checkValue = "true" !== changeEvent.target.value
                      form.setFieldValue(
                        `taxInformation.tinInformation[${index}].haveNoTin`,
                        checkValue,
                      )
                      if (checkValue) {
                        form.setFieldValue(
                          `taxInformation.tinInformation[${index}].reasonForNoTinExplanation`,
                          null,
                        )
                        form.setFieldTouched(
                          `taxInformation.tinInformation[${index}].reasonForNoTinExplanation`,
                          false,
                        )
                        form.setFieldValue(
                          `taxInformation.tinInformation[${index}].reasonForNoTin`,
                          null,
                        )
                        form.setFieldTouched(
                          `taxInformation.tinInformation[${index}].reasonForNoTin`,
                          false,
                        )
                        form.setFieldValue(
                          `taxInformation.tinInformation[${index}].globalTaxIdentificationNumber`,
                          "",
                        )
                        form.setFieldTouched(
                          `taxInformation.tinInformation[${index}].globalTaxIdentificationNumber`,
                          false,
                        )
                      }
                    }}
                    //@ts-ignore
                    containerProps={{
                      width: "fit-content",
                    }}
                    mb={2}
                  />
                </Stack>
              </Stack>
              {tinInformationElement.haveNoTin && (
                <Stack width="full">
                  <SelectControl
                    width={isMobileView ? "full" : "sm"}
                    name={`taxInformation.tinInformation[${index}].reasonForNoTin`}
                    label={t(
                      "personalInformation.kycTaxInformation.select.reasonForNoTin.label",
                    )}
                    selectProps={{
                      placeholder: t("common:select.placeholder"),
                      options: noTinReasonList,
                    }}
                  />
                  {tinInformationElement.reasonForNoTin ===
                    NoTinReason.UnableToObtainTin && (
                    <InputControl
                      width={isMobileView ? "full" : "sm"}
                      name={`taxInformation.tinInformation[${index}].reasonForNoTinExplanation`}
                      inputProps={{
                        placeholder: t(
                          "personalInformation.kycTaxInformation.input.reasonForNoTinExplanation.placeholder",
                        ),
                      }}
                    />
                  )}
                </Stack>
              )}
            </VStack>
          ),
        )}
      </Flex>
    </Form>
  )
}
const KycTaxInformationTwo = React.forwardRef<HTMLDivElement, unknown>(
  function KycTaxInformationTwo(_props, _ref) {
    const { ref, handleSubmit } = useKycPersonalInformationFormContext()
    const { t } = useTranslation("kyc")
    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isTabletView = useBreakpointValue({
      base: false,
      md: true,
      lg: false,
    })
    const validationSchema = useTaxInformationTwoSchema()

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
            {t(`personalInformation.kycTaxInformation.title`)}
          </Heading>

          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color="gray.400"
            mb={{ base: 0, md: 6 }}
          >
            {t("personalInformation.kycTaxInformation.description")}
          </Text>
        </Container>

        <Center px={{ base: 0, md: 4, lg: 16 }} py={{ base: 12, md: 0 }}>
          <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
        </Center>

        <Container flex={isTabletView ? "2" : "1"} px="0">
          <Formik<Pick<KycPersonalInformation, "taxInformation">>
            initialValues={{
              taxInformation: {
                taxableInUSA:
                  kycPersonalInformation?.taxInformation?.taxableInUSA !== null
                    ? kycPersonalInformation?.taxInformation?.taxableInUSA
                      ? ("yes" as const)
                      : ("no" as const)
                    : undefined,
                locationOfMainTaxDomicile:
                  kycPersonalInformation?.taxInformation
                    ?.locationOfMainTaxDomicile,
                tinInformation:
                  kycPersonalInformation?.taxInformation?.tinInformation || [],
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
                  columns={{ base: 1, md: 1 }}
                  spacing={8}
                  alignItems="baseline"
                  mb={8}
                >
                  <FieldArray
                    name="taxInformation.tinInformation"
                    //@ts-ignore
                    component={TinInformationList}
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

export default React.memo(KycTaxInformationTwo)
