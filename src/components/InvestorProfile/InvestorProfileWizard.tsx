import { Box, Container, Divider, Stack } from "@chakra-ui/layout"
import { Circle, Flex, useBreakpointValue } from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import {
  ChatIcon,
  GetSupportPopUp,
  Link,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  QuestionIcon,
  SaveAndExitButton,
} from "~/components"
import { RelationshipManager } from "~/services/mytfo/types"

import InvestorInterestedInvestment from "./InvestorInterestedInvestment"
import InvestorInvestmentExperience from "./InvestorInvestmentExperience"
import InvestorMinimumAmount from "./InvestorMinimumAmount"
import InvestorOtpVerification from "./InvestorOtpVerification"
import InvestorPersonalInfoForm from "./InvestorPersonalInfoForm"
import InvestorPriorExperience from "./InvestorPriorExperience"
import {
  InvestorProfileFormProvider,
  useInvestorProfileFormContext,
} from "./InvestorProfileFormContext"

interface InvestorProfileWizardProps {
  headerLeft?: React.ReactNode
}

function InvestorProfileWizard(props: InvestorProfileWizardProps) {
  const { t } = useTranslation("proposal")
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()
  const { headerLeft } = props
  const { ref, currentPage, isFirstPage } = useInvestorProfileFormContext()

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { data: rmData, error: rmError } = useSWR<RelationshipManager>(
    "/api/user/relationship-manager",
  )

  const isLoading = !rmData && !rmError
  const isRmAssigned = !isLoading && rmData?.assigned

  React.useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [currentPage])

  return (
    <ModalLayout
      containerRef={containerRef}
      title={t("investorProfile.page.title")}
      description={t("investorProfile.page.description")}
      header={
        <ModalHeader
          ps={{ base: "0", md: 4 }}
          boxShadow="0 0 0 4px var(--chakra-colors-gray-900)"
          {...(isDesktopView && {
            headerLeft: (
              <Stack isInline ps="6" spacing="6" alignItems="center">
                <Divider orientation="vertical" bgColor="white" height="28px" />
                {headerLeft}
              </Stack>
            ),
          })}
          showExitModalOnLogo={true}
          headerRight={
            <>
              {isMobileView && (
                <>
                  <Flex flex="1" />

                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    h="full"
                  >
                    <GetSupportPopUp
                      isOpen={isOpen}
                      onClose={() => setIsOpen(false)}
                    />

                    <Circle
                      size="10"
                      bgColor="gray.800"
                      me="1"
                      onClick={() => setIsOpen(true)}
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
                  </Flex>
                </>
              )}
              <SaveAndExitButton
                onSaveButtonProps={{
                  as: Link,
                  href:
                    router.query.originPage !== "opportunity"
                      ? "/"
                      : "/opportunities",
                }}
              />
            </>
          }
          subheader={
            <>
              {isMobileView && (
                <Box h="10" px="1" py="2">
                  {headerLeft}
                </Box>
              )}
            </>
          }
        />
      }
      footer={<ModalFooter ref={ref} position="fixed" bottom="0" />}
    >
      <Container maxW="5xl" {...(isMobileView && { px: "0", h: "100vh" })}>
        {isFirstPage && <InvestorPersonalInfoForm />}

        {currentPage === "otp-verification" && <InvestorOtpVerification />}

        {currentPage === "amount" && <InvestorMinimumAmount />}

        {currentPage === "interested-investments" && (
          <InvestorInterestedInvestment />
        )}

        {currentPage === "investment-experience" && (
          <InvestorInvestmentExperience />
        )}

        {currentPage === "prior-experience" && <InvestorPriorExperience />}
      </Container>
    </ModalLayout>
  )
}

interface InvestorProfileWizardContainerProps {
  onCompleted: () => void
  headerLeft?: React.ReactNode
}

function InvestorProfileWizardContainer(
  props: InvestorProfileWizardContainerProps,
) {
  const { headerLeft } = props

  return (
    <InvestorProfileFormProvider {...props}>
      <InvestorProfileWizard headerLeft={headerLeft} />
    </InvestorProfileFormProvider>
  )
}

export default React.memo(InvestorProfileWizardContainer)
