import {
  Box,
  Center,
  Container,
  Divider,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"
import * as Yup from "yup"

import { Radio, RadioGroupControl, SliderControl } from "~/components"
import { InvestorProfileGoals, YesOrNo } from "~/services/mytfo/types"
import formatCurrency, {
  formatCurrencyWithCommas,
} from "~/utils/formatCurrency"

import QuestionInfoCard from "../InvestorProfile/QuestionInfoCard"
import InvestmentGoalsFormActions from "./InvestmentGoalsFormActions"
import { useInvestmentGoalsFormContext } from "./InvestmentGoalsFormContext"
import InvestmentGoalTitleBox from "./InvestmentGoalTitleBox"

const InvestmentGoalQuestionFiveForm = React.forwardRef<
  HTMLDivElement,
  unknown
>(function InvestmentGoalQuestionFiveForm(_props, _ref) {
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
  const [val, setVal] = React.useState(false)

  return (
    <Flex py={{ base: 2, md: 16 }} direction={{ base: "column", md: "row" }}>
      <InvestmentGoalTitleBox
        heading={t("investmentGoals.question.3.title")}
        description={t("investmentGoals.question.3.description")}
        isValueWithIcon={!isMobileView && val}
        infoCard={
          !isMobileView &&
          val && (
            <QuestionInfoCard
              infoIcon={true}
              heading={t("investmentGoals.question.3.heading")}
              description={t("investmentGoals.question.3.subheading")}
            />
          )
        }
      />

      <Center px={{ base: 0, md: "64px" }} py={{ base: "48px", md: 0 }}>
        <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
      </Center>

      <Container
        flex={isTabletView ? "2" : "1"}
        px="0"
        {...(isMobileView && { mb: "36" })}
        {...(isMobileView && {
          h: "100vh",
        })}
      >
        <Formik<
          Pick<
            InvestorProfileGoals,
            "shouldGenerateIncome" | "desiredAnnualIncome"
          >
        >
          enableReinitialize
          initialValues={{
            shouldGenerateIncome:
              investmentGoals?.shouldGenerateIncome || undefined,
            desiredAnnualIncome:
              (investmentGoals &&
                investmentGoals?.desiredAnnualIncome &&
                Math.round(
                  ((investmentGoals?.desiredAnnualIncome * 100) /
                    Number(investmentGoals?.investmentAmountInUSD)) *
                    2,
                ) / 2) ||
              1.5,
          }}
          validationSchema={Yup.object({
            shouldGenerateIncome: Yup.mixed<YesOrNo>()
              .oneOf(["yes", "no"])
              .required(t("common:errors.required")),
            desiredAnnualIncome: Yup.number().when("shouldGenerateIncome", {
              is: "yes",
              then: Yup.number().required(t("common:errors.required")),
              otherwise: undefined,
            }),
          })}
          onSubmit={handleSubmit}
        >
          {(formikProps) => {
            return (
              <Form style={{ width: "100%" }}>
                <VStack spacing={["6", "8"]} alignItems="start" maxW="md">
                  <RadioGroupControl
                    name="shouldGenerateIncome"
                    label={t("investmentGoals.question.radio.label")}
                    variant="filled"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.value === "yes") {
                        setVal(true)
                      } else setVal(false)
                    }}
                  >
                    {["yes", "no"].map((option) => (
                      <>
                        <Radio
                          key={option}
                          value={option}
                          variant="filled"
                          width="100%"
                        >
                          <Text>
                            {t(
                              `investmentGoals.question.3.options.${option}.title`,
                            )}
                          </Text>
                          <Text fontSize="xs">
                            {t(
                              `investmentGoals.question.3.options.${option}.subtitle`,
                            )}
                          </Text>
                        </Radio>

                        {formikProps?.values?.shouldGenerateIncome === "yes" &&
                          option === "yes" && (
                            <Box px={{ base: 0, md: 5 }}>
                              <Text
                                style={{ marginTop: "40px" }}
                                fontSize="sm"
                                color="gray.500"
                                fontWeight="extrabold"
                              >
                                {t("investmentGoals.question.3.question")}
                              </Text>

                              {investmentGoals &&
                                investmentGoals?.investmentAmountInUSD && (
                                  <Trans
                                    i18nKey="proposal:investmentGoals.question.3.statement"
                                    components={[
                                      <Text
                                        style={{ marginBottom: "20px" }}
                                        fontSize="xs"
                                        color="gray.500"
                                        mt="2"
                                        key="0"
                                      />,
                                    ]}
                                    values={{
                                      amount: formatCurrencyWithCommas(
                                        investmentGoals?.investmentAmountInUSD!.toString(),
                                      ),
                                    }}
                                  />
                                )}

                              <Box
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  alignItems: "flex-start",
                                  marginBottom: "80px",
                                }}
                              >
                                <Text
                                  me="6"
                                  mt="4"
                                  whiteSpace="nowrap"
                                  color="gray.400"
                                  fontSize="sm"
                                >
                                  {t("investmentGoals.question.3.leftMarker")}
                                </Text>
                                <SliderControl
                                  name="desiredAnnualIncome"
                                  aria-label="desiredAnnualIncome"
                                  markerOnTop={true}
                                  tooltipVariant="secondary"
                                  sliderProps={{
                                    colorScheme: "primary",
                                    min: 0.5,
                                    max: 6.5,
                                    step: 0.5,
                                    mt: "4",
                                  }}
                                  sliderMarkLabel={
                                    (formikProps.values?.desiredAnnualIncome &&
                                      formikProps.values?.desiredAnnualIncome.toString() +
                                        "%") ||
                                    "3%"
                                  }
                                  isToolTipRequired={true}
                                  toolTipLabel={
                                    lang === "ar"
                                      ? t(
                                          "investmentGoals.question.3.correspondence",
                                        ) +
                                        formatCurrencyWithCommas(
                                          Math.round(
                                            (formikProps.values
                                              ?.desiredAnnualIncome! *
                                              Number(
                                                investmentGoals?.investmentAmountInUSD,
                                              )) /
                                              100,
                                          ).toString() || "",
                                        ) +
                                        t("common:generic.dollar")
                                      : t(
                                          "investmentGoals.question.3.correspondence",
                                        ) +
                                        formatCurrency(
                                          Math.round(
                                            (formikProps.values
                                              ?.desiredAnnualIncome! *
                                              Number(
                                                investmentGoals?.investmentAmountInUSD,
                                              )) /
                                              100,
                                          ).toString() || "",
                                        )
                                  }
                                />

                                <Text
                                  ms="6"
                                  mt="4"
                                  whiteSpace="nowrap"
                                  color="gray.400"
                                  fontSize="sm"
                                >
                                  {t("investmentGoals.question.3.rightMarker")}
                                </Text>
                              </Box>
                            </Box>
                          )}
                      </>
                    ))}
                  </RadioGroupControl>
                </VStack>

                <InvestmentGoalsFormActions ref={ref} {...formikProps} />
              </Form>
            )
          }}
        </Formik>
      </Container>
    </Flex>
  )
})

export default InvestmentGoalQuestionFiveForm
