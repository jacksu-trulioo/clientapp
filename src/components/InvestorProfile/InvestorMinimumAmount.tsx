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
import { motion } from "framer-motion"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Radio, RadioGroupControl } from "~/components"
import { useUser } from "~/hooks/useUser"
import { Profile, StartInvestmentTimeFrame } from "~/services/mytfo/types"

import { SelectControl } from ".."
import {
  getMinimumAmountInitialValues,
  useMinimumAmountSchema,
} from "./InvestorProfile.schema"
import InvestorProfileFormActions from "./InvestorProfileFormActions"
import { useInvestorProfileFormContext } from "./InvestorProfileFormContext"
import InvesterProfileTitleBox from "./InvestorProfileTitleBox"

const InvestorMinimumAmount = React.forwardRef<HTMLDivElement, unknown>(
  function InvestmentGoalQuestionOneForm(_props, _ref) {
    const { ref, handleSubmit } = useInvestorProfileFormContext()
    const { t } = useTranslation("proposal")
    const { user } = useUser()
    const isFullWidth = useBreakpointValue({ base: true, md: false })
    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isTabletView = useBreakpointValue({
      base: false,
      md: true,
      lg: false,
    })

    const isDesktopView = useBreakpointValue({
      base: false,
      md: false,
      lg: true,
    })

    const validationSchema = useMinimumAmountSchema()
    const initialValues = getMinimumAmountInitialValues(user)

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <Flex
          py={{ base: 2, md: 16 }}
          direction={{ base: "column", md: "row" }}
        >
          <InvesterProfileTitleBox
            heading={t("investorProfile.minimumInvestment.title")}
            infoHeading={t(
              "investorProfile.minimumInvestment.questionInfo.title",
            )}
            infoDescription={t(
              "investorProfile.minimumInvestment.questionInfo.description",
            )}
          />

          <Center px={{ base: 0, md: "64px" }} py={{ base: "32px", md: 0 }}>
            <Divider
              orientation={isFullWidth ? "horizontal" : "vertical"}
              {...(isDesktopView && {
                sx: {
                  position: "absolute",
                  top: "24",
                  bottom: "24",
                  height: "60%",
                },
              })}
              {...(isTabletView && {
                sx: {
                  position: "absolute",
                  top: "20",
                  bottom: "25",
                  height: "50%",
                },
              })}
            />
          </Center>

          <Container
            flex={isTabletView ? "2" : "1"}
            px="0"
            {...(isMobileView && { mb: "36" })}
            h="100vh"
          >
            <Formik<Pick<Profile, "investorSurvey">>
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {(formikProps) => {
                return (
                  <Form style={{ width: "100%" }}>
                    <VStack
                      spacing={{ base: 6, md: 8 }}
                      alignItems="start"
                      maxW="md"
                    >
                      <Text>
                        {t(`investorProfile.minimumInvestment.minimumAmount`)}
                      </Text>

                      <RadioGroupControl
                        name="investorSurvey.investMinimumAmount"
                        variant="filled"
                      >
                        {["yes", "no"].map((option) => (
                          <Radio key={option} value={option}>
                            <Text>
                              {t(
                                `investorProfile.minimumInvestment.options.${option}.title`,
                              )}
                            </Text>
                          </Radio>
                        ))}
                      </RadioGroupControl>
                      {formikProps.values.investorSurvey
                        ?.investMinimumAmount === "yes" && (
                        <>
                          <Text>
                            {t("investorProfile.minimumInvestment.text")}
                          </Text>
                          <SelectControl
                            name="investorSurvey.whenToStartInvestment"
                            selectProps={{
                              placeholder: t("common:select.placeholder"),
                              options: [
                                {
                                  label: t(
                                    "investorProfile.minimumInvestment.select.timeFrame.options.thisMonth",
                                  ),
                                  value: StartInvestmentTimeFrame.ThisMonth,
                                },
                                {
                                  label: t(
                                    "investorProfile.minimumInvestment.select.timeFrame.options.next3Months",
                                  ),
                                  value: StartInvestmentTimeFrame.Next3Months,
                                },
                                {
                                  label: t(
                                    "investorProfile.minimumInvestment.select.timeFrame.options.next6Months",
                                  ),
                                  value: StartInvestmentTimeFrame.Next6Months,
                                },
                                {
                                  label: t(
                                    "investorProfile.minimumInvestment.select.timeFrame.options.after1Year",
                                  ),
                                  value: StartInvestmentTimeFrame.After1Year,
                                },
                              ],
                            }}
                          />
                        </>
                      )}
                    </VStack>

                    <InvestorProfileFormActions ref={ref} {...formikProps} />
                  </Form>
                )
              }}
            </Formik>
          </Container>
        </Flex>
      </motion.div>
    )
  },
)

export default React.memo(InvestorMinimumAmount)
