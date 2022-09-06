import {
  Center,
  Container,
  Divider,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import useTranslation from "next-translate/useTranslation"
import React, { BaseSyntheticEvent } from "react"
import useSWR from "swr"
import * as Yup from "yup"

import { InputControl, Radio, RadioGroupControl } from "~/components"
import { InvestorProfileGoals, YesOrNo } from "~/services/mytfo/types"
import { formatCurrencyWithCommas } from "~/utils/formatCurrency"

import InvestmentGoalsFormActions from "./InvestmentGoalsFormActions"
import { useInvestmentGoalsFormContext } from "./InvestmentGoalsFormContext"
import InvestmentGoalTitleBox from "./InvestmentGoalTitleBox"

const InvestmentGoalQuestionThreeForm = React.forwardRef<
  HTMLDivElement,
  unknown
>(function InvestmentGoalQuestionThreeForm(_props, _ref) {
  const { ref, handleSubmit } = useInvestmentGoalsFormContext()
  const { t } = useTranslation("proposal")
  const { data: investmentGoals } = useSWR<InvestorProfileGoals>(
    "/api/user/investment-goals",
  )

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lg: false,
  })

  return (
    <Flex py={{ base: 2, md: 16 }} direction={{ base: "column", md: "row" }}>
      <InvestmentGoalTitleBox
        heading={t("investmentGoals.question.5.title")}
        description={t("investmentGoals.question.5.description")}
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
            | "investmentAmountInUSD"
            | "topUpInvestmentAnnually"
            | "annualInvestmentTopUpAmountInUSD"
          >
        >
          enableReinitialize
          initialValues={{
            investmentAmountInUSD: formatCurrencyWithCommas(
              investmentGoals?.investmentAmountInUSD?.toString() || "",
            ),
            topUpInvestmentAnnually:
              investmentGoals?.topUpInvestmentAnnually || undefined,
            annualInvestmentTopUpAmountInUSD: formatCurrencyWithCommas(
              investmentGoals?.annualInvestmentTopUpAmountInUSD?.toString() ||
                "",
            ),
          }}
          validationSchema={Yup.object({
            investmentAmountInUSD: Yup.string()
              .test(
                "min",
                t("investmentGoals.question.5.errors.minDescription"),
                (value) => {
                  let x = value
                    ? parseInt(value.toString().replace(/\D/g, ""))
                    : 0
                  return x >= 300000
                },
              )
              .test(
                "max",
                t("investmentGoals.question.5.errors.maxDescription"),
                (value) => {
                  let x = value
                    ? parseInt(value.toString().replace(/\D/g, ""))
                    : 0
                  return x <= 25000000
                },
              )
              .required(t("common:errors.required")),
            topUpInvestmentAnnually: Yup.mixed<YesOrNo>().required(
              t("common:errors.required"),
            ),
            annualInvestmentTopUpAmountInUSD: Yup.string().when(
              "topUpInvestmentAnnually",
              {
                is: "yes",
                then: Yup.string()
                  .test("min-topup", t("common:errors.required"), (value) => {
                    let x = value
                      ? parseInt(value.toString().replace(/\D/g, ""))
                      : 0
                    return x >= 1
                  })
                  .test(
                    "max",
                    t("investmentGoals.question.5.errors.maxDescription"),
                    (value) => {
                      let x = value
                        ? parseInt(value.toString().replace(/\D/g, ""))
                        : 0
                      return x <= 25000000
                    },
                  )
                  .required(t("common:errors.required")),
              },
            ),
          })}
          onSubmit={handleSubmit}
        >
          {(formikProps) => {
            return (
              <Form style={{ width: "100%" }}>
                <VStack spacing={["6", "8"]} alignItems="start" maxW="md">
                  <InputControl
                    name="investmentAmountInUSD"
                    inputLeftElement="$"
                    inputLeftElementColor="white"
                    label={t(
                      "investmentGoals.question.5.text.initialInvestment.title",
                    )}
                    inputProps={{
                      type: "string",
                      placeholder: t(
                        "investmentGoals.question.5.text.placeholder",
                      ),
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        formikProps.setFieldValue(
                          "investmentAmountInUSD",
                          e.target.value
                            ? formatCurrencyWithCommas(e.target.value)
                            : "",
                        )
                      },
                      inputMode: "numeric",
                    }}
                    {...(!formikProps?.errors?.investmentAmountInUSD && {
                      bottomTextLabel: t(
                        "investmentGoals.question.5.text.minimumAmount",
                      ),
                      bottomText: {
                        marginTop: "3",
                        color: "gray.400",
                        fontSize: "xs",
                      },
                    })}
                  />

                  <HStack mb="8" marginBlock="10">
                    <RadioGroupControl
                      name="topUpInvestmentAnnually"
                      label={t("investmentGoals.question.5.topUpMyInvestment")}
                      direction="row"
                      variant="filled"
                      onChange={async (e: BaseSyntheticEvent) => {
                        await formikProps.setFieldValue(
                          "topUpInvestmentAnnually",
                          e?.target?.value,
                        )
                        if (e.target.value === "no") {
                          await formikProps.setFieldValue(
                            "annualInvestmentTopUpAmountInUSD",
                            "",
                          )
                          await formikProps?.setFieldTouched(
                            "annualInvestmentTopUpAmountInUSD",
                            false,
                          )
                        }
                      }}
                    >
                      {["yes", "no"].map((option) => (
                        <Radio key={option} value={option} me="2">
                          <Text>
                            {t(
                              `investmentGoals.question.5.options.${option}.title`,
                            )}
                          </Text>
                        </Radio>
                      ))}
                    </RadioGroupControl>
                  </HStack>

                  {formikProps.values.topUpInvestmentAnnually === "yes" && (
                    <InputControl
                      name="annualInvestmentTopUpAmountInUSD"
                      inputLeftElement="$"
                      inputLeftElementColor="white"
                      label={t(
                        "investmentGoals.question.5.text.annualTopUp.title",
                      )}
                      inputProps={{
                        type: "string",
                        placeholder: t(
                          "investmentGoals.question.5.text.placeholder",
                        ),
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                          formikProps.setFieldValue(
                            "annualInvestmentTopUpAmountInUSD",
                            e.target.value
                              ? formatCurrencyWithCommas(e.target.value)
                              : "",
                          )
                        },
                        inputMode: "numeric",
                      }}
                    />
                  )}
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

export default React.memo(InvestmentGoalQuestionThreeForm)
