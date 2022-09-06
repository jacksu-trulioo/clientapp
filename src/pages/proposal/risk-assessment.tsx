import { getSession } from "@auth0/nextjs-auth0"
import { Button } from "@chakra-ui/button"
import {
  Center,
  Container,
  Divider,
  Flex,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/layout"
import { Portal } from "@chakra-ui/portal"
import { Circle, StyleProps, useBreakpointValue } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import produce from "immer"
import ky from "ky"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR, { mutate } from "swr"
import * as Yup from "yup"

import {
  ChatIcon,
  GetSupportPopUp,
  Link,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  QuestionIcon,
  Radio,
  RadioGroupControl,
  SaveAndExitButton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "~/components"
import ProposalTitleWithIndicater from "~/components/ProposalTitleWithIndicater"
import {
  InvestorRiskAssessment,
  RelationshipManager,
} from "~/services/mytfo/types"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

// First route is the base path. We do not want a fragment URL here so we leave it blank.
const pages = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]

function RiskAssessmentScreen() {
  const router = useRouter()
  const pathname = router.pathname
  const initiatorCondition = sessionStorage.getItem("initiator") === "profile"
  const isRatakeRiskAssessment =
    pathname === "/personalized-proposal/retake-risk-assessment"

  const { data: userRiskQuestions } = useSWR<InvestorRiskAssessment>(
    !isRatakeRiskAssessment
      ? "/api/user/risk-assessment"
      : "/api/user/retake-risk-assessment",
  )

  const { t } = useTranslation("proposal")

  const ref = React.useRef(null)

  const [, page] = location.hash.split("#")

  const [currentPage, setCurrentPage] = React.useState(page)
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0)
  const [isOpen, setIsOpen] = React.useState(false)
  const isFirstPage = !currentPage || currentPage === "1"
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lg: false,
  })
  const isDesktopView = !isMobileView

  React.useEffect(() => {
    setCurrentPage(page)

    const pageIndex = pages.findIndex((p) => p === page)
    setCurrentPageIndex(pageIndex === -1 ? 0 : pageIndex)
  }, [page])

  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (containerRef?.current && isMobileView) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [currentPage])

  const nextPage = React.useCallback(() => {
    // At end of form.

    if (currentPageIndex === pages.length - 1 && initiatorCondition) {
      return router.push("/profile#preference")
    }

    if (currentPageIndex === pages.length - 1 && !isRatakeRiskAssessment) {
      return router.push("/proposal/risk-assessment/result")
    }

    if (currentPageIndex === pages.length - 1 && isRatakeRiskAssessment) {
      return router.push({
        pathname: "/personalized-proposal",
        query: {
          name: "risk-assessment",
        },
      })
    }

    const route = pages[Math.min(currentPageIndex + 1, pages.length - 1)]
    router.push("#" + route)
    setCurrentPage(route)
  }, [currentPageIndex, router])

  const previousPage = React.useCallback(() => {
    // At beginning of form.
    if (currentPageIndex === 0) {
      return
    }

    const route = pages[Math.max(currentPageIndex - 1, 0)]
    router.push(route ? "#" + route : router.pathname)
    setCurrentPage(route)
  }, [currentPageIndex, router])

  const { data: rmData, error: rmError } = useSWR<RelationshipManager>(
    "/api/user/relationship-manager",
  )

  const isLoading = !rmData && !rmError
  const isRmAssigned = !isLoading && rmData?.assigned

  const handleSubmit = React.useCallback(
    async (values: InvestorRiskAssessment) => {
      try {
        let updateObj

        if (page === "9") {
          updateObj = produce(userRiskQuestions, (draft) => {
            return {
              ...draft,
              ...values,
              isConfirmed: true,
            }
          })
        }
        if (page !== "9") {
          updateObj = produce(userRiskQuestions, (draft) => {
            return {
              ...draft,
              ...values,
            }
          })
        }

        if (isRatakeRiskAssessment || initiatorCondition) {
          const updatedQuestions = await ky
            .put("/api/user/retake-risk-assessment", {
              json: updateObj,
            })
            .json<InvestorRiskAssessment>()

          await mutate<InvestorRiskAssessment>(
            "/api/user/retake-risk-assessment",
            updatedQuestions,
          )
        } else {
          const updatedQuestions = await ky
            .put("/api/user/risk-assessment", {
              json: updateObj,
            })
            .json<InvestorRiskAssessment>()

          await mutate<InvestorRiskAssessment>(
            "/api/user/risk-assessment",
            updatedQuestions,
          )
        }

        nextPage()
      } catch (error) {
        console.error(error)
      }
    },
    [nextPage, userRiskQuestions],
  )

  const createStatement = React.useCallback(
    (value: string) => {
      const statementNumber = Number(value) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

      if (currentPage !== value) {
        return null
      }

      return (
        <Flex
          key={value}
          py={{ base: 2, md: 16 }}
          flexDirection={{ base: "column", md: "row" }}
          paddingBottom="80px"
        >
          <ProposalTitleWithIndicater
            pages={pages}
            currentPageIndex={currentPageIndex}
            heading={t(`riskAssessment.question.${statementNumber}.title`)}
          />
          <Center
            mb={{ base: 10, md: 0 }}
            mt={{ base: 10, md: 0 }}
            px={{ base: 0, md: "64px" }}
          >
            <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
          </Center>

          <Container
            flex={isTabletView ? "2" : "1"}
            px="0"
            {...(isMobileView && { mb: "36" })}
          >
            <Formik<InvestorRiskAssessment>
              enableReinitialize
              initialValues={{
                [`q${statementNumber}`]:
                  String(userRiskQuestions?.[`q${statementNumber}`]) ||
                  undefined,
              }}
              validate={async (values) => {
                let errors = {} as InvestorRiskAssessment

                const schema = Yup.object({
                  [`q${statementNumber}`]: Yup.number()
                    .min(1)
                    .max(5)
                    .required(t("common:errors.required"))
                    .typeError(t("common:errors.required")),
                })

                await schema.validate(values).catch((e) => {
                  errors[`q${statementNumber}`] = e.message
                })

                return errors
              }}
              onSubmit={handleSubmit}
            >
              {({ submitForm, isSubmitting }) => {
                return (
                  <Form style={{ width: "100%" }}>
                    <VStack spacing={["6", "8"]} alignItems="start" maxW="md">
                      <RadioGroupControl
                        name={`q${statementNumber}`}
                        label={t("riskAssessment.radio.label")}
                        variant="filled"
                      >
                        {["1", "2", "3", "4", "5"].map((option) => (
                          <Radio key={option} value={option}>
                            <Text>
                              {t(
                                `riskAssessment.question.options.${option}.title`,
                              )}
                            </Text>
                          </Radio>
                        ))}
                      </RadioGroupControl>
                    </VStack>

                    <Portal containerRef={ref}>
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
                          onClick={submitForm}
                          isLoading={isSubmitting}
                          loadingText={t("common:button.next")}
                          isFullWidth={isMobileView}
                        >
                          {t("common:button.next")}
                        </Button>
                      </Stack>
                    </Portal>
                  </Form>
                )
              }}
            </Formik>
          </Container>
        </Flex>
      )
    },
    [
      currentPage,
      handleSubmit,
      isFirstPage,
      isMobileView,
      previousPage,
      t,
      userRiskQuestions,
    ],
  )

  const ChapterHeaderStepper = (props?: StyleProps) => {
    if (!isRatakeRiskAssessment) {
      return (
        <Stepper activeStep={3} orientation="horizontal" {...props}>
          <Step index={0} completed />
          <Step index={1} completed />
          <Step index={2}>
            <StepContent>
              <StepLabel color="white" fontWeight="bold">
                {t("chapterSelection.chapterThree.stepper.title")}
              </StepLabel>
            </StepContent>
          </Step>
        </Stepper>
      )
    } else {
      return (
        <Text color="gray.400" fontSize="sm" {...props}>
          {t("riskAssessment.labels.riskAssessment")}
        </Text>
      )
    }
  }

  return (
    <ModalLayout
      title={t("riskAssessment.page.title")}
      description={t("riskAssessment.page.description")}
      containerRef={containerRef}
      header={
        <ModalHeader
          ps={{ base: "0", md: 4 }}
          boxShadow="0 0 0 4px var(--chakra-colors-gray-900)"
          {...(isDesktopView && {
            headerLeft: (
              <Stack
                isInline
                ps="6"
                spacing="6"
                {...(isRatakeRiskAssessment && {
                  alignItems: "center",
                })}
              >
                <Divider orientation="vertical" bgColor="white" height="28px" />
                <ChapterHeaderStepper />
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

              {!isRatakeRiskAssessment ? (
                <SaveAndExitButton
                  onSaveButtonProps={{
                    as: Link,
                    href: "/",
                  }}
                />
              ) : (
                <Link
                  href={
                    !initiatorCondition
                      ? "/personalized-proposal?name=risk-assessment"
                      : "/profile"
                  }
                  color="primary.500"
                  mx="3"
                >
                  {!initiatorCondition
                    ? t("riskAssessment.links.backToProposal")
                    : t(`common:button.backToProfile`)}
                </Link>
              )}
            </>
          }
          subheader={
            <>
              {isMobileView && (
                <ChapterHeaderStepper
                  h="10"
                  px={isRatakeRiskAssessment ? "4" : "0"}
                  {...(isRatakeRiskAssessment && { pt: 3 })}
                />
              )}
            </>
          }
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
        {pages.map(createStatement)}
      </Container>
    </ModalLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = getSession(ctx.req, ctx.res)

  if (session) {
    const { roles } = session

    if (roles?.includes("client-desktop")) {
      let destination = ctx.locale === "ar" ? "/ar/404" : "/404"
      return {
        redirect: {
          destination,
          permanent: true,
        },
      }
    }
  }

  return {
    props: {},
  }
}

export default withPageAuthRequired(RiskAssessmentScreen)
