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

import { Checkbox, CheckboxGroupControl, TextareaControl } from "~/components"
import { useUser } from "~/hooks/useUser"
import { InterestedInvestments, Profile } from "~/services/mytfo/types"

import {
  getInterestedInvestmentInitialValues,
  useInterestedInvestmentSchema,
} from "./InvestorProfile.schema"
import InvestorProfileFormActions from "./InvestorProfileFormActions"
import { useInvestorProfileFormContext } from "./InvestorProfileFormContext"
import InvesterProfileTitleBox from "./InvestorProfileTitleBox"

const InvestorInterestedInvestment = React.forwardRef<HTMLDivElement, unknown>(
  function InvestmentGoalQuestionOneForm(_props, _ref) {
    const { ref, handleSubmit } = useInvestorProfileFormContext()
    const { t } = useTranslation("proposal")

    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isFullWidth = useBreakpointValue({ base: true, md: false })
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
    const { user } = useUser()
    const initialValues = getInterestedInvestmentInitialValues(user)
    const validationSchema = useInterestedInvestmentSchema()

    const selectAllList = React.useMemo(() => {
      return Object.values(InterestedInvestments).filter(
        (value) => value !== InterestedInvestments.Other,
      )
    }, [])

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
            heading={t("investorProfile.interestedInvestment.title")}
            infoHeading={t(
              "investorProfile.interestedInvestment.questionInfo.title",
            )}
            infoDescription={t(
              "investorProfile.interestedInvestment.questionInfo.description",
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
                  height: "70%",
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
            mb="4"
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
                  <Form>
                    <VStack
                      w="full"
                      spacing={{ base: 6, md: 8 }}
                      alignItems="start"
                      maxW="md"
                    >
                      <Text color="gray.400">
                        {t("investorProfile.interestedInvestment.text")}
                      </Text>
                      <CheckboxGroupControl
                        name="investorSurvey.interestedInvestments"
                        variant="filled"
                        label={t("investmentGoals.question.checkbox.label")}
                        showSelectAll={true}
                        selectAllList={selectAllList}
                      >
                        {Object.values(InterestedInvestments).map((option) => (
                          <Checkbox
                            key={option}
                            value={option}
                            alignItems="flex-start"
                          >
                            <Text fontSize="sm" color="contrast.200">
                              {t(
                                `investorProfile.interestedInvestment.options.${option}.title`,
                              )}
                            </Text>
                            <Text fontSize="xs" mt="2">
                              {t(
                                `investorProfile.interestedInvestment.options.${option}.description`,
                              )}
                            </Text>
                          </Checkbox>
                        ))}
                      </CheckboxGroupControl>
                    </VStack>
                    {formikProps.values.investorSurvey?.interestedInvestments?.includes(
                      InterestedInvestments.Other,
                    ) && (
                      <>
                        <TextareaControl
                          name="investorSurvey.otherInterestedInvDetails"
                          placeholder={t(
                            "investorProfile.interestedInvestment.otherInterestedInvestmentDetails.placeholder",
                          )}
                          maxW="md"
                          mt="2"
                        />
                        <Text mt="2" color="gray.600" fontSize="sm">
                          {t(
                            "investorProfile.interestedInvestment.otherInterestedInvestmentDetails.specifyOtherText",
                          )}
                        </Text>
                      </>
                    )}

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

export default React.memo(InvestorInterestedInvestment)
