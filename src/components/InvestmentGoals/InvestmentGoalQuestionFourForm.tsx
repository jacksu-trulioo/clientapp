import { Box, Center, Container, Divider, Flex, Text } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"
import * as Yup from "yup"

import { SliderControl } from "~/components"
import { InvestorProfileGoals } from "~/services/mytfo/types"
import formatYearName from "~/utils/formatYearName"

import InvestmentGoalsFormActions from "./InvestmentGoalsFormActions"
import { useInvestmentGoalsFormContext } from "./InvestmentGoalsFormContext"
import InvestmentGoalTitleBox from "./InvestmentGoalTitleBox"

const InvestmentGoalQuestionFourForm = React.forwardRef<
  HTMLDivElement,
  unknown
>(function InvestmentGoalQuestionFourForm(_props, _ref) {
  const { ref, handleSubmit } = useInvestmentGoalsFormContext()
  const { t, lang } = useTranslation("proposal")
  const { data: investmentGoals } = useSWR<InvestorProfileGoals>(
    "/api/user/investment-goals",
  )

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lg: false,
  })

  const isDesktopView = !isMobileView

  return (
    <Flex py={{ base: 2, md: 16 }} direction={{ base: "column", md: "row" }}>
      <InvestmentGoalTitleBox
        heading={t("investmentGoals.question.4.title")}
        description={t("investmentGoals.question.4.description")}
      />

      <Center px={{ base: 0, md: "64px" }} py={{ base: "48px", md: 0 }}>
        <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
      </Center>

      <Container
        flex={isTabletView ? "2" : "1"}
        px="0"
        {...(isMobileView && { mb: "36" })}
      >
        <Text mb="6"> {t("investmentGoals.question.4.selectHorizon")}</Text>
        <Formik<Pick<InvestorProfileGoals, "investmentDurationInYears">>
          enableReinitialize
          initialValues={{
            investmentDurationInYears:
              investmentGoals?.investmentDurationInYears || 7,
          }}
          validationSchema={Yup.object({
            investmentDurationInYears: Yup.number().min(1).max(25).required(),
          })}
          onSubmit={handleSubmit}
        >
          {(formikProps) => {
            let duration = "short"
            const investmentDurationInYears =
              formikProps.values?.investmentDurationInYears

            if (!investmentDurationInYears) return null

            if (
              investmentDurationInYears >= 1 &&
              investmentDurationInYears <= 2
            ) {
              duration = "short"
            }

            if (
              investmentDurationInYears >= 3 &&
              investmentDurationInYears <= 4
            ) {
              duration = "medium"
            }

            if (
              investmentDurationInYears >= 5 &&
              investmentDurationInYears <= 24
            ) {
              duration = "long"
            }

            if (investmentDurationInYears === 25) {
              duration = "indefinite"
            }

            const LeftSliderMinText = () => (
              <Text
                me="6"
                mt="4"
                whiteSpace="nowrap"
                color="gray.400"
                fontSize="sm"
              >
                {t("investmentGoals.question.4.duration.min")}
              </Text>
            )

            const RightSliderMaxText = () => (
              <Text
                ms="6"
                mt="4"
                whiteSpace="nowrap"
                color="gray.400"
                fontSize="sm"
              >
                +{t("investmentGoals.question.4.duration.max")}
              </Text>
            )

            const sliderMarkLabel = `${
              investmentDurationInYears === 25 ? "+" : ""
            }${investmentDurationInYears} ${formatYearName(
              investmentDurationInYears,
              lang,
            )}`

            return (
              <>
                <Form>
                  <Flex justifyContent="center" alignItems="flex-start" mb="8">
                    {isDesktopView && <LeftSliderMinText />}

                    <Container>
                      <Box>
                        <SliderControl
                          aria-label="Time horizon slider"
                          name="investmentDurationInYears"
                          sliderProps={{
                            colorScheme: "primary",
                            min: 1,
                            max: 25,
                            step: 1,
                            mt: "4",
                          }}
                          sliderMarkLabel={sliderMarkLabel}
                          markerOnTop={true}
                        />
                      </Box>

                      {isMobileView && (
                        <Flex justifyContent="space-between">
                          <LeftSliderMinText />
                          <RightSliderMaxText />
                        </Flex>
                      )}

                      <Box
                        bgColor="gray.800"
                        py="3"
                        px="5"
                        rounded="md"
                        color="opal.500"
                        mt="4"
                      >
                        <Text fontWeight="bold" fontSize="xs" mb="4">
                          {t(
                            `investmentGoals.question.4.options.${duration}.title`,
                          )}
                        </Text>
                        <Text fontSize="xs">
                          {t(
                            `investmentGoals.question.4.options.${duration}.description`,
                          )}
                        </Text>
                      </Box>
                    </Container>

                    {isDesktopView && <RightSliderMaxText />}
                  </Flex>

                  <InvestmentGoalsFormActions ref={ref} {...formikProps} />
                </Form>
              </>
            )
          }}
        </Formik>
      </Container>
    </Flex>
  )
})

export default React.memo(InvestmentGoalQuestionFourForm)
