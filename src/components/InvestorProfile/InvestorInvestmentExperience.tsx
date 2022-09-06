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
import { InvestmentExperience, Profile } from "~/services/mytfo/types"

import {
  getInvestmentExperienceInitialValues,
  useInvestmentExperienceSchema,
} from "./InvestorProfile.schema"
import InvestorProfileFormActions from "./InvestorProfileFormActions"
import { useInvestorProfileFormContext } from "./InvestorProfileFormContext"
import InvesterProfileTitleBox from "./InvestorProfileTitleBox"

const InvestorInvestmentExperience = React.forwardRef<HTMLDivElement, unknown>(
  function InvestmentGoalQuestionOneForm(_props, _ref) {
    const { ref, handleSubmit } = useInvestorProfileFormContext()
    const { t } = useTranslation("proposal")

    const { user } = useUser()
    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isFullWidth = useBreakpointValue({ base: true, md: false })
    const isTabletView = useBreakpointValue({
      base: false,
      md: true,
      lg: false,
    })
    const validationSchema = useInvestmentExperienceSchema()
    const initialValues = getInvestmentExperienceInitialValues(user)

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
            heading={t("investorProfile.investmentExperience.title")}
            infoHeading={t(
              "investorProfile.investmentExperience.questionInfo.title",
            )}
            infoDescription={t(
              "investorProfile.investmentExperience.questionInfo.description",
            )}
          />
          <Center px={{ base: 0, md: "64px" }} py={{ base: "32px", md: 0 }}>
            <Divider orientation={isFullWidth ? "horizontal" : "vertical"} />
          </Center>

          <Container
            flex={isTabletView ? "2" : "1"}
            px="0"
            {...(isMobileView && { mb: "36" })}
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
                      <Text color="gray.400">
                        {t(
                          "investorProfile.investmentExperience.placeholderQuestion",
                        )}
                      </Text>
                      <RadioGroupControl
                        name="investorSurvey.investmentExperience"
                        label={t("investmentGoals.question.radio.label")}
                        variant="filled"
                      >
                        {Object.values(InvestmentExperience).map((option) => (
                          <Radio key={option} value={option}>
                            <Text>
                              {t(
                                `investorProfile.investmentExperience.options.${option}.title`,
                              )}
                            </Text>
                          </Radio>
                        ))}
                      </RadioGroupControl>
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

export default React.memo(InvestorInvestmentExperience)
