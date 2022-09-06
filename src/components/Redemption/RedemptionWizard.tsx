import {
  Box,
  Center,
  Container,
  Divider,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/layout"
import {
  Button,
  Flex,
  Progress,
  StyleProps,
  useBreakpointValue,
} from "@chakra-ui/react"
import { Form, Formik, FormikProps } from "formik"
import ky from "ky"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useRef, useState } from "react"
import { OptionTypeBase } from "react-select"
import useSWR from "swr"
import * as Yup from "yup"

import {
  Card,
  CardContent,
  Checkbox,
  ClientModalFooter,
  ClientModalHeader,
  ClientModalLayout,
  InputControl,
  OrderManagementTerms,
  SelectControl,
  SkeletonCard,
  Step,
  StepContent,
  StepInfoCard,
  StepLabel,
  Stepper,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import { RedemptionFundRoot } from "~/services/mytfo/types"
import { formatDate } from "~/utils/clientUtils/dateUtility"
import { absoluteConvertCurrencyWithDollar } from "~/utils/clientUtils/globalUtilities"
import { formatCurrencyWithCommas } from "~/utils/formatCurrency"
import {
  clickExitRedemptionPg1,
  confirmDealRedemption,
} from "~/utils/googleEventsClient"
import { clientUniEvent } from "~/utils/gtag"

import EmptyCart from "./EmptyCart"
import LiquidityConfirmation from "./LiquidityConfirmation"
import LiquidityHolding from "./LiquidityHolding"

type RedemptionSavedClientAppDb = {
  redemptionSavedClientAppDB: {
    id: number
    clientId: number
    assetName: string
    redemptionAmount: number
    remainingBalance: number
    reason: string
  }
}

type FormValues = {
  reason: string
  redeemAmount: string
  acceptTerms: boolean
  authorizedSignatory: boolean
}

function RedemptionWizard() {
  const { t, lang } = useTranslation("redemption")
  const router = useRouter()
  const { user } = useUser()

  const [mobileViewStep, setMobileViewStep] = useState(0)
  const [confirmation, setConfirmation] = useState(false)
  const isFullWidth = useBreakpointValue({ base: true, md: false })
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lgp: false,
  })
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [selectedFund, setSelectedFund] = useState(0)

  const [redeemAmount, setRedeemAmount] = useState(0)
  const [redeemReason, setRedeemReason] = useState("")
  const [IsviewTerms, setIsviewTerms] = useState(false)
  const [liquidityConfirmationDetails, setLiquidityConfirmationDetails] =
    useState<RedemptionSavedClientAppDb>()
  const [availableRedeemBalance, setAvailableRedeemBalance] = useState<number>()
  const [remainingBalance, setRemainingBalance] = React.useState<number>(0)
  const [emptyFunds, setEmptyFunds] = useState(true)

  const { data: funds, error } = useSWR<RedemptionFundRoot>(
    `/api/client/deals/get-redeem-funds`,
  )

  const isLoading = !funds && !error

  useEffect(() => {
    if (funds?.redemptionFunds) {
      if (!funds || funds?.redemptionFunds?.length == 0 || error) {
        setEmptyFunds(true)
      } else {
        setEmptyFunds(false)
      }
    } else {
      setEmptyFunds(true)
    }
  }, [funds, error, isLoading])

  const submitRef = useRef<FormikProps<FormValues>>(null)
  const maxRedemptionAmount = !emptyFunds
    ? Math.round(funds?.redemptionFunds[selectedFund].balance || 0)
    : 0
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (type: string, value: string | number) => {
    if (type == "redeemAmount") {
      let x = value ? Number(`${value}`.replace(/\,/g, "")) : 0
      x = Math.round(x)
      setRedeemAmount(x)
    } else if (type == "reason") {
      setRedeemReason(value as string)
    } else if (type == "avaialableBalanace") {
      setRemainingBalance(value as number)
    }
  }

  const ChapterHeaderStepper = (props?: StyleProps) => (
    <Stepper
      activeStep={
        mobileViewStep == 0
          ? 1
          : mobileViewStep == 1
          ? 2
          : mobileViewStep == 2
          ? 3
          : 4
      }
      orientation="horizontal"
      {...props}
    >
      <Step
        index={0}
        completed={mobileViewStep > 0 ? true : false}
        ms={{ base: 4, md: 0 }}
      >
        {mobileViewStep == 0 && (
          <StepContent>
            <StepLabel color="white" fontWeight="bold">
              {t("myLiquidHolding.header")}
            </StepLabel>
          </StepContent>
        )}
      </Step>
      <Step index={1} completed={mobileViewStep > 1 ? true : false}>
        {mobileViewStep == 1 && (
          <StepContent>
            <StepLabel color="white" fontWeight="bold">
              {t("redemptionDetails.header")}
            </StepLabel>
          </StepContent>
        )}
      </Step>
    </Stepper>
  )

  const submitRedeemAmount = async (amount: number, reason: string) => {
    setIsSubmitting(true)
    var response = await ky
      .post("/api/client/deals/get-redeem-details", {
        json: {
          fundName: funds?.redemptionFunds[selectedFund].fundName,
          redemptionAmount: amount,
          remainingAmount: remainingBalance,
          reason: reason,
        },
      })
      .json<RedemptionSavedClientAppDb>()
    setLiquidityConfirmationDetails(response)
    setAvailableRedeemBalance(funds?.redemptionFunds[selectedFund].balance)
    setConfirmation(true)
    setIsSubmitting(false)

    clientUniEvent(
      confirmDealRedemption,
      funds?.redemptionFunds[selectedFund].fundName + "-" + amount,
      user?.mandateId as string,
      user?.email as string,
    )
  }

  const submitForm = () => {
    const form = submitRef.current
    form?.handleSubmit()
  }

  const redeemReasons = [
    {
      value: "Redemption for capital call",
      label: t(
        "redemptionDetails.formSection.reasonOfRedemption.option.redemptionForCapitalCall",
      ),
    },
    {
      value: "Partial redemption for capital call",
      label: t(
        "redemptionDetails.formSection.reasonOfRedemption.option.partailRedemption",
      ),
    },
    {
      value: "Client requested redemption – personal withdrawal",
      label: t(
        "redemptionDetails.formSection.reasonOfRedemption.option.personalWithDrawal",
      ),
    },
    {
      value: "Client requested redemption – Zakat",
      label: t("redemptionDetails.formSection.reasonOfRedemption.option.zakat"),
    },
    {
      value: "Redemption – Management fee",
      label: t(
        "redemptionDetails.formSection.reasonOfRedemption.option.managementFee",
      ),
    },
  ]

  const RedemptionValidationSchema = funds?.redemptionFunds?.length
    ? Yup.object().shape({
        redeemAmount: Yup.string()
          .required(
            t(
              "redemptionDetails.formSection.redemptionAmount.errorMessages.enterRedemptionAmount",
            ),
          )
          .test(
            "max",
            `${t(
              "redemptionDetails.formSection.redemptionAmount.errorMessages.amountExceeds",
            )} ${
              lang.includes("en")
                ? `${
                    Math.round(funds?.redemptionFunds[selectedFund].balance) < 0
                      ? "-"
                      : ""
                  }$${formatCurrencyWithCommas(
                    !emptyFunds
                      ? `${Math.abs(
                          Math.round(
                            funds?.redemptionFunds[selectedFund].balance || 0,
                          ),
                        )}`
                      : "0",
                  )}`
                : `${formatCurrencyWithCommas(
                    !emptyFunds
                      ? `${Math.abs(
                          Math.round(
                            funds?.redemptionFunds[selectedFund].balance || 0,
                          ),
                        )}`
                      : "0",
                  )}${
                    Math.round(funds?.redemptionFunds[selectedFund].balance) < 0
                      ? "-"
                      : ""
                  } ${t(`common:client.USD`)} `
            }`,
            (value) => {
              let x = value ? parseInt(value.replace(/\D/g, "")) : 0
              return x <= maxRedemptionAmount
            },
          ),
        reason: Yup.string().required(
          t(
            "redemptionDetails.formSection.reasonOfRedemption.errorMessages.selectReason",
          ),
        ),
        acceptTerms: Yup.boolean().oneOf(
          [true],
          t("common:client.agreeTerms.error"),
        ),
        authorizedSignatory: Yup.boolean().oneOf(
          [true],
          t("common:client.authSignatory.error"),
        ),
      })
    : false

  const viewTerms = () => {
    setIsviewTerms(true)
  }

  useEffect(() => {
    const wizzScrollMainElmnt = document.getElementById("wizzScrollMainCont")
    const element: HTMLElement = wizzScrollMainElmnt!
    element.scrollTo({
      top: 0,
    })
  }, [mobileViewStep, confirmation])

  return (
    <ClientModalLayout
      containerRef={containerRef}
      title={t("page.title")}
      description={t("page.description")}
      header={
        <ClientModalHeader
          boxShadow="0 0 0 4px var(--chakra-colors-gray-900)"
          {...(isDesktopView && {
            headerLeft: (
              <Stack isInline ps="6" spacing="6" alignItems="center">
                <Divider orientation="vertical" bgColor="white" height="28px" />
                {!confirmation && !emptyFunds && <ChapterHeaderStepper />}
              </Stack>
            ),
          })}
          headerRight={
            <>
              <Button
                variant="ghost"
                colorScheme="primary"
                onClick={() => {
                  router.push("/client/opportunities")
                  clientUniEvent(
                    clickExitRedemptionPg1,
                    "true",
                    user?.mandateId as string,
                    user?.email as string,
                  )
                }}
              >
                {t("common:button.exit")}
              </Button>
            </>
          }
          subheader={
            !confirmation && (
              <>
                {isMobileView && (
                  <Box h="10" px="1" py="2">
                    {<ChapterHeaderStepper />}
                  </Box>
                )}
                {!emptyFunds && (
                  <Progress
                    colorScheme="primary"
                    size="xs"
                    bgColor="gray.700"
                    value={mobileViewStep == 0 ? 50 : 100}
                  />
                )}
              </>
            )
          }
        />
      }
      footer={
        !confirmation &&
        !emptyFunds && (
          <ClientModalFooter
            {...(isMobileView && {
              position: "fixed",
              bottom: "0",
              flexDirection: "column",
            })}
            showClientCallAction={true}
          >
            <Stack
              isInline
              spacing={{ base: 4, md: 8 }}
              px={{ base: 0, md: 3 }}
              flex="1"
              justifyContent="flex-end"
              width={isMobileView ? "full" : "auto"}
            >
              {mobileViewStep == 0 && !confirmation && (
                <Button
                  px={8}
                  colorScheme="primary"
                  variant="solid"
                  onClick={() => {
                    setMobileViewStep(1)
                  }}
                  width={isMobileView ? "full" : "auto"}
                >
                  {t("common:client.orderManagementCTAs.nextButtonText")}
                </Button>
              )}
              {mobileViewStep == 1 && !confirmation && (
                <>
                  {!isMobileView && (
                    <Button
                      px={8}
                      colorScheme="primary"
                      variant="outline"
                      onClick={() => {
                        setMobileViewStep(0)
                      }}
                      width={isMobileView ? "full" : "auto"}
                    >
                      {t("common:button.back")}
                    </Button>
                  )}
                  <Button
                    px={8}
                    colorScheme="primary"
                    variant="solid"
                    type="submit"
                    isLoading={isSubmitting}
                    onClick={() => {
                      submitForm()
                    }}
                    width={isMobileView ? "full" : "auto"}
                  >
                    {t(
                      "common:client.orderManagementCTAs.redeemAmountButtonText",
                    )}
                  </Button>
                </>
              )}
            </Stack>
          </ClientModalFooter>
        )
      }
    >
      {isLoading ? (
        <SkeletonCard flex="1" mb="25px" mt="20px" />
      ) : (
        <Container maxW="5xl" {...(isMobileView && { px: "0" })}>
          {mobileViewStep == 0 &&
          !confirmation &&
          funds &&
          !emptyFunds &&
          selectedFund >= 0 ? (
            <LiquidityHolding
              fundData={funds?.redemptionFunds}
              updateFund={setSelectedFund}
              selectedFund={selectedFund}
            />
          ) : (
            false
          )}
          {IsviewTerms ? (
            <OrderManagementTerms
              show={IsviewTerms}
              close={() => setIsviewTerms(false)}
            />
          ) : (
            false
          )}
          {mobileViewStep == 1 && !confirmation && funds && !emptyFunds && (
            <Flex
              py={{ base: 2, md: 16 }}
              direction={{ base: "column", md: "column", lgp: "row" }}
            >
              <Container
                flex="1"
                maxW={{ base: "full", md: "full", lgp: "292px" }}
                px="0"
              >
                <Heading
                  mb={{ base: "24px", md: 4, lgp: 6 }}
                  fontSize={{ base: "24px", md: "30px", lgp: "30px" }}
                >
                  {t("redemptionDetails.title")}
                </Heading>
                <Text
                  fontSize="16px"
                  color="gray.500"
                  fontWeight="400"
                  mb={{ lgp: "32px", md: "32px", base: "24px" }}
                >
                  {t("redemptionDetails.description")}
                </Text>
                <StepInfoCard
                  heading={t("aboutLiquids.title")}
                  description={t("aboutLiquids.description", {
                    date: formatDate(
                      funds?.redemptionFunds[selectedFund].date,
                      lang,
                    ),
                  })}
                />
              </Container>

              <Center
                px={{ base: 0, md: "0px", lgp: "64px" }}
                py={{ base: "24px", md: "48px", lgp: "0" }}
              >
                <Divider
                  orientation={isFullWidth ? "horizontal" : "vertical"}
                />
              </Center>

              <Container
                flex={isTabletView ? "2" : "1"}
                px="0"
                {...(isMobileView && { mb: "36" })}
                // h="100vh"
                maxW="100%"
              >
                <Formik
                  initialValues={{
                    reason: "",
                    redeemAmount: "",
                    acceptTerms: false,
                    authorizedSignatory: false,
                  }}
                  validationSchema={RedemptionValidationSchema}
                  onSubmit={() => {
                    submitRedeemAmount(redeemAmount, redeemReason)
                  }}
                  innerRef={submitRef}
                >
                  {(formikProps) => (
                    <Form style={{ width: "100%", marginBottom: "60px" }}>
                      <VStack
                        spacing={["6", "8"]}
                        alignItems="start"
                        maxW={{ lgp: "md", base: "full", md: "md" }}
                      >
                        <Box>
                          <Text fontSize="22px" fontWeight="400" color="white">
                            {funds?.redemptionFunds[selectedFund].fundName}
                          </Text>
                        </Box>
                        <InputControl
                          color="gray.500"
                          name="redeemAmount"
                          label={t(
                            "redemptionDetails.formSection.redemptionAmount.label",
                          )}
                          inputProps={{
                            type: "tel",
                            placeholder: t(
                              "redemptionDetails.formSection.redemptionAmount.placeholder",
                            ),
                            onChange: (
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              formikProps.setFieldValue(
                                "redeemAmount",
                                formatCurrencyWithCommas(e.target.value),
                              )

                              handleChange("redeemAmount", e.target.value)
                              handleChange(
                                "avaialableBalanace",
                                funds?.redemptionFunds[selectedFund].balance -
                                  parseInt(e.target.value.replace(/\D/g, "")),
                              )
                            },
                            "aria-label": "redeemAmount",
                          }}
                          inputLeftElement={"$"}
                        />

                        <Box w="100%" mt="10px!important">
                          <Text
                            aria-label="Redeem all"
                            role={"button"}
                            cursor="pointer"
                            fontSize="14px"
                            fontWeight={{ base: "700", lgp: "400" }}
                            textDecoration="underline"
                            color="primary.500"
                            textAlign="right"
                            onClick={() => {
                              if (
                                funds?.redemptionFunds[selectedFund].balance > 0
                              ) {
                                formikProps.setFieldValue(
                                  "redeemAmount",
                                  formatCurrencyWithCommas(
                                    `${Math.round(
                                      funds?.redemptionFunds[selectedFund]
                                        .balance,
                                    )}`,
                                  ),
                                )
                                handleChange(
                                  "redeemAmount",
                                  funds?.redemptionFunds[selectedFund].balance,
                                )
                                handleChange("avaialableBalanace", 0)
                              } else {
                                // formikProps.setFieldValue("redeemAmount", 0)
                                handleChange("redeemAmount", 0)
                                handleChange("avaialableBalanace", 0)
                              }
                            }}
                          >
                            {t("redemptionDetails.redeemAll")}
                          </Text>
                        </Box>
                        <Box w="full">
                          <SelectControl
                            name="reason"
                            label={t(
                              "redemptionDetails.formSection.reasonOfRedemption.label",
                            )}
                            selectProps={{
                              placeholder: t(
                                "redemptionDetails.formSection.reasonOfRedemption.placeholder",
                              ),
                              options: redeemReasons,
                              onChange: (e: OptionTypeBase) => {
                                formikProps.setFieldValue("reason", e?.value)
                                handleChange("reason", e.value)
                              },
                              isSearchable: false,
                            }}
                          />
                        </Box>
                      </VStack>

                      <Card
                        bg="gunmetal.500"
                        padding="8px"
                        mt="5"
                        maxW={{ lgp: "md", sm: "100%", base: "100%", md: "md" }}
                      >
                        <CardContent p="4">
                          <Box display="flex" alignItems="center">
                            <Text
                              fontSize="14px"
                              fontWeight="700"
                              color="gray.400"
                              mr="2"
                            >
                              {t("labels.availableBalance")}{" "}
                              <Text
                                d={{ md: "none", lgp: "none", base: "block" }}
                                fontSize="12px"
                                fontWeight="400"
                                color="gray.400"
                                pt="5px"
                              >
                                (
                                {formatDate(
                                  funds?.redemptionFunds[selectedFund].date,
                                  lang,
                                )}
                                )
                              </Text>
                            </Text>{" "}
                            <Text
                              d={{ md: "block", lgp: "block", base: "none" }}
                              fontSize="12px"
                              fontWeight="400"
                              color="gray.400"
                            >
                              (
                              {formatDate(
                                funds?.redemptionFunds[selectedFund].date,
                                lang,
                              )}
                              )
                            </Text>
                            <Text
                              aria-label="Available Balance"
                              role={"gridcell"}
                              fontSize="18px"
                              fontWeight="400"
                              color="white"
                              lineHeight="24px"
                              flex="1 1"
                              justifyContent="flex-end"
                              textAlign="right"
                            >
                              {absoluteConvertCurrencyWithDollar(
                                funds?.redemptionFunds[selectedFund].balance,
                              )}
                            </Text>
                          </Box>
                          <Box
                            justifyContent="space-between"
                            alignItems="center"
                            display="flex"
                            mt={{ lgp: "21px", base: "18px" }}
                          >
                            <Text
                              fontSize="14px"
                              fontWeight="700"
                              color="gray.400"
                            >
                              {t("labels.redemptionAmount")}
                            </Text>

                            {parseInt(
                              formikProps.values.redeemAmount.replace(
                                /\D/g,
                                "",
                              ),
                            ) <=
                            Math.round(
                              funds?.redemptionFunds[selectedFund].balance,
                            ) ? (
                              <Text
                                aria-label="Redemption amount"
                                role={"gridcell"}
                                fontSize="18px"
                                fontWeight="400"
                                color="white"
                                lineHeight="24px"
                                style={{
                                  direction: lang.includes("ar")
                                    ? "initial"
                                    : "ltr",
                                }}
                              >
                                -${formikProps.values.redeemAmount}
                              </Text>
                            ) : (
                              <Text
                                aria-label="Redemption amount"
                                role={"gridcell"}
                                fontSize="18px"
                                fontWeight="400"
                                color="white"
                                lineHeight="24px"
                              >
                                $0{" "}
                              </Text>
                            )}
                          </Box>
                          <Center px="15px" py="15px" pr="0px" pl="0px">
                            <Divider orientation="horizontal" />
                          </Center>
                          <Box
                            justifyContent="space-between"
                            alignItems="center"
                            display="flex"
                          >
                            <Text
                              fontSize="14px"
                              fontWeight="700"
                              color="primary.500"
                            >
                              {t("labels.remainingBalance")}
                            </Text>
                            <Text
                              aria-label="Remaining balance"
                              role={"gridcell"}
                              fontSize="18px"
                              fontWeight="400"
                              color="white"
                              lineHeight="24px"
                              dir="ltr"
                            >
                              {parseInt(
                                formikProps.values.redeemAmount.replace(
                                  /\D/g,
                                  "",
                                ),
                              ) <=
                              Math.round(
                                funds?.redemptionFunds[selectedFund].balance,
                              )
                                ? absoluteConvertCurrencyWithDollar(
                                    remainingBalance || 0,
                                  )
                                : absoluteConvertCurrencyWithDollar(
                                    funds?.redemptionFunds[selectedFund]
                                      .balance || 0,
                                  )}
                            </Text>
                          </Box>
                        </CardContent>
                      </Card>

                      <Box
                        aria-label="authorizedSignatory"
                        role={"checkbox"}
                        justifyContent="flex-start"
                        display="flex"
                        mt="5"
                        alignItems="center"
                        maxW="md"
                      >
                        <Checkbox
                          mr="2"
                          color="gray.400"
                          fontWeight="400"
                          fontSize="14px"
                          name="authorizedSignatory"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            formikProps.setFieldValue(
                              "authorizedSignatory",
                              e.target.checked,
                            )
                          }}
                        />
                        <Text color="gray.400" ml="4px" fontSize="14px">
                          {t("common:client.authSignatory.title")}
                        </Text>
                      </Box>
                      {formikProps.errors.authorizedSignatory &&
                      formikProps.touched.authorizedSignatory ? (
                        <Box
                          alignItems="center"
                          color="var(--chakra-colors-red-500)"
                          marginTop="var(--chakra-space-2)"
                          marginBottom="var(--chakra-space-2)"
                          fontSize="var(--chakra-fontSizes-xs)"
                          textAlign="start"
                          ml={{ base: "40px", lgp: "42px", md: "40px" }}
                        >
                          {formikProps.errors.authorizedSignatory}
                        </Box>
                      ) : null}
                      <Box
                        aria-label="acceptTerms"
                        role={"checkbox"}
                        justifyContent="flex-start"
                        display="flex"
                        mt="16px"
                        alignItems="center"
                        maxW="md"
                      >
                        <Checkbox
                          mr="2"
                          color="gray.400"
                          fontWeight="400"
                          fontSize="14px"
                          name="acceptTerms"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            formikProps.setFieldValue(
                              "acceptTerms",
                              e.target.checked,
                            )
                          }}
                        />

                        <Box ml="4px">
                          <Text
                            color="gray.400"
                            as="span"
                            fontSize="14px"
                            me="2"
                          >
                            {t("common:client.agreeTerms.title")}
                          </Text>
                          <Text
                            aria-label="terms and conditions"
                            role={"button"}
                            textDecoration="underline"
                            as="span"
                            color="primary.500"
                            fontSize="14px"
                            onClick={() => {
                              viewTerms()
                            }}
                            cursor="pointer"
                          >
                            {t("common:client.agreeTerms.termsandConditions")}
                          </Text>
                        </Box>
                      </Box>
                      {formikProps.errors.acceptTerms &&
                      formikProps.touched.acceptTerms ? (
                        <Box
                          alignItems="center"
                          color="var(--chakra-colors-red-500)"
                          marginTop="var(--chakra-space-2)"
                          marginBottom="var(--chakra-space-2)"
                          fontSize="var(--chakra-fontSizes-xs)"
                          textAlign="start"
                          ml={{ base: "40px", lgp: "42px", md: "40px" }}
                        >
                          {formikProps.errors.acceptTerms}
                        </Box>
                      ) : null}
                    </Form>
                  )}
                </Formik>
              </Container>
            </Flex>
          )}

          {confirmation && funds?.redemptionFunds[selectedFund] && (
            <LiquidityConfirmation
              LiquidityConfirmationData={
                liquidityConfirmationDetails as RedemptionSavedClientAppDb
              }
              amount={availableRedeemBalance as number}
              fundData={funds?.redemptionFunds[selectedFund]}
            />
          )}
          {emptyFunds && (
            <p>
              <EmptyCart />
            </p>
          )}
        </Container>
      )}
    </ClientModalLayout>
  )
}

export default React.memo(RedemptionWizard)
