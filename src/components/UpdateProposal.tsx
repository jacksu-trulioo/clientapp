import { Button } from "@chakra-ui/button"
import { Divider, Flex, HStack, VStack } from "@chakra-ui/layout"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal"
import {
  Box,
  chakra,
  FormLabel,
  Stack,
  Text,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react"
import { Form, Formik } from "formik"
import ky from "ky"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR, { mutate } from "swr"
import * as Yup from "yup"

import {
  InfoIcon,
  InputControl,
  Link,
  Logo,
  SelectControl,
  SliderControl,
  Toast,
} from "~/components"
import {
  AdditionalPreference,
  InvestmentGoal,
  InvestorProfileGoals,
  PortfolioOwner,
  RiskAssessmentScore,
  YesOrNo,
} from "~/services/mytfo/types"
import formatCurrency, {
  formatCurrencyWithCommas,
} from "~/utils/formatCurrency"
import formatYearName from "~/utils/formatYearName"
import {
  changeAnnualIncrease,
  changeInvestmentAmount,
  RetakeassessmentEvent,
  UpdateProposalEvent,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

function UpdateProposal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const isMobileView = useBreakpointValue({ base: true, md: false, lg: false })

  const [showErr, setShowErr] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) setShowErr(false)
  }, [isOpen])

  const isDesktop = useBreakpointValue({
    base: false,
    md: false,
    lg: true,
  })
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lg: false,
  })

  const { t, lang } = useTranslation("personalizedProposal")
  const { data: investmentGoals } = useSWR<InvestorProfileGoals>(
    "/api/user/investment-goals",
  )

  const { data: riskScoreResult } = useSWR<RiskAssessmentScore>(
    "/api/user/risk-assessment/retake-result",
  )

  const portfolioOwnerList = Object.values(PortfolioOwner).map((val) => {
    return {
      label: t(
        `personalizedProposal:updateProposal.portfolioOwnerListLabels.${val}`,
      ),
      value: val,
    }
  })

  const allGoals = Object.keys(InvestmentGoal)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: t(`personalizedProposal:updateProposal.goalLabels.${key}`),
      value: InvestmentGoal[key as keyof typeof InvestmentGoal],
    }))

  const allAdditionalPreferences = Object.keys(AdditionalPreference)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: t(
        `personalizedProposal:updateProposal.additionalPreferencesLabels.${key}`,
      ),
      value: AdditionalPreference[key as keyof typeof AdditionalPreference],
    }))

  const annualTopUpsLabels = ["yes", "no"].map((key) => ({
    label: t(`personalizedProposal:updateProposal.annualTopUpLabels.${key}`),
    value: key,
  }))

  const incomeGeneratingLabels = ["yes", "no"].map((key) => ({
    label: t(
      `personalizedProposal:updateProposal.incomeGeneratingLabel.${key}`,
    ),
    value: key,
  }))

  const calculateDesiredAmountIncome = (
    value: number,
    updatedInvestmentGoalsObj: InvestorProfileGoals,
  ) => {
    let amount =
      (value *
        parseInt(
          (updatedInvestmentGoalsObj?.investmentAmountInUSD || "")
            .toString()
            .replace(/\D/g, ""),
        ) || 0) / 100

    amount = Math.round(amount)

    return amount
  }

  const checklogoDisplay = () => {
    if (isDesktop) {
      return (
        <ModalHeader>
          <Logo
            pos="absolute"
            top={["3", "3"]}
            insetStart={["6", "6"]}
            height={["7", "7"]}
          />
        </ModalHeader>
      )
    }
  }

  const showErrDesktop = () => {
    if (isDesktop && showErr) {
      return (
        <Box aria-label="toastMessage" mb="10">
          <Toast
            title={t("updateProposal.errors.apiError.title")}
            description={t("updateProposal.errors.apiError.description")}
            onClick={() => {
              setShowErr(false)
            }}
          />
        </Box>
      )
    }
  }

  async function submitHandler(values: InvestorProfileGoals) {
    try {
      setShowErr(false)
      event(UpdateProposalEvent)
      let updatedInvestmentGoalsObj = { ...values }
      if (updatedInvestmentGoalsObj.shouldGenerateIncome === "no") {
        updatedInvestmentGoalsObj.desiredAnnualIncome = undefined
      } else {
        updatedInvestmentGoalsObj.desiredAnnualIncome =
          calculateDesiredAmountIncome(
            updatedInvestmentGoalsObj?.desiredAnnualIncome || 1.5,
            updatedInvestmentGoalsObj,
          )
      }

      if (updatedInvestmentGoalsObj.topUpInvestmentAnnually === "no") {
        updatedInvestmentGoalsObj.annualInvestmentTopUpAmountInUSD = undefined
      } else {
        updatedInvestmentGoalsObj.annualInvestmentTopUpAmountInUSD =
          parseInt(
            (updatedInvestmentGoalsObj?.annualInvestmentTopUpAmountInUSD || "")
              .toString()
              .replace(/\D/g, ""),
          ) || 0
      }

      updatedInvestmentGoalsObj.investmentAmountInUSD =
        parseInt(
          (updatedInvestmentGoalsObj?.investmentAmountInUSD || "")
            .toString()
            .replace(/\D/g, ""),
        ) || 0

      const reformedInvestmentGoals = await ky
        .put(
          router.query.contactId
            ? `/api/user/proposals/contact?id=${router.query.contactId}`
            : "/api/user/proposals/updateProposal",
          {
            json: updatedInvestmentGoalsObj,
          },
        )
        .json<InvestorProfileGoals>()

      await mutate<InvestorProfileGoals>(
        "/api/user/investment-goals",
        reformedInvestmentGoals,
      )

      mutate("/api/user/summary")
      mutate("/api/user/proposals")
      mutate("/api/user/preference")

      onClose()
    } catch (e) {
      setShowErr(true)
    }
  }

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      size={isMobileView ? "full" : "xl"}
      isCentered={false}
      autoFocus={false}
      returnFocusOnClose={false}
    >
      <ModalOverlay />

      <ModalContent
        maxW={{ base: "md", md: "80%" }}
        sx={{
          bgColor: "gray.800",
        }}
      >
        <ModalBody aria-label="editProposalModal" pb={6}>
          <Formik<
            Pick<
              InvestorProfileGoals,
              | "whoIsPortfolioFor"
              | "shouldGenerateIncome"
              | "investmentDurationInYears"
              | "investmentAmountInUSD"
              | "topUpInvestmentAnnually"
              | "annualInvestmentTopUpAmountInUSD"
              | "investmentGoals"
              | "additionalPreferences"
              | "desiredAnnualIncome"
            >
          >
            enableReinitialize
            initialValues={{
              whoIsPortfolioFor:
                investmentGoals?.whoIsPortfolioFor || undefined,

              investmentGoals: investmentGoals?.investmentGoals || [],
              shouldGenerateIncome:
                investmentGoals?.shouldGenerateIncome || undefined,
              investmentDurationInYears:
                investmentGoals?.investmentDurationInYears || 7,
              investmentAmountInUSD: formatCurrencyWithCommas(
                investmentGoals?.investmentAmountInUSD?.toString() || "",
              ),
              topUpInvestmentAnnually:
                investmentGoals?.topUpInvestmentAnnually || undefined,
              annualInvestmentTopUpAmountInUSD: formatCurrencyWithCommas(
                investmentGoals?.annualInvestmentTopUpAmountInUSD?.toString() ||
                  "",
              ),

              additionalPreferences:
                investmentGoals?.additionalPreferences || [],
              desiredAnnualIncome:
                (investmentGoals &&
                  investmentGoals?.desiredAnnualIncome &&
                  Math.round(
                    ((investmentGoals?.desiredAnnualIncome * 100) /
                      Number(investmentGoals?.investmentAmountInUSD)) *
                      2,
                  ) / 2) ||
                1.5,
            }}
            validationSchema={Yup.object({
              whoIsPortfolioFor: Yup.string()
                .oneOf(Object.values(PortfolioOwner))
                .required(t("common:errors.required")),
              investmentGoals: Yup.array()
                .of(Yup.string().oneOf(Object.keys(InvestmentGoal)))
                .min(1, t("common:errors.required")),
              investmentDurationInYears: Yup.number().min(1).max(25).required(),
              additionalPreferences: Yup.array()
                .of(Yup.string().oneOf(Object.values(AdditionalPreference)))
                .min(1, t("common:errors.required"))
                .required(t("common:errors.required")),
              investmentAmountInUSD: Yup.string()
                .test(
                  "min",
                  t("updateProposal.errors.minDescription"),
                  (value) => {
                    let x = value
                      ? parseInt(value.toString().replace(/\D/g, ""))
                      : 0
                    return x >= 300000
                  },
                )
                .test(
                  "max",
                  t("updateProposal.errors.maxDescription"),
                  (value) => {
                    let x = value
                      ? parseInt(value.toString().replace(/\D/g, ""))
                      : 0
                    return x <= 25000000
                  },
                ),

              topUpInvestmentAnnually: Yup.mixed<YesOrNo>().required(
                t("common:errors.required"),
              ),
              annualInvestmentTopUpAmountInUSD: Yup.string().when(
                "topUpInvestmentAnnually",
                {
                  is: "yes",
                  then: Yup.string()
                    .test("min", t("common:errors.required"), (value) => {
                      let x = value
                        ? parseInt(value.toString().replace(/\D/g, ""))
                        : 0
                      return x >= 1
                    })
                    .test(
                      "max",
                      t("updateProposal.errors.maxDescription"),
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
              shouldGenerateIncome: Yup.mixed<YesOrNo>()
                .oneOf(["yes", "no"])
                .required(t("common:errors.required")),
              desiredAnnualIncome: Yup.number().when("shouldGenerateIncome", {
                is: "yes",
                then: Yup.number().required(t("common:errors.required")),
                otherwise: undefined,
              }),
            })}
            onSubmit={submitHandler}
          >
            {(formikProps) => {
              return (
                <Form style={{ width: "100%" }}>
                  {checklogoDisplay()}
                  <ModalCloseButton />

                  {showErrDesktop()}

                  <HStack
                    flexDirection="row"
                    justifyContent={{
                      base: "center",
                      md: "center",
                      lg: "space-between",
                    }}
                    w="full"
                    mb={{ base: 4, md: 9 }}
                  >
                    <Text
                      fontSize="md"
                      {...(isMobileView && {
                        mt: "8",
                      })}
                      fontWeight="extrabold"
                      color="contrast.200"
                    >
                      {t("updateProposal.heading")}
                    </Text>
                    {isDesktop && !isTabletView && (
                      <HStack spacing="12">
                        <Button
                          colorScheme="primary"
                          variant="ghost"
                          onClick={() => formikProps.resetForm()}
                        >
                          {t("updateProposal.links.resetChanges")}
                        </Button>
                        <Button
                          variant="solid"
                          colorScheme="primary"
                          role="button"
                          type="submit"
                          isLoading={formikProps?.isSubmitting}
                        >
                          {t("updateProposal.buttons.updateProposal")}
                        </Button>
                      </HStack>
                    )}
                  </HStack>

                  <Divider mb="10"></Divider>
                  {(isMobileView || isTabletView) && showErr && (
                    <Box aria-label="toastMessage" mb="10">
                      <Toast
                        title={t("updateProposal.errors.apiError.title")}
                        description={t(
                          "updateProposal.errors.apiError.description",
                        )}
                        onClick={() => {
                          setShowErr(false)
                        }}
                      />
                    </Box>
                  )}
                  <Stack
                    w={{ base: "full", md: "full", lg: "full" }}
                    direction={{ base: "column", md: "column", lg: "row" }}
                    spacing={{ base: 6, md: 12, lg: 6 }}
                    px={{ base: 0, md: 0, lg: "70px" }}
                    mb="8"
                  >
                    <Stack
                      direction={{ base: "column", md: "column", lg: "column" }}
                      spacing="6"
                      w="full"
                    >
                      <SelectControl
                        name="whoIsPortfolioFor"
                        maxW={{ base: "md", md: "full", lg: "full" }}
                        selectProps={{
                          options: portfolioOwnerList,
                        }}
                        color="contrast.200"
                        label={t("updateProposal.labels.forWhome")}
                        zIndex="modal"
                        fireEvent={true}
                      />
                      <SelectControl
                        name="investmentGoals"
                        maxW={{ base: "md", md: "full", lg: "full" }}
                        selectProps={{
                          options: allGoals,
                          isMulti: true,
                        }}
                        label={t("updateProposal.labels.goal")}
                        zIndex="overlay"
                        fireEvent={true}
                      />

                      <SliderControl
                        aria-label="Time horizon slider"
                        name="investmentDurationInYears"
                        fireEvent={true}
                        label={(value) => (
                          <Flex justifyContent="space-between">
                            <FormLabel fontSize="sm" color="gray.400">
                              {t("updateProposal.labels.timeHorizon")}
                            </FormLabel>
                            <Text fontSize="sm" color="white">
                              {value} {formatYearName(value, lang)}
                            </Text>
                          </Flex>
                        )}
                        sliderProps={{
                          colorScheme: "primary",
                          min: 1,
                          max: 25,
                          step: 1,
                        }}
                      />

                      <SelectControl
                        name="additionalPreferences"
                        fireEvent={true}
                        maxW={{ base: "full", md: "full", lg: "full" }}
                        selectProps={{
                          options: allAdditionalPreferences,
                          isMulti: true,
                          onChange: (values) => {
                            let filteredArr = values?.filter(
                              (val) => val.label === "None",
                            )
                            if (filteredArr.length === 1) {
                              formikProps.setFieldValue(
                                "additionalPreferences",
                                ["None"],
                              )
                            } else {
                              filteredArr = values?.filter(
                                (val) => val.label !== "None",
                              )
                              const newArr = filteredArr.map((val) => val.value)
                              formikProps.setFieldValue(
                                "additionalPreferences",
                                newArr,
                              )
                            }
                          },
                        }}
                        label={t("updateProposal.labels.preferences")}
                      />

                      <VStack aria-label="riskLevel">
                        <Text alignSelf="flex-start">
                          {t("updateProposal.labels.riskLevel")}
                        </Text>
                        <HStack
                          justifyContent="space-between"
                          w="full"
                          border="1px solid"
                          borderColor="gray.600"
                          p="3"
                        >
                          <Text
                            fontSize="sm"
                            textAlign="start"
                            color="contrast.200"
                          >
                            {t(
                              `updateProposal.status.${riskScoreResult?.data?.scoreDescriptionId}.title`,
                            )}
                          </Text>
                          {router.query.contactId ? (
                            <Text
                              fontSize="sm"
                              textAlign="start"
                              color="gray.400"
                            >
                              {t("updateProposal.labels.riskAssessment")}
                            </Text>
                          ) : (
                            <Link
                              color="primary.500"
                              href="personalized-proposal/start-risk-assessment"
                              textAlign="end"
                              onClick={() => {
                                event(RetakeassessmentEvent)
                              }}
                            >
                              {" "}
                              {t("updateProposal.labels.riskAssessment")}
                            </Link>
                          )}
                        </HStack>
                      </VStack>
                    </Stack>
                    <Stack
                      direction={{ base: "column", md: "column", lg: "column" }}
                      spacing="6"
                      w="full"
                    >
                      <InputControl
                        name="investmentAmountInUSD"
                        inputLeftElement="$"
                        inputLeftElementColor="white"
                        label={t("updateProposal.labels.investmentAmount")}
                        inputProps={{
                          type: "string",
                          placeholder: t(
                            "updateProposal.placeholders.investmentAmount",
                          ),
                          onChange: (
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            event(changeInvestmentAmount)
                            formikProps.setFieldValue(
                              "investmentAmountInUSD",
                              e.target.value
                                ? formatCurrencyWithCommas(e.target.value)
                                : "",
                            )
                          },
                          color: "contrast.200",
                        }}
                      />

                      <SelectControl
                        name="topUpInvestmentAnnually"
                        fireEvent={true}
                        maxW={{ base: "full", md: "full", lg: "full" }}
                        selectProps={{
                          placeholder: "Select",
                          options: annualTopUpsLabels,
                        }}
                        color="contrast.200"
                        tooltip={t(
                          "updateProposal.tooltips.topUpInvestmentAnnually",
                        )}
                        label={t("updateProposal.labels.annualTopupAmount")}
                        toolTipColor="gray.750"
                        widthToolTip="13px"
                        heightToolTip="13px"
                        zIndex="modal"
                      />
                      {formikProps.values?.topUpInvestmentAnnually ===
                        "yes" && (
                        <InputControl
                          name="annualInvestmentTopUpAmountInUSD"
                          inputLeftElement="$"
                          inputLeftElementColor="white"
                          label={t("updateProposal.labels.annualTopUpAmt")}
                          inputProps={{
                            type: "string",
                            placeholder: t(
                              "updateProposal.placeholders.annualTopUp",
                            ),
                            onChange: (
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              event(changeAnnualIncrease)
                              formikProps.setFieldValue(
                                "annualInvestmentTopUpAmountInUSD",
                                e.target.value
                                  ? formatCurrencyWithCommas(e.target.value)
                                  : "",
                              )
                            },
                            color: "contrast.200",
                          }}
                        />
                      )}

                      <SelectControl
                        name="shouldGenerateIncome"
                        fireEvent={true}
                        maxW={{ base: "full", md: "full", lg: "full" }}
                        selectProps={{
                          placeholder: "Select",
                          options: incomeGeneratingLabels,
                        }}
                        tooltip={t(
                          "updateProposal.tooltips.shouldGenerateIncome",
                        )}
                        label={t("updateProposal.labels.incomeGenerating")}
                        widthToolTip="13px"
                        heightToolTip="13px"
                        toolTipColor="gray.750"
                        zIndex="overlay"
                        color="contrast.200"
                      />
                      {formikProps?.values?.shouldGenerateIncome === "yes" && (
                        <Flex direction="column">
                          <SliderControl
                            name="desiredAnnualIncome"
                            fireEvent={true}
                            label={(value: number | undefined) => (
                              <Flex justifyContent="space-between">
                                <FormLabel fontSize="sm" color="gray.400">
                                  {t(
                                    "updateProposal.labels.desiredAnnualIncome",
                                  )}{" "}
                                  <Tooltip
                                    hasArrow
                                    label={t(
                                      "updateProposal.tooltips.desiredAnnualIncome",
                                    )}
                                    placement="bottom"
                                    textAlign="center"
                                  >
                                    <chakra.span>
                                      <InfoIcon
                                        aria-label="Info icon"
                                        color="primary.500"
                                        cursor="pointer"
                                        h={13}
                                        w={13}
                                      />
                                    </chakra.span>
                                  </Tooltip>
                                </FormLabel>
                                <Text
                                  aria-label="desiredIncomePercentage"
                                  fontSize="sm"
                                  color="white"
                                >
                                  {value} %
                                </Text>
                              </Flex>
                            )}
                            sliderProps={{
                              colorScheme: "primary",
                              min: 0.5,
                              max: 6.5,
                              step: 0.5,
                              mt: "4",
                            }}
                          />
                          <Text
                            alignSelf={{ base: "self-end" }}
                            fontSize="xs"
                            color="gray.400"
                          >
                            {lang === "ar"
                              ? t("updateProposal.labels.correspondance") +
                                formatCurrencyWithCommas(
                                  Math.round(
                                    (formikProps.values?.desiredAnnualIncome! *
                                      Number(
                                        parseInt(
                                          (
                                            formikProps?.values
                                              ?.investmentAmountInUSD || ""
                                          )
                                            .toString()
                                            .replace(/\D/g, ""),
                                        ),
                                      )) /
                                      100,
                                  ).toString() || "",
                                ) +
                                t("common:generic.dollar")
                              : t("updateProposal.labels.correspondance") +
                                formatCurrency(
                                  Math.round(
                                    (formikProps.values?.desiredAnnualIncome! *
                                      Number(
                                        parseInt(
                                          (
                                            formikProps?.values
                                              ?.investmentAmountInUSD || ""
                                          )
                                            .toString()
                                            .replace(/\D/g, ""),
                                        ),
                                      )) /
                                      100,
                                  ).toString() || "",
                                )}
                          </Text>
                        </Flex>
                      )}
                    </Stack>
                  </Stack>
                  {(isMobileView || isTabletView) && (
                    <VStack spacing="6" mt="6">
                      <Button
                        variant="solid"
                        colorScheme="primary"
                        role="button"
                        type="submit"
                        w="full"
                        isLoading={formikProps?.isSubmitting}
                      >
                        {t("updateProposal.buttons.updateProposal")}
                      </Button>
                      <Button
                        colorScheme="primary"
                        variant="ghost"
                        onClick={() => formikProps.resetForm()}
                      >
                        {" "}
                        {t("updateProposal.links.resetChanges")}
                      </Button>
                    </VStack>
                  )}
                </Form>
              )
            }}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default UpdateProposal
