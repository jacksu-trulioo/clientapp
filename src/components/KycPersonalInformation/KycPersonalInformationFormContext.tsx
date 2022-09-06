import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal"
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import produce from "immer"
import ky from "ky"
import { useRouter } from "next/router"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR, { mutate } from "swr"

import { Logo } from "~/components"
import { usePhoneCountryCodeList } from "~/hooks/useList"
import { useUser } from "~/hooks/useUser"
import {
  EmploymentActivity,
  KycPersonalInformation,
  PepCheck,
  Preference,
} from "~/services/mytfo/types"
import { triggerEventWithPageName } from "~/utils/kycGoogleEventsHelper"

// First route is the base path. We do not want a fragment URL here so we leave it blank.
const initialPages = [
  "name",
  "kyc-country-dob",
  "address",
  "national-id",
  "employment-details",
  "employer-details",
  "income-details",
  "tax-information1",
  "tax-information2",
  "reasonableness-check1",
  "reasonableness-check2",
  "reasonableness-check3",
  "pep-check",
]

const pagesKSA = [
  "name",
  "kyc-country-dob",
  "address",
  "other-address",
  "national-id",
  "employment-details",
  "employer-details",
  "income-details",
  "tax-information1",
  "tax-information2",
  "reasonableness-check1",
  "reasonableness-check2",
  "reasonableness-check3",
  "pep-check",
]

const pagesAbsher = [
  "sso",
  "citizen-details",
  "absher-additional",
  "employment-details",
  "employer-details",
  "income-details",
  "tax-information1",
  "tax-information2",
  "reasonableness-check1",
  "reasonableness-check2",
  "reasonableness-check3",
  "pep-check",
]

export type KycPersonalInformationFormContext = {
  ref?: React.MutableRefObject<HTMLDivElement | null>
  pages: string[]
  currentPage?: string
  isFirstPage?: boolean
  currentPageIndex: number
  previousPage?: () => void
  nextPage?: () => void
  handleSubmit: (values: KycPersonalInformation) => Promise<void>
}

export const KycPersonalInformationFormContext =
  React.createContext<KycPersonalInformationFormContext>({
    pages: initialPages,
    currentPageIndex: 0,
    previousPage: undefined,
    handleSubmit: () => Promise.resolve(),
  })

export type UseKycPersonalInformationFormContext =
  () => KycPersonalInformationFormContext

export const useKycPersonalInformationFormContext = () =>
  React.useContext(KycPersonalInformationFormContext)

export type KycPersonalInformationProviderProps = React.PropsWithChildren<{
  onCompleted: () => void
}>

