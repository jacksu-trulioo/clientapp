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
import { PriorInvestment, Profile } from "~/services/mytfo/types"

import {
  getPriorExperienceInitialValues,
  usePriorExperienceSchema,
} from "./InvestorProfile.schema"
import InvestorProfileFormActions from "./InvestorProfileFormActions"
import { useInvestorProfileFormContext } from "./InvestorProfileFormContext"
import InvesterProfileTitleBox from "./InvestorProfileTitleBox"

const InvestorPriorExperience = React.forwardRef<HTMLDivElement, unknown>(
  function InvestorPriorExperience(_props, _ref) {
    const { ref, handleSubmit } = useInvestorProfileFormContext()
    const { t } = useTranslation("proposal")
    const { user } = useUser()

    const validationSchema = usePriorExperienceSchema()
    const initialValues = getPriorExperienceInitialValues(user)

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

    const selectAllList = React.useMemo(() => {
      return Object.values(PriorInvestment).filter(
        (value) => value !== PriorInvestment.Other,
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
            heading={t("investorProfile.priorExperience.title")}
            infoHeading={t(
              "investorProfile.priorExperience.questionInfo.title",
            )}
            infoDescription={t(
              "investorProfile.priorExperience.questionInfo.description",
            )}
          />

          <Center px={{ base: 0, md: "64px" }} py={{ base: "32px", md: 0 }}>
            <Divider
              orientation={isMobileView ? "horizontal" : "vertical"}
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
                  <Form style={{ width: "100%" }}>
                    <VStack
                      w="100%"
                      spacing={{ base: 2, md: 2 }}
                      alignItems="start"
                      maxW="md"
                    >
                      <Text color="gray.400" mb={isMobileView ? "4" : "6"}>
                        {t(
                          "investorProfile.priorExperience.placeholderQuestion",
                        )}
                      </Text>
                      <CheckboxGroupControl
                        name="investorSurvey.priorInvExperience"
                        variant="filled"
                        label={t("investmentGoals.question.checkbox.label")}
                        showSelectAll
                        selectAllList={selectAllList}
                      >
                        {Object.values(PriorInvestment).map((option) => (
                          <Checkbox
                            key={option}
                            value={option}
                            alignItems="flex-start"
                          >
                            <Text fontSize="sm" color="contrast.200">
                              {t(
                                `investorProfile.priorExperience.options.${option}.title`,
                              )}
                            </Text>
                            <Text fontSize="xs" mt="2">
                              {t(
                                `investorProfile.priorExperience.options.${option}.description`,
                              )}
                            </Text>
                          </Checkbox>
                        ))}
                      </CheckboxGroupControl>
                      {formikProps.values?.investorSurvey?.priorInvExperience?.includes(
                        PriorInvestment.Other,
                      ) && (
                        <>
                          <TextareaControl
                            name="investorSurvey.otherPriorDetails"
                            placeholder={t(
                              "investorProfile.priorExperience.otherPriorDetails.placeholder",
                            )}
                            maxW="md"
                            mt="2"
                          />
                          <Text mt="2" color="gray.600" fontSize="sm">
                            {t(
                              "investorProfile.priorExperience.otherPriorDetails.specifyOtherText",
                            )}
                          </Text>
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

export default React.memo(InvestorPriorExperience)
