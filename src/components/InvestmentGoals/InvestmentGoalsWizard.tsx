import { Container, Divider, Stack } from "@chakra-ui/layout"
import { Circle, Flex, StyleProps, useBreakpointValue } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import {
  ChatIcon,
  Link,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  QuestionIcon,
  SaveAndExitButton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "~/components"
import { RelationshipManager } from "~/services/mytfo/types"

import GetSupportPopUp from "../GetSupportPopUp"
import InvestmentGoalQuestionEightForm from "./InvestmentGoalQuestionEightForm"
import InvestmentGoalQuestionFiveForm from "./InvestmentGoalQuestionFiveForm"
import InvestmentGoalQuestionFourForm from "./InvestmentGoalQuestionFourForm"
import InvestmentGoalQuestionOneForm from "./InvestmentGoalQuestionOneForm"
import InvestmentGoalQuestionSevenForm from "./InvestmentGoalQuestionSevenForm"
import InvestmentGoalQuestionSixForm from "./InvestmentGoalQuestionSixForm"
import InvestmentGoalQuestionThreeForm from "./InvestmentGoalQuestionThreeForm"
import InvestmentGoalQuestionTwoForm from "./InvestmentGoalQuestionTwoForm"
import {
  InvestmentGoalsFormProvider,
  useInvestmentGoalsFormContext,
} from "./InvestmentGoalsFormContext"

function InvestmentGoalsWizard() {
  const { t } = useTranslation("proposal")

  const { ref, currentPage, isFirstPage } = useInvestmentGoalsFormContext()
  const [isOpen, setIsOpen] = React.useState(false)

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView
  const { data: rmData, error: rmError } = useSWR<RelationshipManager>(
    "/api/user/relationship-manager",
  )

  const isLoading = !rmData && !rmError
  const isRmAssigned = !isLoading && rmData?.assigned

  const ChapterHeaderStepper = (props?: StyleProps) => (
    <Stepper activeStep={2} orientation="horizontal" {...props}>
      <Step index={0} completed />
      <Step index={1}>
        <StepContent>
          <StepLabel color="white" fontWeight="bold">
            {t("chapterSelection.chapterTwo.stepper.title")}
          </StepLabel>
        </StepContent>
      </Step>
      <Step index={2} />
    </Stepper>
  )

  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (containerRef?.current && isMobileView) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [currentPage])

  return (
    <ModalLayout
      containerRef={containerRef}
      title={t("investmentGoals.page.title")}
      description={t("investmentGoals.page.description")}
      header={
        <ModalHeader
          ps={{ base: "0", md: 4 }}
          boxShadow="0 0 0 4px var(--chakra-colors-gray-900)"
          {...(isDesktopView && {
            headerLeft: (
              <Stack isInline ps="6" spacing="6">
                <Divider orientation="vertical" bgColor="white" height="28px" />
                <ChapterHeaderStepper />
              </Stack>
            ),
          })}
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
                  href: "/",
                }}
              />
            </>
          }
          showExitModalOnLogo={true}
          subheader={isMobileView && <ChapterHeaderStepper h="10" px="1" />}
        />
      }
      footer={<ModalFooter ref={ref} position="fixed" bottom="0" />}
    >
      <Container
        maxW="5xl"
        {...(isMobileView && {
          h: "100vh",
        })}
      >
        {/* Question 1 */}
        {isFirstPage && <InvestmentGoalQuestionOneForm />}

        {/* Question 2 */}
        {currentPage === "2" && <InvestmentGoalQuestionTwoForm />}

        {/* Question 3 */}
        {currentPage === "4" && <InvestmentGoalQuestionThreeForm />}

        {/* Question 4 */}
        {currentPage === "3" && <InvestmentGoalQuestionFourForm />}

        {/* Question 5 */}
        {currentPage === "5" && <InvestmentGoalQuestionFiveForm />}

        {/* Question 6 */}
        {currentPage === "6" && <InvestmentGoalQuestionSixForm />}

        {/* Question 7 */}
        {currentPage === "7" && <InvestmentGoalQuestionSevenForm />}

        {currentPage === "8" && <InvestmentGoalQuestionEightForm />}
      </Container>
    </ModalLayout>
  )
}

interface InvestmentGoalsWizardContainerProps {
  onCompleted: () => void
}

function InvestmentGoalsWizardContainer(
  props: InvestmentGoalsWizardContainerProps,
) {
  return (
    <InvestmentGoalsFormProvider {...props}>
      <InvestmentGoalsWizard />
    </InvestmentGoalsFormProvider>
  )
}

export default React.memo(InvestmentGoalsWizardContainer)