export function KycPersonalInformationFormProvider(
  props: KycPersonalInformationProviderProps,
): React.ReactElement<KycPersonalInformationFormContext> {
  const { children, onCompleted } = props
  const router = useRouter()
  const [pages, setPages] = React.useState(initialPages)
  const { user } = useUser()
  const phoneCountryCodeList = usePhoneCountryCodeList()
  const { t } = useTranslation("kyc")
  const ref = React.useRef<HTMLDivElement>(null)
  const { onOpen, onClose, isOpen } = useDisclosure()

  const [, page] = location.hash.split("#")
  const [currentPage, setCurrentPage] = React.useState(page)
  const { data: kycPersonalInformation, error } =
    useSWR<KycPersonalInformation>("/api/user/kyc/personal-information")

  const { data: preferredLanguageData } = useSWR<Preference>(
    "/api/user/preference",
  )

  const [currentPageIndex, setCurrentPageIndex] = React.useState(0)
  const isFirstPage = currentPageIndex === 0
  const isMobileView = useBreakpointValue({ base: true, md: false })

  React.useEffect(() => {
    setCurrentPage(page)

    const pageIndex = pages.findIndex((p) => p === page)
    setCurrentPageIndex(pageIndex === -1 ? 0 : pageIndex)
  }, [page, pages])

  React.useEffect(() => {
    if (user?.profile.nationality === "SA") {
      if (router.asPath.includes("#sso") || kycPersonalInformation?.isAbsher) {
        setPages(pagesAbsher)
      } else {
        setPages(pagesKSA)
      }
    }
  }, [
    kycPersonalInformation?.isAbsher,
    router.asPath,
    setPages,
    user?.profile.nationality,
  ])

  function showSorryModal() {
    return (
      <Modal
        onClose={onClose}
        size={isMobileView ? "xs" : "2xl"}
        isOpen={isOpen}
        isCentered={true}
        autoFocus={false}
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent
          sx={{
            "& > div": {
              px: "0",
            },
          }}
        >
          <ModalHeader>
            <Logo
              pos="absolute"
              top={["3", "3"]}
              insetStart={["6", "6"]}
              height={["30px", "30px"]}
            />
            <Heading
              fontSize={{ base: "lg", md: "xl" }}
              color="white"
              textAlign="start"
            >
              {t("sorryModal.heading")}
            </Heading>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <Trans
              i18nKey={
                user?.profile?.nationality !== "SA"
                  ? "kyc:sorryModal.contentNonKSA"
                  : "kyc:sorryModal.contentKSA"
              }
              components={[
                <Box key="0" px="6" />,
                <Text
                  key="1"
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.400"
                  textAlign="start"
                  mb="2"
                />,
                <UnorderedList key="2" color="contrast.200" ms="8" mb="5" />,
                <ListItem
                  key="3"
                  textAlign="start"
                  fontSize={{ base: "sm", md: "md" }}
                />,
                <Text
                  key="4"
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.400"
                  textAlign="start"
                  mt="3.5"
                  mb="7"
                />,
              ]}
            />
            <Divider
              orientation="horizontal"
              borderColor="gray.800"
              border="1px solid"
              mb="1"
              mt="1"
            />
          </ModalBody>

          <ModalFooter w="full" px="6">
            <Flex
              justifyContent="space-between"
              direction="row"
              w="full"
              pb="3"
            >
              <Button
                variant="ghost"
                colorScheme="primary"
                onClick={onClose}
                ps="0"
              >
                {t("sorryModal.button.goBack")}
              </Button>
              <Button
                colorScheme="primary"
                variant="solid"
                as={Link}
                href={preferredLanguageData?.language === "AR" ? "/ar" : "/"}
                onClick={onClose}
              >
                {t("sorryModal.button.exitToDashboard")}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

  const nextPageRouteCheck = () => {
    let route: string = ""
    switch (currentPage) {
      case "tax-information2": {
        //statements;
        if (
          kycPersonalInformation?.reasonablenessCheck
            ?.addressNotMatchTaxResidence?.isValid
        ) {
          route = "reasonableness-check1"
        } else if (
          kycPersonalInformation?.reasonablenessCheck
            ?.phoneNumberNotMatchTaxResidence?.isValid
        ) {
          route = "reasonableness-check2"
        } else if (
          kycPersonalInformation?.reasonablenessCheck
            ?.nationalityNotMatchTaxResidence?.isValid
        ) {
          route = "reasonableness-check3"
        } else {
          route = "pep-check"
        }
        break
      }
      case "reasonableness-check1": {
        if (
          kycPersonalInformation?.reasonablenessCheck
            ?.phoneNumberNotMatchTaxResidence?.isValid
        ) {
          route = "reasonableness-check2"
        } else if (
          kycPersonalInformation?.reasonablenessCheck
            ?.nationalityNotMatchTaxResidence?.isValid
        ) {
          route = "reasonableness-check3"
        } else {
          route = "pep-check"
        }

        break
      }
      case "reasonableness-check2": {
        if (
          kycPersonalInformation?.reasonablenessCheck
            ?.nationalityNotMatchTaxResidence?.isValid
        ) {
          route = "reasonableness-check3"
        } else {
          route = "pep-check"
        }
        break
      }
      default: {
        route = pages[Math.min(currentPageIndex + 1, pages.length - 1)]
        break
      }
    }
    return route
  }

  const nextPage = React.useCallback(() => {
    // At end of form.
    if (currentPageIndex === pages.length - 1) {
      return onCompleted()
    }
    const route = nextPageRouteCheck()

    router.push("#" + route)
    setCurrentPage(route)
    triggerEventWithPageName(currentPage)
  }, [currentPageIndex, onCompleted, router, pages])

  const previousPageRouteCheck = () => {
    let route: string = ""
    switch (currentPage) {
      case "income-details": {
        if (
          kycPersonalInformation?.employmentActivity ===
          EmploymentActivity.Unemployed
        ) {
          route = "employment-details"
        } else {
          route = pages[Math.max(currentPageIndex - 1, 0)]
        }
        break
      }
      case "pep-check": {
        //statements;
        if (
          kycPersonalInformation?.reasonablenessCheck
            ?.nationalityNotMatchTaxResidence?.isValid
        ) {
          route = "reasonableness-check3"
        } else if (
          kycPersonalInformation?.reasonablenessCheck
            ?.phoneNumberNotMatchTaxResidence?.isValid
        ) {
          route = "reasonableness-check2"
        } else if (
          kycPersonalInformation?.reasonablenessCheck
            ?.addressNotMatchTaxResidence?.isValid
        ) {
          route = "reasonableness-check1"
        } else {
          route = "tax-information2"
        }
        break
      }
      case "reasonableness-check3": {
        if (
          kycPersonalInformation?.reasonablenessCheck
            ?.phoneNumberNotMatchTaxResidence?.isValid
        ) {
          route = "reasonableness-check2"
        } else if (
          kycPersonalInformation?.reasonablenessCheck
            ?.addressNotMatchTaxResidence?.isValid
        ) {
          route = "reasonableness-check1"
        } else {
          route = "tax-information2"
        }

        break
      }
      case "reasonableness-check2": {
        if (
          kycPersonalInformation?.reasonablenessCheck
            ?.addressNotMatchTaxResidence?.isValid
        ) {
          route = "reasonableness-check1"
        } else {
          route = "tax-information2"
        }
        break
      }
      default: {
        route = pages[Math.max(currentPageIndex - 1, 0)]
        break
      }
    }
    return route
  }

  const previousPage = React.useCallback(() => {
    // At beginning of form.
    if (currentPageIndex === 0) {
      return
    }

    const route = previousPageRouteCheck()
    router.push(route ? "#" + route : router.pathname)
    setCurrentPage(route)
  }, [currentPageIndex, router, pages])

  const validateKycPersonalInformation = (values: KycPersonalInformation) => {
    const {
      nationality,
      otherNationality,
      taxInformation,
      address1,
      address2,
      hasResidenceAddressOutsideSaudiArabia,
      pepCheck,
    } = values

    if (
      ["US", "IR", "KP"].includes(nationality!) ||
      ["US", "IR", "KP"].includes(otherNationality!)
    ) {
      return true
    }

    if (address2?.country && hasResidenceAddressOutsideSaudiArabia === "yes") {
      if (["US", "IR", "KP"].includes(address2.country)) {
        return true
      }
    }

    if (address1?.country) {
      if (["US", "IR", "KP"].includes(address1?.country)) {
        return true
      }
    }

    if (taxInformation) {
      const countryOfResidencylist = taxInformation?.tinInformation
        ? taxInformation?.tinInformation.map(
            (element) => element.countriesOfTaxResidency,
          )
        : undefined
      if (
        countryOfResidencylist &&
        countryOfResidencylist.some((item) =>
          ["US", "IR", "KP"].includes(item as string),
        )
      ) {
        return true
      }

      if (
        ["US", "IR", "KP"].includes(
          taxInformation?.locationOfMainTaxDomicile as string,
        )
      ) {
        return true
      }
    }

    if (pepCheck) {
      const value = pepCheck?.optionValue
      if (value === PepCheck.YesIamPep || value === PepCheck.YesIamPepRelated) {
        return true
      }
    }

    return false
  }

  const handleSubmit = React.useCallback(
    async (values: KycPersonalInformation) => {
      try {
        let formikValues = {
          ...values,
        } as KycPersonalInformation

        if (values.pepCheck) {
          formikValues.pepCheck = {
            optionValue: values.pepCheck?.optionValue,
            dateOfAppointment:
              values.pepCheck?.optionValue != PepCheck.NoIamNotPep
                ? values.pepCheck?.dateOfAppointment
                : undefined,
            fullLegalName:
              values.pepCheck?.optionValue == PepCheck.YesIamPepRelated
                ? values.pepCheck?.fullLegalName
                : undefined,
            accountHolderRelationship:
              values.pepCheck?.optionValue == PepCheck.YesIamPepRelated
                ? values.pepCheck?.accountHolderRelationship
                : undefined,
            jurisdiction:
              values.pepCheck?.optionValue == PepCheck.YesIamPepRelated
                ? values.pepCheck?.jurisdiction
                : undefined,
          }
        }

        if (values.employmentDetails && formikValues.employmentDetails) {
          formikValues.employmentDetails.areYouDirectorOfListedCompany =
            values.employmentDetails.areYouDirectorOfListedCompany === "yes"
          formikValues.employmentDetails.yearsOfProfessionalExperience =
            //@ts-ignore
            values.employmentDetails.yearsOfProfessionalExperience === ""
              ? null
              : Number(values.employmentDetails.yearsOfProfessionalExperience)
          if (
            values.employmentActivity !==
            kycPersonalInformation?.employmentActivity
          ) {
            formikValues.employerDetails = null
          }
        }

        if (values.dateOfBirth) {
          formikValues.dateOfBirth = values.dateOfBirth
        }

        if (values.hasResidenceAddressOutsideSaudiArabia) {
          if (values.hasResidenceAddressOutsideSaudiArabia === "no") {
            formikValues.address2 = undefined
          }
          formikValues.hasResidenceAddressOutsideSaudiArabia =
            values.hasResidenceAddressOutsideSaudiArabia === "yes"
        }

        if (values.taxInformation && formikValues.taxInformation) {
          formikValues.taxInformation = {
            ...values.taxInformation,
            taxableInUSA: values.taxInformation.taxableInUSA === "yes",
          }
        }

        if (
          values.taxInformation?.tinInformation &&
          currentPage == "tax-information1"
        ) {
          const phoneCode = phoneCountryCodeList.find(
            (phoneCountryCodeElement) =>
              phoneCountryCodeElement.value === user?.profile.phoneCountryCode,
          )
          const userPhoneCode = phoneCode?.label.split("+")[0].trim()
          const countryOfResidenceList =
            values.taxInformation.tinInformation.map(
              (tinfoElement) => tinfoElement.countriesOfTaxResidency,
            )
          formikValues = {
            ...formikValues,
            reasonablenessCheck: {
              ...kycPersonalInformation?.reasonablenessCheck,
              phoneNumberNotMatchTaxResidence: {
                ...kycPersonalInformation?.reasonablenessCheck
                  ?.phoneNumberNotMatchTaxResidence,
                isValid: !countryOfResidenceList.includes(userPhoneCode),
              },
              nationalityNotMatchTaxResidence: {
                ...kycPersonalInformation?.reasonablenessCheck
                  ?.nationalityNotMatchTaxResidence,
                isValid:
                  !countryOfResidenceList.includes(
                    kycPersonalInformation?.nationality,
                  ) ||
                  (kycPersonalInformation?.otherNationality !== null &&
                    !countryOfResidenceList.includes(
                      kycPersonalInformation?.otherNationality,
                    )),
              },
              addressNotMatchTaxResidence: {
                ...kycPersonalInformation?.reasonablenessCheck
                  ?.addressNotMatchTaxResidence,
                isValid:
                  !countryOfResidenceList.includes(
                    kycPersonalInformation?.address1?.country,
                  ) ||
                  (kycPersonalInformation?.hasResidenceAddressOutsideSaudiArabia ===
                    true &&
                    kycPersonalInformation?.address2?.country !== null &&
                    !countryOfResidenceList.includes(
                      kycPersonalInformation?.address2?.country,
                    )),
              },
            },
          }
        }
        const updateObj = produce(kycPersonalInformation, (draft) => {
          return {
            ...draft,
            ...formikValues,
          }
        })
        if (validateKycPersonalInformation(values)) {
          onOpen()
        } else {
          const kyResponse = await ky
            .put("/api/user/kyc/personal-information", {
              json: updateObj,
            })
            .json<KycPersonalInformation>()
          // need to check if produce method will be required here later for immutable object
          await mutate<KycPersonalInformation>(
            "/api/user/kyc/personal-information",
            kyResponse,
          )
          if (values.employmentActivity === EmploymentActivity.Unemployed) {
            router.push("#income-details")
          } else {
            nextPage()
          }
        }
      } catch (error) {
        console.log("handle submit called error", error)
        console.error(error)
      }
    },
    [onOpen, kycPersonalInformation, nextPage],
  )

  const contextValue = React.useMemo(
    () => ({
      ref,
      currentPage,
      currentPageIndex,
      isFirstPage,
      pages,
      previousPage,
      handleSubmit,
      nextPage,
    }),
    [
      ref,
      currentPage,
      currentPageIndex,
      isFirstPage,
      previousPage,
      handleSubmit,
      pages,
      nextPage,
    ],
  )

  // need to revalidate this
  if (!kycPersonalInformation || error) {
    return <></>
  }

  // nationality is needed to set the flow of kyc
  if (!user?.profile.nationality) {
    return <></>
  }

  // need to finalize this with PO so kept the commented code
  // if (
  //   kycPersonalInformation.isAbsher === false &&
  //   router.asPath.includes("#citizen-details")
  // ) {
  //   return <></>
  // }

  return (
    <KycPersonalInformationFormContext.Provider value={contextValue}>
      {children}
      {showSorryModal()}
    </KycPersonalInformationFormContext.Provider>
  )
}
