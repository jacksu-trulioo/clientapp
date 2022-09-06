import {
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Text,
} from "@chakra-ui/layout"
import { chakra, Stack, Tooltip, useBreakpointValue } from "@chakra-ui/react"
import { ErrorMessage, FieldArray, Form, Formik } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import { useCountryList } from "~/hooks/useList"
import { KycPersonalInformation, TinInformation } from "~/services/mytfo/types"

import { CloseIcon, InfoIcon, PlusIcon, SelectControl } from ".."
import { useTaxInformationOneSchema } from "./KycPersonalInformation.schema"
import KycPersonalInformationFormActions from "./KycPersonalInformationFormActions"
import { useKycPersonalInformationFormContext } from "./KycPersonalInformationFormContext"

//@ts-ignore
export const CountryOfResidencyList = ({ remove, push, form }) => {
  const { t } = useTranslation("kyc")
  const countryList = useCountryList()
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lg: false,
  })

  return (
    <Flex direction="column">
      <Stack isInline alignItems="flex-end" mb={1}>
        <Text fontSize="sm" color="gray.400">
          {t(
            "personalInformation.kycTaxInformation.select.countriesOfTaxResidency.label",
          )}
        </Text>
        <Tooltip
          hasArrow
          label={t(
            "personalInformation.kycTaxInformation.select.countriesOfTaxResidency.tooltip.label",
          )}
          placement="bottom"
        >
          <chakra.span>
            <InfoIcon
              boxSize="14px"
              aria-label="Info icon"
              color="primary.500"
            />
          </chakra.span>
        </Tooltip>
      </Stack>
      {form.values.taxInformation.tinInformation.map(
        (tinInformationElement: TinInformation, index: number) => (
          <HStack key={index} alignItems="center" spacing={5}>
            <SelectControl
              width={isMobileView && isTabletView ? "full" : "sm"}
              name={`taxInformation.tinInformation[${index}].countriesOfTaxResidency`}
              selectProps={{
                placeholder: t("common:select.placeholder"),
                options: countryList,
              }}
            />
            {form.values.taxInformation.tinInformation.length !== 1 && (
              <CloseIcon
                boxSize={5}
                color="primary.500"
                onClick={() => {
                  remove(index)
                }}
              />
            )}
          </HStack>
        ),
      )}
      {typeof form.errors?.taxInformation?.tinInformation === "string" && (
        <ErrorMessage
          name="taxInformation.tinInformation"
          render={(msg) => (
            <Text color="red.400" fontSize="xs" mt={2} fontWeight="bold">
              {msg}
            </Text>
          )}
        />
      )}
      {form.values.taxInformation.tinInformation.length < 3 && (
        <HStack
          width={isMobileView ? "xs" : "sm"}
          alignItems="baseline"
          justifyContent={
            isMobileView || isTabletView ? "flex-start" : "flex-end"
          }
          color="primary.500"
          fontSize="small"
          mt={4}
          cursor="default"
          onClick={() => {
            push({
              countriesOfTaxResidency: "",
              globalTaxIdentificationNumber: undefined,

              haveTin: undefined,

              reasonForNoTin: undefined,

              reasonForNoTinExplanation: undefined,
            })
          }}
        >
          <Text textDecoration="underline">
            {t("personalInformation.kycTaxInformation.button.addNew.label")}
          </Text>
          <PlusIcon />
        </HStack>
      )}
    </Flex>
  )
}

const KycTaxInformationOne = React.forwardRef<HTMLDivElement, unknown>(
  function KycTaxInformationOne(_props, _ref) {
    const { ref, handleSubmit } = useKycPersonalInformationFormContext()
    const { t } = useTranslation("kyc")
    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isTabletView = useBreakpointValue({
      base: false,
      md: true,
      lg: false,
    })
    const isDesktopView = useBreakpointValue({ base: false, lg: true })
    const countryList = useCountryList()
    const validationSchema = useTaxInformationOneSchema()
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
                locationOfMainTaxDomicile:
                  kycPersonalInformation?.taxInformation
                    ?.locationOfMainTaxDomicile,
                tinInformation: kycPersonalInformation?.taxInformation
                  ?.tinInformation || [
                  {
                    countriesOfTaxResidency: "",
                  },
                ],
                taxableInUSA:
                  kycPersonalInformation?.taxInformation?.taxableInUSA === true
                    ? "yes"
                    : "no",
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
                  <SelectControl
                    pt="2"
                    name="taxInformation.locationOfMainTaxDomicile"
                    aria-label="locationOfMainTaxDomicile"
                    label={t(
                      "personalInformation.kycTaxInformation.select.locationOfMainTaxDomicile.label",
                    )}
                    {...(isDesktopView && { width: "sm" })}
                    selectProps={{
                      placeholder: t("common:select.placeholder"),
                      options: countryList,
                    }}
                    tooltip={t(
                      "personalInformation.kycTaxInformation.select.locationOfMainTaxDomicile.tooltip.label",
                    )}
                  />
                  <FieldArray
                    name="taxInformation.tinInformation"
                    //@ts-ignore
                    component={CountryOfResidencyList}
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

export default React.memo(KycTaxInformationOne)
