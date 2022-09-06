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
import { Button, Portal, useBreakpointValue } from "@chakra-ui/react"
import { format, isValid } from "date-fns"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import { useCountryList } from "~/hooks/useList"
import {
  Gender,
  KycPersonalInformation,
  KycPersonalInformationAddress,
} from "~/services/mytfo/types"

import { useKycPersonalInformationFormContext } from "./KycPersonalInformationFormContext"

const KycAbsherCitizenDetails = React.forwardRef<HTMLDivElement, unknown>(
  function KycAbsherCitizenDetails(_props, _ref) {
    const { ref, isFirstPage, previousPage, nextPage } =
      useKycPersonalInformationFormContext()
    const { t } = useTranslation("kyc")

    const genderList = Object.keys(Gender)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: t(`common:select.options.gender.${key}`),
        value: Gender[key as keyof typeof Gender],
      }))

    const countryList = useCountryList()

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

    const data = [
      "firstName",
      "middleName",
      "lastName",
      "gender",
      "dateOfBirth",
      "nationality",
      "nationalIdNumber",
    ] as (keyof KycPersonalInformation)[]

    const addressData = [
      "buildingNumber",
      "streetName",
      "district",
      "city",
      "postcode",
      "country",
    ] as (keyof KycPersonalInformationAddress)[]

    const CitizenData = ({
      field,
      isAddress = false,
    }: {
      field: keyof KycPersonalInformation | keyof KycPersonalInformationAddress
      isAddress?: boolean
    }) => {
      const { t: translate } = useTranslation("kyc")

      function getFieldValue(key: string) {
        if (isAddress) {
          if (key === "country") {
            return countryList.find(
              (countryOption) =>
                countryOption.value ===
                kycPersonalInformation?.address1?.country,
            )?.label
          }
          return kycPersonalInformation?.address1?.[
            key as keyof KycPersonalInformationAddress
          ]
        } else if (key === "dateOfBirth") {
          if (isValid(new Date(kycPersonalInformation?.[key] || ""))) {
            const dateOfBirthInUTC = (kycPersonalInformation?.[key] || "")
              .toString()
              .split("T")[0]
            return format(new Date(dateOfBirthInUTC), "dd/MM/yyyy")
          } else {
            return ""
          }
        } else if (key === "gender") {
          return genderList.find(
            (genderOption) =>
              genderOption.value === kycPersonalInformation?.gender,
          )?.label
        } else if (key === "nationality") {
          return countryList.find(
            (countryOption) =>
              countryOption.value === kycPersonalInformation?.nationality,
          )?.label
        } else {
          return kycPersonalInformation?.[key as keyof KycPersonalInformation]
        }
      }
      return (
        <VStack w="full" alignItems="flex-start" spacing="1">
          <Text color="gray.500">
            {translate(
              `personalInformation.kycAbsherCitizenDetails.labels.${field}`,
            )}
          </Text>
          <Text>{getFieldValue(field)}</Text>
        </VStack>
      )
    }

    return (
      <Flex
        direction={{ base: "column", md: "row" }}
        py={{ base: 2, md: 16 }}
        justifyContent="stretch"
      >
        <Container flex="1" maxW={{ base: "full", md: "280px" }} px="0">
          <Heading
            mb={{ base: 8, md: 6 }}
            fontSize={{ base: "2xl", md: "3xl" }}
          >
            {t("personalInformation.kycAbsherCitizenDetails.heading")}
          </Heading>

          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color="gray.400"
            mb={{ base: 0, md: 6 }}
          >
            {t(
              "personalInformation.kycAbsherCitizenDetails.descriptionIdDetails",
            )}
          </Text>
        </Container>

        <Center px={{ base: 0, md: 4, lg: 16 }} py={{ base: "48px", md: 0 }}>
          <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
        </Center>

        <Container flex={isTabletView ? "2" : "1"} px="0" maxW="5xl">
          <Text fontSize="sm" color="gray.500" mb="4">
            {t(
              "personalInformation.kycAbsherCitizenDetails.sections.personalDetails",
            )}
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb="12">
            {data.map((key) => (
              <CitizenData key={key} field={key} />
            ))}
          </SimpleGrid>
          <Text fontSize="sm" color="gray.500" mb="4">
            {t("personalInformation.kycAbsherCitizenDetails.sections.address")}
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {addressData.map((key) => (
              <CitizenData key={key} field={key} isAddress />
            ))}
          </SimpleGrid>
          <Portal containerRef={ref as React.RefObject<HTMLDivElement>}>
            <Stack
              isInline
              spacing={{ base: 4, md: 8 }}
              px={{ base: 0, md: 3 }}
              flex="1"
              justifyContent="flex-end"
            >
              {!isFirstPage && (
                <Button
                  colorScheme="primary"
                  variant="outline"
                  minW={{ base: "auto", md: "110px" }}
                  onClick={previousPage}
                  isFullWidth={isMobileView}
                >
                  {t("common:button.back")}
                </Button>
              )}

              <Button
                colorScheme="primary"
                minW={{ base: "auto", md: "110px" }}
                type="submit"
                onClick={nextPage}
                loadingText={t("common:button.next")}
                isFullWidth={isMobileView}
              >
                {t("common:button.next")}
              </Button>
            </Stack>
          </Portal>
        </Container>
      </Flex>
    )
  },
)

export default React.memo(KycAbsherCitizenDetails)
