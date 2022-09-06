import {
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/layout"
import { useBreakpointValue, useDisclosure } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import ky from "ky"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR, { mutate } from "swr"

import { useUser } from "~/hooks/useUser"
import {
  KycPersonalInformation,
  NameTitle,
  Preference,
} from "~/services/mytfo/types"

import { InputControl, SelectControl } from ".."
import KycLocationConsentModal from "./KycLocationConsentModal"
import { usePersonalInfoSchema } from "./KycPersonalInformation.schema"
import KycPersonalInformationFormActions from "./KycPersonalInformationFormActions"
import { useKycPersonalInformationFormContext } from "./KycPersonalInformationFormContext"

const KycPersonalInfoForm = React.forwardRef<HTMLDivElement, unknown>(
  function KycPersonalInfoForm(_props, _ref) {
    const { ref, handleSubmit } = useKycPersonalInformationFormContext()
    const { t } = useTranslation("kyc")
    const { user } = useUser()

    const {
      onOpen: onOpenGeoModal,
      onClose: onCloseGeoModal,
      isOpen: isOpenGeoModal,
    } = useDisclosure()

    const titlesList = Object.keys(NameTitle)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: t(`common:select.options.title.${key}`),
        value: NameTitle[key as keyof typeof NameTitle],
      }))

    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isTabletView = useBreakpointValue({
      base: false,
      md: true,
      lg: false,
    })
    const validationSchema = usePersonalInfoSchema()
    const { data: kycPersonalInformation, error } =
      useSWR<KycPersonalInformation>("/api/user/kyc/personal-information")

    const { data: preferenceData } = useSWR<Preference>("/api/user/preference")

    const isLoading = !kycPersonalInformation && !error && !preferenceData

    const handleGeoLocation = React.useCallback(
      async function handleGeoLocation(concent: boolean) {
        try {
          await ky.patch("/api/user/preference/location-consent", {
            json: { concent },
          })
          onCloseGeoModal()
          await mutate<Preference>("/api/user/preference")
        } catch (e) {}
      },
      [onCloseGeoModal],
    )

    React.useEffect(() => {
      if (preferenceData?.shareLocationConsent === null) {
        onOpenGeoModal()
      }
    }, [preferenceData?.shareLocationConsent, onOpenGeoModal])

    // need to handle error state later
    if (isLoading || error) {
      return null
    }

    return (
      <>
        <Flex
          direction={{ base: "column", md: "row" }}
          py={{ base: 2, md: 16 }}
        >
          <Container flex="1" maxW={{ base: "full", md: "280px" }} px="0">
            <Heading
              mb={{ base: 8, md: 6 }}
              fontSize={{ base: "2xl", md: "3xl" }}
            >
              {t("personalInformation.KycPersonalInformation.heading")}
            </Heading>

            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.400"
              mb={{ base: 0, md: 6 }}
            >
              {t(
                "personalInformation.KycPersonalInformation.descriptionIdDetails",
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
                "firstName" | "lastName" | "middleName" | "title" | "isAbsher"
              >
            >
              initialValues={{
                firstName:
                  kycPersonalInformation?.firstName ||
                  user?.profile.firstName ||
                  undefined,
                lastName:
                  kycPersonalInformation?.lastName ||
                  user?.profile.lastName ||
                  undefined,
                middleName: kycPersonalInformation?.middleName || undefined,
                title: kycPersonalInformation?.title || undefined,
                isAbsher: kycPersonalInformation?.isAbsher,
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
                      name="title"
                      aria-label="title"
                      label={t(
                        "personalInformation.KycPersonalInformation.select.title.label",
                      )}
                      selectProps={{
                        placeholder: t("common:select.placeholder"),
                        options: titlesList,
                      }}
                    />

                    <InputControl
                      aria-label="firstName"
                      name="firstName"
                      pt="2"
                      label={t(
                        "personalInformation.KycPersonalInformation.input.firstName.label",
                      )}
                      inputProps={{
                        placeholder: t(
                          "personalInformation.KycPersonalInformation.input.firstName.placeholder",
                        ),
                        isDisabled: true,
                      }}
                    />
                    <InputControl
                      aria-label="middleName"
                      name="middleName"
                      pt="2"
                      label={t(
                        "personalInformation.KycPersonalInformation.input.middleName.placeholder",
                      )}
                      inputProps={{
                        placeholder: t(
                          "personalInformation.KycPersonalInformation.input.middleName.placeholder",
                        ),
                      }}
                    />

                    <InputControl
                      aria-label="lastName"
                      name="lastName"
                      pt="2"
                      label={t(
                        "personalInformation.KycPersonalInformation.input.lastName.label",
                      )}
                      inputProps={{
                        placeholder: t(
                          "personalInformation.KycPersonalInformation.input.lastName.placeholder",
                        ),
                        isDisabled: true,
                      }}
                    />
                  </SimpleGrid>
                  <KycPersonalInformationFormActions
                    ref={ref}
                    {...formikProps}
                  />
                </Form>
              )}
            </Formik>
          </Container>
        </Flex>
        <KycLocationConsentModal
          handleGeoLocation={handleGeoLocation}
          isOpenGeoModal={isOpenGeoModal}
        />
      </>
    )
  },
)

export default React.memo(KycPersonalInfoForm)
