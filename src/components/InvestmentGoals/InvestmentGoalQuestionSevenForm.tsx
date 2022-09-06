import {
  Center,
  Container,
  Divider,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/layout"
import { chakra, Tooltip, useBreakpointValue } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"
import * as Yup from "yup"

import { Checkbox, CheckboxGroupControl, InfoIcon } from "~/components"
import {
  AdditionalPreference,
  InvestorProfileGoals,
} from "~/services/mytfo/types"

import InvestmentGoalsFormActions from "./InvestmentGoalsFormActions"
import { useInvestmentGoalsFormContext } from "./InvestmentGoalsFormContext"
import InvestmentGoalTitleBox from "./InvestmentGoalTitleBox"

const InvestmentGoalQuestionSevenForm = React.forwardRef<
  HTMLDivElement,
  unknown
>(function InvestmentGoalQuestionSevenForm(_props, _ref) {
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
    return Object.values(AdditionalPreference).filter(
      (value) => value !== AdditionalPreference.None,
    )
  }, [])

  return (
    <Flex py={{ base: 2, md: 16 }} direction={{ base: "column", md: "row" }}>
      <InvestmentGoalTitleBox
        heading={t("investmentGoals.question.7.title")}
        description={t("investmentGoals.question.7.description")}
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
        <Formik<Pick<InvestorProfileGoals, "additionalPreferences">>
          enableReinitialize
          initialValues={{
            additionalPreferences:
              investmentGoals?.additionalPreferences || undefined,
          }}
          validationSchema={Yup.object({
            additionalPreferences: Yup.array()
              .of(Yup.string().oneOf(Object.values(AdditionalPreference)))
              .min(1, t("common:errors.required"))
              .required(t("common:errors.required")),
          })}
          onSubmit={handleSubmit}
        >
          {(formikProps) => {
            return (
              <Form style={{ width: "100%" }}>
                <VStack spacing={["6", "8"]} alignItems="start" maxW="md">
                  <CheckboxGroupControl
                    name="additionalPreferences"
                    label={t("investmentGoals.question.checkbox.label")}
                    variant="filled"
                    value={
                      formikProps.values.additionalPreferences?.includes(
                        AdditionalPreference.None,
                      )
                        ? [AdditionalPreference.None]
                        : formikProps.values.additionalPreferences
                    }
                    isValueRequired
                    showSelectAll={true}
                    isSelectAllDisabled={formikProps?.values?.additionalPreferences?.includes(
                      AdditionalPreference.None,
                    )}
                    selectAllList={selectAllList}
                  >
                    {Object.values(AdditionalPreference).map((option) => (
                      <Checkbox
                        key={option}
                        value={option}
                        isDisabled={
                          formikProps?.values?.additionalPreferences?.includes(
                            AdditionalPreference.None,
                          ) && option !== AdditionalPreference.None
                        }
                        onChange={(e) => {
                          if (
                            option === AdditionalPreference.None &&
                            e.target.checked
                          ) {
                            formikProps.setFieldValue("additionalPreferences", [
                              AdditionalPreference.None,
                            ])
                          }
                        }}
                      >
                        <Text>
                          {t(
                            `investmentGoals.question.7.options.${option}.title`,
                          )}
                          {(option === AdditionalPreference.Ethical ||
                            option ===
                              AdditionalPreference.ShariahCompliant) && (
                            <Tooltip
                              hasArrow
                              label={t(
                                `investmentGoals.question.7.options.${option}.description`,
                              )}
                              placement="bottom"
                            >
                              <chakra.span
                                {...(!isMobileView && {
                                  ps: "2",
                                })}
                                {...(isMobileView && {
                                  px: "4",
                                })}
                              >
                                <InfoIcon color="primary.500" />
                              </chakra.span>
                            </Tooltip>
                          )}
                        </Text>
                      </Checkbox>
                    ))}
                  </CheckboxGroupControl>
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

export default React.memo(InvestmentGoalQuestionSevenForm)
