import {
  Center,
  Container,
  Divider,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"
import * as Yup from "yup"

import { Radio, RadioGroupControl, TextareaControl } from "~/components"
import { InvestorProfileGoals, PortfolioOwner } from "~/services/mytfo/types"

import InvestmentGoalsFormActions from "./InvestmentGoalsFormActions"
import { useInvestmentGoalsFormContext } from "./InvestmentGoalsFormContext"
import InvestmentGoalTitleBox from "./InvestmentGoalTitleBox"

const InvestmentGoalQuestionOneForm = React.forwardRef<HTMLDivElement, unknown>(
  function InvestmentGoalQuestionOneForm(_props, _ref) {
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
          heading={t("investmentGoals.question.1.title")}
          description={t("investmentGoals.question.1.description")}
        />

        <Center px={{ base: 0, md: "64px" }} py={{ base: "48px", md: 0 }}>
          <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
        </Center>

        <Container
          flex={isTabletView ? "2" : "1"}
          px="0"
          {...(isMobileView && {
            h: "100vh",
          })}
        >
          <Formik<
            Pick<
              InvestorProfileGoals,
              "whoIsPortfolioFor" | "whoIsPortfolioForOtherDetails"
            >
          >
            enableReinitialize
            initialValues={{
              whoIsPortfolioFor:
                investmentGoals?.whoIsPortfolioFor || undefined,
              whoIsPortfolioForOtherDetails:
                investmentGoals?.whoIsPortfolioForOtherDetails || undefined,
            }}
            validationSchema={Yup.object({
              whoIsPortfolioFor: Yup.string()
                .oneOf(Object.values(PortfolioOwner))
                .required(t("common:errors.required")),
              whoIsPortfolioForOtherDetails: Yup.string().when(
                "whoIsPortfolioFor",
                {
                  is: (value: string[]) => {
                    return value?.includes("Other")
                  },
                  then: Yup.string().required(t("common:errors.required")),
                  otherwise: Yup.string(),
                },
              ),
            })}
            onSubmit={handleSubmit}
          >
            {(formikProps) => {
              return (
                <Form style={{ width: "100%" }}>
                  <VStack spacing={["6", "8"]} alignItems="start" maxW="md">
                    <RadioGroupControl
                      name="whoIsPortfolioFor"
                      variant="filled"
                      label={t("investmentGoals.question.radio.label")}
                    >
                      {Object.values(PortfolioOwner).map((option) => (
                        <Radio key={option} value={option}>
                          <Text>
                            {t(
                              `investmentGoals.question.1.options.${option}.title`,
                            )}
                          </Text>
                        </Radio>
                      ))}
                    </RadioGroupControl>
                  </VStack>

                  {formikProps.values.whoIsPortfolioFor ===
                    PortfolioOwner.Other && (
                    <TextareaControl
                      placeholder={t(
                        "investmentGoals.question.1.options.placeholders.insertDetails",
                      )}
                      name="whoIsPortfolioForOtherDetails"
                      maxW="md"
                      mt="4"
                    />
                  )}

                  <InvestmentGoalsFormActions ref={ref} {...formikProps} />
                </Form>
              )
            }}
          </Formik>
        </Container>
      </Flex>
    )
  },
)

export default React.memo(InvestmentGoalQuestionOneForm)
