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
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"
import * as Yup from "yup"

import { Checkbox, CheckboxGroupControl } from "~/components"
import { Asset, InvestorProfileGoals } from "~/services/mytfo/types"

import InvestmentGoalsFormActions from "./InvestmentGoalsFormActions"
import { useInvestmentGoalsFormContext } from "./InvestmentGoalsFormContext"
import InvestmentGoalTitleBox from "./InvestmentGoalTitleBox"

const InvestmentGoalQuestionSixForm = React.forwardRef<HTMLDivElement, unknown>(
  function InvestmentGoalQuestionSixForm(_props, _ref) {
    const { ref, handleSubmit } = useInvestmentGoalsFormContext()
    const { t } = useTranslation("proposal")
    const { data: investmentGoals } = useSWR<InvestorProfileGoals>(
      "/api/user/investment-goals",
    )
    const router = useRouter()

    React.useEffect(() => {
      if ((investmentGoals?.investmentAmountInUSD || 0) < 10000000) {
        router.push("#" + 5)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isTabletView = useBreakpointValue({
      base: false,
      md: true,
      lg: false,
    })

    return (
      <Flex py={{ base: 2, md: 16 }} direction={{ base: "column", md: "row" }}>
        <InvestmentGoalTitleBox
          heading={t("investmentGoals.question.6.title")}
          description={t("investmentGoals.question.6.description")}
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
          <Formik<Pick<InvestorProfileGoals, "excludedAssets">>
            enableReinitialize
            initialValues={{
              excludedAssets: investmentGoals?.excludedAssets || undefined,
            }}
            validationSchema={Yup.object({
              excludedAssets: Yup.array()
                .of(Yup.string().oneOf(Object.keys(Asset)))
                .min(1, t("common:errors.required")),
            })}
            onSubmit={handleSubmit}
          >
            {(formikProps) => {
              return (
                <Form style={{ width: "100%" }}>
                  <VStack spacing={["6", "8"]} alignItems="start" maxW="md">
                    <CheckboxGroupControl
                      name="excludedAssets"
                      label={t("investmentGoals.question.checkbox.label")}
                      variant="filled"
                    >
                      {Object.values(Asset).map((option) => (
                        <Checkbox key={option} value={option}>
                          <Text>
                            {t(
                              `investmentGoals.question.6.options.${option}.title`,
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
  },
)

export default React.memo(InvestmentGoalQuestionSixForm)
