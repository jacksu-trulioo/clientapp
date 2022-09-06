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

import { Radio, RadioGroupControl } from "~/components"
import { InvestorProfileGoals, YesOrNo } from "~/services/mytfo/types"

import InvestmentGoalsFormActions from "./InvestmentGoalsFormActions"
import { useInvestmentGoalsFormContext } from "./InvestmentGoalsFormContext"
import InvestmentGoalTitleBox from "./InvestmentGoalTitleBox"

const InvestmentGoalQuestionEightForm = React.forwardRef<
  HTMLDivElement,
  unknown
>(function InvestmentGoalQuestionEightForm(_props, _ref) {
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
        heading={t("investmentGoals.question.8.title")}
        description={t("investmentGoals.question.8.description")}
      />

      <Center px={{ base: 0, md: "64px" }} py={{ base: "48px", md: 0 }}>
        <Divider orientation={isMobileView ? "horizontal" : "vertical"} />
      </Center>

      <Container flex={isTabletView ? "2" : "1"} px="0">
        <Formik<Pick<InvestorProfileGoals, "esgCompliant">>
          enableReinitialize
          initialValues={{
            esgCompliant: investmentGoals?.esgCompliant || undefined,
          }}
          validationSchema={Yup.object({
            esgCompliant: Yup.mixed<YesOrNo>()
              .oneOf(["yes", "no"])
              .required(t("common:errors.required")),
          })}
          onSubmit={handleSubmit}
        >
          {(formikProps) => {
            return (
              <Form style={{ width: "100%" }}>
                <VStack spacing={["6", "8"]} alignItems="start" maxW="md">
                  <RadioGroupControl
                    name="esgCompliant"
                    variant="filled"
                    label={t("investmentGoals.question.radio.label")}
                  >
                    {["yes", "no"].map((option) => (
                      <Radio key={option} value={option}>
                        <Text>
                          {t(`investmentGoals.question.8.options.${option}`)}
                        </Text>
                      </Radio>
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

export default React.memo(InvestmentGoalQuestionEightForm)
