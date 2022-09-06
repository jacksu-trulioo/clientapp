import {
  Box,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  Spacer,
  Text,
} from "@chakra-ui/layout"
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  RadioGroup,
  Stack,
  Tag,
  useBreakpointValue,
} from "@chakra-ui/react"
import { Form, Formik } from "formik"
import ky from "ky"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useRef, useState } from "react"
import useSWR, { mutate } from "swr"

import {
  Card,
  CardContent,
  ClientInputControl,
  InfoIcon,
  IslamIcon,
  ModalBox,
  Radio,
} from "~/components"
import {
  InputState,
  InvestmentCartDealDetails,
} from "~/services/mytfo/clientTypes"
import { PopupDetailRoot } from "~/services/mytfo/types"
import { absoluteConvertCurrencyWithDollar } from "~/utils/clientUtils/globalUtilities"
import { formatCurrencyWithCommas } from "~/utils/formatCurrency"

import Checkbox from "../Checkbox"

type SubscriptionDetailsProps = {
  programs: InvestmentCartDealDetails[]
  deals: InvestmentCartDealDetails[]
  onChangeHandler: Function
  onBlurHandler: Function
  prefundAndConcentrationChangeHandler: Function
  dealsSum?: number
}

export default function SubscriptionDetails({
  programs,
  deals,
  onChangeHandler,
  onBlurHandler,
  prefundAndConcentrationChangeHandler,
  dealsSum,
}: SubscriptionDetailsProps) {
  const { t, lang } = useTranslation("subscription")
  const isFullWidth = useBreakpointValue({ base: true, md: false })
  const [isOpen, setIsOpen] = useState(false)
  const [consValuePer, setConsValuePer] = useState("0")
  const activePointRef = useRef(consValuePer)
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lgp: false,
  })

  const isMobileView = useBreakpointValue({ base: true, md: false })

  const { data: popUps } = useSWR<PopupDetailRoot>(
    `/api/client/deals/popup-details`,
  )

  const subscriptionConcentration = [
    {
      key: "20",
      label: t("subscriptionDetails.numberosDeals.fiveDeals"),
    },
    {
      key: "10",
      label: t("subscriptionDetails.numberosDeals.tenDeals"),
    },
    {
      key: "5",
      label: t("subscriptionDetails.numberosDeals.twentyDeals"),
    },
  ]
  const callModalBox = (key: string) => {
    activePointRef.current = key
    setConsValuePer(key)
    setIsOpen(true)
  }
  const handleError = (
    inputState: InputState,
    minimumAmount: number,
    maximumAmount: number,
  ) => {
    switch (inputState) {
      case "error_maximum_amount":
        return (
          <Text
            aria-label="maximum deal"
            role={"alert"}
            fontSize="14px"
            color="red.500"
            fontWeight="400"
            style={{
              textAlign: lang.includes("ar") ? "revert" : "right",
            }}
          >
            {`${t(
              "subscriptionDetails.formSection.subscriptionAmount.errorMessages.maxDeal",
            )} ${
              lang.includes("en")
                ? `$${formatCurrencyWithCommas(`${maximumAmount}` || "")}`
                : `${formatCurrencyWithCommas(`${maximumAmount}` || "")} ${t(
                    "common:client.USD",
                  )}`
            }`}
          </Text>
        )
      case "error_minimum_amount":
        return (
          <Text
            aria-label="minimum deal"
            role={"alert"}
            fontSize="14px"
            color="red.500"
            fontWeight="400"
            style={{
              textAlign: lang.includes("ar") ? "revert" : "right",
            }}
          >
            {`${t(
              "subscriptionDetails.formSection.subscriptionAmount.errorMessages.minDeal",
            )} ${
              lang.includes("en")
                ? `$${formatCurrencyWithCommas(`${minimumAmount}` || "")}`
                : `${formatCurrencyWithCommas(`${minimumAmount}` || "")} ${t(
                    "common:client.USD",
                  )}`
            }`}
          </Text>
        )
      case "untouched":
        return (
          <Text
            aria-label="enter amount"
            role={"alert"}
            fontSize="14px"
            color="red.500"
            fontWeight="400"
            style={{
              textAlign: lang.includes("ar") ? "revert" : "right",
            }}
          >
            {t(
              "subscriptionDetails.formSection.subscriptionAmount.errorMessages.enterAmount",
            )}
          </Text>
        )
      default:
        break
    }
  }

  const updatePopUpFlag = async (popUpName: string, flag: boolean) => {
    try {
      var popUpData = popUps?.popupDetails.find(({ popupName }) => {
        return popupName == popUpName
      })
      if (!popUpData?.flag) {
        await ky.post("/api/client/deals/popup-details", {
          json: {
            updatePopupDetailsList: [
              {
                popupId: popUpData?.popupId,
                flag,
                popupName: popUpName,
              },
            ],
          },
        })
        await mutate(`/api/client/deals/popup-details`)
      }
    } catch (error) {}
  }

  const onEnter = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e?.key == "Enter") {
      let element = e.target as HTMLElement
      element.blur()
    }
  }

  return (
    <>
      <Flex py={{ base: 2, md: 16 }} direction={{ base: "column", md: "row" }}>
        <Container flex="1" maxW={{ base: "full", md: "300px" }} px="0">
          <Heading
            mb={{ base: 4, md: 6 }}
            fontSize={{ base: "2xl", md: "30px", lgp: "30px" }}
          >
            {t("subscriptionDetails.heading")}
          </Heading>
          <Text color="gray.500" fontSize="16px">
            {" "}
            {deals.length && programs.length
              ? t("subscriptionDetails.description.dealAndProgram")
              : deals.length
              ? t("subscriptionDetails.description.deal")
              : t("subscriptionDetails.description.program")}
          </Text>
        </Container>

        <Center px={{ base: 0, md: "64px" }} py={{ base: "32px", md: 0 }}>
          <Divider orientation={isFullWidth ? "horizontal" : "vertical"} />
        </Center>

        <Container
          flex={isTabletView ? "2" : "1"}
          px="0"
          {...(isMobileView && { mb: "36" })}
          // h="100vh"
        >
          <Fragment>
            <Formik initialValues={{}} onSubmit={() => {}}>
              <Form>
                {programs.map(
                  (
                    {
                      opportunityName,
                      isInvestmentPreferenceShariah,
                      investmentAmountLabel,
                      inputState,
                      minimumAmount,
                      maximumAmount,
                      concentration,
                      isPreFund,
                    },
                    i,
                  ) => (
                    <Fragment key={i}>
                      <Box
                        justifyContent="space-between"
                        display="flex"
                        alignItems="center"
                        mb="24px"
                        mt={programs.length > 1 && i != 0 ? 5 : 0}
                      >
                        <Tag
                          size={"sm"}
                          key={"sm"}
                          variant="solid"
                          fontSize={"16px"}
                          fontWeight="semibold"
                          borderRadius="full"
                          padding=" 5px 12px"
                          color="gray.900"
                          bgColor="lightGreen.100"
                        >
                          {programs.length > 1
                            ? `${t(`common:client.program`)} 0${i + 1}`
                            : `${t(`common:client.program`)}`}
                        </Tag>
                        <Text
                          display={{ base: "none", md: "inline-block" }}
                          fontSize="12px"
                          fontWeight="medium"
                          color="#aaa"
                        >
                          {t("subscriptionDetails.subscriptionAmount")}
                        </Text>
                      </Box>
                      <Box
                        mb={5}
                        display="flex"
                        alignItems={{ base: "flex-start", md: "center" }}
                        flexDirection={{ base: "column", md: "row" }}
                      >
                        <Text mr={2} display="flex" alignItems="center">
                          {opportunityName}{" "}
                          {isInvestmentPreferenceShariah ? (
                            <IslamIcon color="secondary.500" mr={3} ml={1} />
                          ) : (
                            false
                          )}
                        </Text>

                        <Spacer />
                        <Text
                          display={{ base: "inline-block", md: "none" }}
                          fontSize="12px"
                          fontWeight="medium"
                          color="gray.400"
                          margin="8px 0px"
                        >
                          {t("subscriptionDetails.subscriptionAmount")}
                        </Text>
                        <Popover
                          returnFocusOnClose={false}
                          isOpen={
                            popUps?.popupDetails?.length && i == 0
                              ? !popUps?.popupDetails?.find(({ popupName }) => {
                                  return (
                                    popupName ==
                                    "SUBSCRIPTION_DETAILS_SUBSCRIPTION_AMOUNT"
                                  )
                                })?.flag
                                ? true
                                : false
                              : false
                          }
                          onClose={() =>
                            updatePopUpFlag(
                              "SUBSCRIPTION_DETAILS_SUBSCRIPTION_AMOUNT",
                              true,
                            )
                          }
                          placement="bottom-end"
                          closeOnBlur={false}
                        >
                          <PopoverTrigger>
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="flex-end"
                              W={{ base: "100%", md: "64%", lgp: "50%" }}
                              maxW={{ base: "100%", md: "64%", lgp: "50%" }}
                              minW={{ base: "100%", md: "64%", lgp: "50%" }}
                            >
                              <ClientInputControl
                                onClick={() =>
                                  updatePopUpFlag(
                                    "SUBSCRIPTION_DETAILS_SUBSCRIPTION_AMOUNT",
                                    true,
                                  )
                                }
                                inputProps={{
                                  type: "tel",
                                  placeholder: `${
                                    lang.includes("en")
                                      ? `${t(
                                          `subscriptionDetails.formSection.subscriptionAmount.placeholder`,
                                        )} ${absoluteConvertCurrencyWithDollar(
                                          minimumAmount,
                                        )}`
                                      : `${absoluteConvertCurrencyWithDollar(
                                          minimumAmount,
                                        )} ${t(
                                          `subscriptionDetails.formSection.subscriptionAmount.placeholder`,
                                        )} `
                                  }`,
                                }}
                                isInvalid={
                                  inputState != "valid" &&
                                  inputState != "initial"
                                    ? true
                                    : false
                                }
                                value={investmentAmountLabel}
                                aria-label={`investmentAmount.${i}.name`}
                                name={`investmentAmount.${i}.name`}
                                pt="2"
                                w="100%"
                                inputLeftElement="$"
                                textAlign="right"
                                float="right"
                                flex="1 1"
                                justifyContent="end"
                                dir="ltr"
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                  onChangeHandler(
                                    "program",
                                    event.target.value,
                                    i,
                                  )
                                }
                                onBlur={() => onBlurHandler("program", i)}
                                onKeyUp={onEnter}
                              />
                              {handleError(
                                inputState || "untouched",
                                minimumAmount,
                                maximumAmount,
                              )}
                            </Box>
                          </PopoverTrigger>
                          <PopoverContent bg="gunmetal.500">
                            <PopoverHeader
                              fontWeight="400"
                              fontSize="12px"
                              color="gray.400"
                            >
                              {t(
                                "common:client.userOnBoarding.subscriptionDetails.title",
                              )}
                            </PopoverHeader>
                            <PopoverArrow bg="gunmetal.500" border="0px" />
                            <PopoverCloseButton
                              style={{
                                right: lang.includes("en") ? "5px" : "inherit",
                                left: lang.includes("en") ? "inherit" : "5px",
                              }}
                            />
                            <PopoverBody
                              fontWeight="400"
                              fontSize="14px"
                              color="contrast.200"
                            >
                              {t(
                                "common:client.userOnBoarding.subscriptionDetails.description",
                              )}{" "}
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Box>
                      <Divider orientation="horizontal" />
                      <Card bg="gray.800" mt="4" padding="8px">
                        <CardContent p="4">
                          <Box justifyContent="space-between" display="flex">
                            <Text
                              fontSize="18px"
                              fontWeight="bold"
                              color="white"
                            >
                              {t(`subscriptionDetails.totalSubcriptionAmount`)}
                            </Text>
                            <Text
                              fontSize="20px"
                              fontWeight="400"
                              color="primary.500"
                              lineHeight="24px"
                              minW={{
                                base: "50%",
                                lgp: "inherit",
                                xl: "inherit",
                              }}
                              alignSelf="center"
                              textAlign="right"
                              dir="ltr"
                            >
                              <span>$</span>
                              {investmentAmountLabel &&
                              !(
                                inputState == "error_maximum_amount" ||
                                inputState == "error_minimum_amount"
                              )
                                ? investmentAmountLabel
                                : 0}
                            </Text>
                          </Box>
                        </CardContent>
                      </Card>
                      <Box
                        justifyContent="flex-start"
                        display="flex"
                        mt="5"
                        fontSize="14px"
                        alignItems="center"
                      >
                        <Checkbox
                          colorScheme="secondary"
                          isChecked={isPreFund}
                          onChange={(checked) => {
                            prefundAndConcentrationChangeHandler(
                              i,
                              "prefund",
                              checked.target.checked,
                            )
                          }}
                          mr="2"
                          color="gray.400"
                          fontWeight="400"
                          fontSize="14px"
                        />{" "}
                        {t(`subscriptionDetails.checkboxLabel`)}
                      </Box>

                      <Card bg="gray.800" w="100%" mt="8" padding="8px">
                        <CardContent p="4" className="concentartionCard">
                          <Text
                            mb="4"
                            color="white"
                            fontWeight="400"
                            fontSize="14px"
                          >
                            {t(`subscriptionDetails.numberosDeals.heading`)}
                          </Text>
                          <RadioGroup
                            display="block"
                            w="full"
                            alignItems="center"
                            flex="1 1"
                            defaultValue={concentration || "20"}
                            name="concentration"
                            onChange={(e) =>
                              prefundAndConcentrationChangeHandler(
                                i,
                                "concentration",
                                false,
                                e,
                              )
                            }
                          >
                            <Stack spacing={5} direction="column">
                              {subscriptionConcentration.map(
                                ({ label, key }) => (
                                  <Box
                                    className="SubDetailPopup"
                                    _hover={{
                                      background: "none",
                                    }}
                                    key={key}
                                    d="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                  >
                                    <Radio value={key}>
                                      <Box
                                        display="flex"
                                        w="100%"
                                        alignItems="center"
                                        flex="1 1"
                                      >
                                        <Text
                                          color="gray.400"
                                          fontWeight="400"
                                          fontSize="14px"
                                          _hover={{
                                            backgroundColor:
                                              "transparent !important",
                                          }}
                                          w="100%"
                                        >
                                          {label}
                                        </Text>
                                        <Spacer />
                                      </Box>
                                    </Radio>
                                    <Box className="modalBoxClass">
                                      {" "}
                                      <InfoIcon
                                        onClick={() => callModalBox(key)}
                                        color="primary.500"
                                        h="24px"
                                        w="24px"
                                        cursor="pointer"
                                      />
                                    </Box>
                                  </Box>
                                ),
                              )}
                            </Stack>
                          </RadioGroup>
                        </CardContent>
                      </Card>
                    </Fragment>
                  ),
                )}

                {programs.length ? (
                  <Box display="flex" mt="5" mb="5">
                    {" "}
                    <Text
                      color="gray.400"
                      fontWeight="400"
                      fontSize="14px"
                      fontStyle="italic"
                      pl="4px"
                    >
                      <Text
                        as="span"
                        color="white"
                        fontWeight="400"
                        fontSize="14px"
                        fontStyle="italic"
                      >
                        {t(`subscriptionDetails.note.title`)}{" "}
                      </Text>
                      {t(`subscriptionDetails.note.description`)}
                    </Text>
                  </Box>
                ) : (
                  false
                )}
                {deals.map(
                  (
                    {
                      opportunityName,
                      isInvestmentPreferenceShariah,
                      investmentAmountLabel,
                      inputState,
                      minimumAmount,
                      maximumAmount,
                    },
                    i,
                  ) => (
                    <Fragment key={i}>
                      <Box
                        justifyContent="space-between"
                        display="flex"
                        alignItems={{ base: "flex-start", md: "center" }}
                        flexDirection={{ base: "column", md: "row" }}
                      >
                        {i == 0 ? (
                          <Fragment>
                            {" "}
                            <Tag
                              size={"sm"}
                              key={"sm"}
                              mb="5"
                              mt={programs.length > 0 ? 5 : 0}
                              variant="solid"
                              fontSize={"16px"}
                              fontWeight="semibold"
                              borderRadius="full"
                              padding=" 5px 12px"
                              color="gray.900"
                              bgColor="primary.500"
                            >
                              {t("common:client.deal")}
                            </Tag>
                            <Text
                              fontSize="12px"
                              fontWeight="medium"
                              color="gray.400"
                              mb={{ base: "10px", md: "0px" }}
                            >
                              {t("subscriptionDetails.subscriptionAmount")}
                            </Text>
                          </Fragment>
                        ) : (
                          false
                        )}
                      </Box>

                      <Popover
                        returnFocusOnClose={false}
                        isOpen={
                          programs.length == 0 &&
                          i == 0 &&
                          popUps?.popupDetails?.length
                            ? !popUps?.popupDetails?.find(({ popupName }) => {
                                return (
                                  popupName ==
                                  "SUBSCRIPTION_DETAILS_SUBSCRIPTION_AMOUNT"
                                )
                              })?.flag
                              ? true
                              : false
                            : false
                        }
                        onClose={() =>
                          updatePopUpFlag(
                            "SUBSCRIPTION_DETAILS_SUBSCRIPTION_AMOUNT",
                            true,
                          )
                        }
                        placement="bottom-end"
                        closeOnBlur={false}
                      >
                        <PopoverTrigger>
                          <Box
                            display="flex"
                            alignItems={{ base: "flex-start", md: "center" }}
                            flexDirection={{ base: "column", md: "row" }}
                          >
                            <Text
                              fontSize="16px"
                              mr={2}
                              fontWeight="medium"
                              color="white"
                              display="flex"
                              dir="ltr"
                            >
                              {isInvestmentPreferenceShariah &&
                              lang.includes("ar") ? (
                                <IslamIcon
                                  color="secondary.500"
                                  alignSelf="center"
                                  mr={3}
                                  ml={1}
                                />
                              ) : (
                                false
                              )}
                              {opportunityName}
                              {isInvestmentPreferenceShariah &&
                              lang.includes("en") ? (
                                <IslamIcon
                                  color="secondary.500"
                                  alignSelf="center"
                                  mr={3}
                                  ml={1}
                                />
                              ) : (
                                false
                              )}
                            </Text>

                            <Spacer />
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="flex-end"
                              W={{ base: "100%", md: "64%", lgp: "50%" }}
                              maxW={{ base: "100%", md: "64%", lgp: "50%" }}
                              minW={{ base: "100%", md: "64%", lgp: "50%" }}
                            >
                              <ClientInputControl
                                onClick={() =>
                                  updatePopUpFlag(
                                    "SUBSCRIPTION_DETAILS_SUBSCRIPTION_AMOUNT",
                                    true,
                                  )
                                }
                                isInvalid={
                                  inputState != "valid" &&
                                  inputState != "initial"
                                    ? true
                                    : false
                                }
                                value={investmentAmountLabel}
                                aria-label={`investmentAmount.${i}.name`}
                                name={`investmentAmount.${i}.name`}
                                pt="2"
                                float="right"
                                w="100%"
                                inputLeftElement="$"
                                textAlign="right"
                                flex="1 1"
                                dir="ltr"
                                justifyContent="end"
                                inputProps={{
                                  type: "tel",
                                  placeholder: `${
                                    lang.includes("en")
                                      ? `${t(
                                          `subscriptionDetails.formSection.subscriptionAmount.placeholder`,
                                        )} ${absoluteConvertCurrencyWithDollar(
                                          minimumAmount,
                                        )}`
                                      : `${absoluteConvertCurrencyWithDollar(
                                          minimumAmount,
                                        )} ${t(
                                          `subscriptionDetails.formSection.subscriptionAmount.placeholder`,
                                        )} `
                                  }`,
                                }}
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                  onChangeHandler("deal", event.target.value, i)
                                }
                                onBlur={() => onBlurHandler("deal", i)}
                                onKeyUp={onEnter}
                              />
                              {handleError(
                                inputState || "untouched",
                                minimumAmount,
                                maximumAmount,
                              )}
                            </Box>
                          </Box>
                        </PopoverTrigger>
                        <PopoverContent bg="gunmetal.500">
                          <PopoverHeader
                            fontWeight="400"
                            fontSize="12px"
                            color="gray.400"
                          >
                            {t(
                              "common:client.userOnBoarding.subscriptionDetails.title",
                            )}
                          </PopoverHeader>
                          <PopoverArrow bg="gunmetal.500" border="0px" />
                          <PopoverCloseButton
                            style={{
                              right: lang.includes("en") ? "5px" : "inherit",
                              left: lang.includes("en") ? "inherit" : "5px",
                            }}
                          />
                          <PopoverBody
                            fontWeight="400"
                            fontSize="14px"
                            color="contrast.200"
                          >
                            {t(
                              "common:client.userOnBoarding.subscriptionDetails.description",
                            )}
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>

                      <Center px="15px" py="15px" pr="0px" pl="0px">
                        <Divider orientation="horizontal" />
                      </Center>
                    </Fragment>
                  ),
                )}
                {deals.length ? (
                  <Card bg="gray.800" mt="4" padding="8px" mb={"10px"}>
                    <CardContent p="4">
                      <Box justifyContent="space-between" display="flex">
                        <Text fontSize="18px" fontWeight="bold" color="white">
                          {t("subscriptionDetails.totalSubcriptionAmount")}
                        </Text>
                        <Text
                          fontSize="20px"
                          fontWeight="400"
                          color="primary.500"
                          lineHeight="24px"
                          minW={{ base: "50%", lgp: "inherit" }}
                          alignSelf="center"
                          textAlign="right"
                          dir="ltr"
                        >
                          <span>$</span>
                          {dealsSum &&
                          !deals.find(({ inputState }) => {
                            return (
                              inputState == "error_maximum_amount" ||
                              inputState == "error_minimum_amount"
                            )
                          })
                            ? formatCurrencyWithCommas(`${dealsSum}`)
                            : 0}
                        </Text>
                      </Box>
                    </CardContent>
                  </Card>
                ) : (
                  false
                )}
                <Box h={"20px"}></Box>
              </Form>
            </Formik>
          </Fragment>
        </Container>
      </Flex>
      <ModalBox
        isOpen={isOpen}
        modalDescription={t(
          "subscriptionDetails.contentrationDetailPopup.description",
          {
            concentration: activePointRef.current,
          },
        )}
        modalTitle={t("subscriptionDetails.contentrationDetailPopup.title", {
          concentration: activePointRef.current,
        })}
        primaryButtonText={t("common:client.errors.noDate.button")}
        onClose={() => {
          setIsOpen(false)
        }}
        onPrimaryClick={() => {
          setIsOpen(false)
        }}
      />
    </>
  )
}
