import { Box, Container, Divider, Flex, Stack } from "@chakra-ui/layout"
import {
  Circle,
  Progress,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useRef } from "react"
import useSWR from "swr"

import {
  ChatIcon,
  GetSupportPopUp,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  QuestionIcon,
  SaveAndExitButton,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import { Preference, RelationshipManager } from "~/services/mytfo/types"

import KycAbsherAdditionalInformation from "./KycAbsherAdditionalInformation"
import KycAbsherCitizenDetails from "./KycAbsherCitizenDetails"
import KycEmployerDetails from "./KycEmployerDetails"
import KycEmploymentDetails from "./KycEmploymentDetails"
import KycPepCheck from "./KycPepCheck"
import KycPersonalInformationAddress from "./KycPersonalInformationAddress"
import KycPersonalInformationCountryDOB from "./KycPersonalInformationCountryDOB"
import KycPersonalInformationForm from "./KycPersonalInformationForm"
import {
  KycPersonalInformationFormProvider,
  useKycPersonalInformationFormContext,
} from "./KycPersonalInformationFormContext"
import KycPersonalInformationIncomeDetails from "./KycPersonalInformationIncomeDetails"
import KycPersonalInformationNationalId from "./KycPersonalInformationNationalId"
import KycPersonalInformationOtherAddress from "./KycPersonalInformationOtherAddress"
import KycPersonalInformationSSOId from "./KycPersonalInformationSSOId"
import KycReasonablenessCheckOne from "./KycReasonablenessCheckOne"
import KycReasonablenessCheckThree from "./KycReasonablenessCheckThree"
import KycReasonablenessCheckTwo from "./KycReasonablenessCheckTwo"
import KycTaxInformationOne from "./KycTaxInformationOne"
import KycTaxInformationTwo from "./KycTaxInformationTwo"

interface KycPersonalInformationWizardProps {
  headerLeft?: React.ReactNode
}

function KycPersonalInformationWizard(
  props: KycPersonalInformationWizardProps,
) {
  const { t } = useTranslation("kyc")
  const { headerLeft } = props
  const { pages, ref, currentPage, isFirstPage, currentPageIndex } =
    useKycPersonalInformationFormContext()
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isTabletView = useBreakpointValue({ base: false, md: true, lg: false })
  const isDesktopView = !isMobileView
  const {
    onOpen: onOpenSupport,
    onClose: onCloseSupport,
    isOpen: isOpenSupport,
  } = useDisclosure()
  const { user } = useUser()
  const { data: preferredLanguage } = useSWR<Preference>("/api/user/preference")
  const { data: rmData, error: rmError } = useSWR<RelationshipManager>(
    "/api/user/relationship-manager",
  )

  const isLoading = !rmData && !rmError
  const isRmAssigned = !isLoading && rmData?.assigned
  const { push, reload } = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    containerRef?.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [currentPageIndex])

  const handleSaveAndExit = React.useCallback(async () => {
    if (preferredLanguage?.language === "AR") {
      push("/ar")
      reload()
    } else {
      push("/")
    }
  }, [preferredLanguage?.language, push, reload])

  return (
    <ModalLayout
      height={window?.innerHeight || "100vh"}
      containerRef={containerRef}
      title={t("personalInformation.page.title")}
      description={t("personalInformation.page.description")}
      header={
        <ModalHeader
          boxShadow="0 0 0 4px var(--chakra-colors-gray-900)"
          showExitModalOnLogo={true}
          {...(isDesktopView && {
            headerLeft: (
              <Stack isInline ps="6" spacing="6" alignItems="center">
                <Divider orientation="vertical" bgColor="white" height="28px" />
                {headerLeft}
              </Stack>
            ),
          })}
          headerRight={
            <>
              {isMobileView && (
                <>
                  <Flex flex="1" />
                  <Circle
                    size="10"
                    bgColor="gray.800"
                    me="1"
                    onClick={onOpenSupport}
                  >
                    {isRmAssigned ? (
                      <ChatIcon w="5" h="5" color="primary.500" />
                    ) : (
                      <QuestionIcon w="5" h="5" color="primary.500" />
                    )}
                  </Circle>
                  <Flex py="18px" h="full">
                    <Divider color="gray.500" orientation="vertical" />
                  </Flex>
                </>
              )}
              <SaveAndExitButton onSave={handleSaveAndExit} />
            </>
          }
          subheader={
            <>
              {isMobileView && (
                <Box h="10" px="1" py="2">
                  {headerLeft}
                </Box>
              )}

              <Progress
                colorScheme="primary"
                size="xs"
                bgColor="gray.700"
                value={Math.floor(
                  ((currentPageIndex + 1) / (pages.length + 1)) * 100,
                )}
              />
            </>
          }
        />
      }
      footer={<ModalFooter ref={ref} />}
    >
      <Container
        maxW="5xl"
        {...((isMobileView || isTabletView) && { px: "0" })}
      >
        {(isFirstPage || currentPage === "name" || currentPage === "sso") &&
          (user?.profile.nationality === "SA" && currentPage === "sso" ? (
            <KycPersonalInformationSSOId />
          ) : (
            <KycPersonalInformationForm />
          ))}
        {currentPage === "kyc-country-dob" && (
          <KycPersonalInformationCountryDOB />
        )}
        {currentPage === "address" && <KycPersonalInformationAddress />}
        {currentPage === "other-address" && (
          <KycPersonalInformationOtherAddress />
        )}
        {currentPage === "national-id" && <KycPersonalInformationNationalId />}
        {currentPage === "pep-check" && <KycPepCheck />}
        {currentPage === "employment-details" && <KycEmploymentDetails />}
        {currentPage === "employer-details" && <KycEmployerDetails />}
        {currentPage === "citizen-details" && <KycAbsherCitizenDetails />}
        {currentPage === "absher-additional" && (
          <KycAbsherAdditionalInformation />
        )}
        {currentPage === "income-details" && (
          <KycPersonalInformationIncomeDetails />
        )}
        {currentPage === "reasonableness-check1" && (
          <KycReasonablenessCheckOne />
        )}
        {currentPage === "reasonableness-check2" && (
          <KycReasonablenessCheckTwo />
        )}
        {currentPage === "reasonableness-check3" && (
          <KycReasonablenessCheckThree />
        )}
        {currentPage === "tax-information1" && <KycTaxInformationOne />}
        {currentPage === "tax-information2" && <KycTaxInformationTwo />}
      </Container>
      <GetSupportPopUp isOpen={isOpenSupport} onClose={onCloseSupport} />
    </ModalLayout>
  )
}

interface KycPersonalInformationWizardContainerProps {
  onCompleted: () => void
  headerLeft?: React.ReactNode
}

function KycPersonalInformationWizardContainer(
  props: KycPersonalInformationWizardContainerProps,
) {
  const { headerLeft } = props
  return (
    <KycPersonalInformationFormProvider {...props}>
      <KycPersonalInformationWizard headerLeft={headerLeft} />
    </KycPersonalInformationFormProvider>
  )
}

export default React.memo(KycPersonalInformationWizardContainer)
