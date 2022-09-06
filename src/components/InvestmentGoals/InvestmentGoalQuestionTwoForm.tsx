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

import { Checkbox, CheckboxGroupControl, TextareaControl } from "~/components"
import { InvestmentGoal, InvestorProfileGoals } from "~/services/mytfo/types"

import InvestmentGoalsFormActions from "./InvestmentGoalsFormActions"
import { useInvestmentGoalsFormContext } from "./InvestmentGoalsFormContext"
import InvestmentGoalTitleBox from "./InvestmentGoalTitleBox"

const InvestmentGoalQuestionTwoForm = React.forwardRef<HTMLDivElement, unknown>(
  function InvestmentGoalQuestionTwoForm(_props, _ref) {
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

    const selectAllList = React.useMemo(() => {
      return Object.values(InvestmentGoal).filter(
        (value) => value !== InvestmentGoal.Other,
      )
    }, [])

    return (
      <Flex py={{ base: 2, md: 16 }} direction={{ base: "column", md: "row" }}>
        <InvestmentGoalTitleBox
          heading={t("investmentGoals.question.2.title")}
          description={t("investmentGoals.question.2.description")}
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
              "investmentGoals" | "investmentGoalsOtherDetails"
            >
          >
            enableReinitialize
            initialValues={{
              investmentGoals: investmentGoals?.investmentGoals || undefined,
              investmentGoalsOtherDetails:
                investmentGoals?.investmentGoalsOtherDetails || undefined,
            }}
            validationSchema={Yup.object({
              investmentGoals: Yup.array()
                .of(Yup.string().oneOf(Object.keys(InvestmentGoal)))
                .min(1, t("common:errors.required")),
              investmentGoalsOtherDetails: Yup.string().when(
                "investmentGoals",
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
                    <CheckboxGroupControl
                      name="investmentGoals"
                      label={t("investmentGoals.question.checkbox.label")}
                      variant="filled"
                      showSelectAll={true}
                      selectAllList={selectAllList}
                    >
                      {Object.values(InvestmentGoal).map((option) => (
                        <Checkbox key={option} value={option}>
                          <Text>
                            {t(
                              `investmentGoals.question.2.options.${option}.title`,
                            )}
                          </Text>
                        </Checkbox>
                      ))}
                    </CheckboxGroupControl>
                    {formikProps.values.investmentGoals?.includes(
                      InvestmentGoal.Other,
                    ) && (
                      <TextareaControl
                        placeholder={t(
                          "investmentGoals.question.2.options.placeholders.insertDetails",
                        )}
                        name="investmentGoalsOtherDetails"
                        variant="filled"
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
  },
)

export default React.memo(InvestmentGoalQuestionTwoForm)
