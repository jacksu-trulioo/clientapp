import {
  Box,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/layout"
import { Tag, useBreakpointValue } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"

import {
  Card,
  CardContent,
  IslamIcon,
  OrderManagementTerms,
} from "~/components"
import useStore from "~/hooks/useStore"
import {
  InvestmentCartDealDetails,
  SubscriptionDealsDetail,
} from "~/services/mytfo/clientTypes"
import { roundCurrencyValue } from "~/utils/clientUtils/globalUtilities"
import { formatCurrencyWithCommas } from "~/utils/formatCurrency"

import Checkbox from "../Checkbox"

type orderSummaryProps = {
  showTermsError: boolean
  showCheckError: boolean
  showSignAuthError: boolean
  setTerms: Function
  setSignAuth: Function
}
export default function OrderSummary({
  showTermsError,
  showCheckError,
  showSignAuthError,
  setTerms,
  setSignAuth,
}: orderSummaryProps) {
  const { t, lang } = useTranslation("subscription")
  const [deals, setDeals] = useState<InvestmentCartDealDetails[]>([])
  const [programs, setPrograms] = useState<InvestmentCartDealDetails[]>([])
  const isFullWidth = useBreakpointValue({ base: true, md: false })
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lgp: false,
  })
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const [IsviewTerms, setIsviewTerms] = useState(false)
  const [subscriptionDealsAndPrograms] = useStore((state) => [
    state.subscriptionDealsAndPrograms,
  ])

  useEffect(() => {
    setPrograms(
      subscriptionDealsAndPrograms.filter(({ isProgram }) => {
        return isProgram
      }),
    )
    setDeals(
      subscriptionDealsAndPrograms.filter(({ isProgram }) => {
        return !isProgram
      }),
    )
  }, [])

  const viewTerms = () => {
    setIsviewTerms(true)
  }

  const getDealTotal = () => {
    var total = 0
    if (deals.length) {
      deals.forEach(({ investmentAmountKey }) => {
        total += Number(investmentAmountKey)
      })
    }

    return total
  }

  const getProgramTotal = (programDeals: SubscriptionDealsDetail[]) => {
    var total = 0
    if (programDeals.length) {
      programDeals?.forEach(({ commitedAmount }) => {
        total += Number(commitedAmount)
      })
    }
    return Number(total.toFixed())
  }

  const getTotal = () => {
    var total = getDealTotal()
    programs.forEach(({ programDeals }) => {
      total += getProgramTotal(programDeals || [])
    })
    return total
  }

  return (
    <Flex py={{ base: 2, md: 16 }} direction={{ base: "column", md: "row" }}>
      <Container flex="1" maxW={{ base: "full", md: "300px" }} px="0">
        <Heading
          mb={{ base: 4, md: 6 }}
          fontSize={{ base: "2xl", md: "30px", lgp: "30px" }}
        >
          {t("orderSummary.heading")}
        </Heading>
        <Text color="gray.500" fontSize="16px">
          {t("orderSummary.description")}
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
        {programs.length
          ? programs.map((program, i) => {
              return (
                <Fragment key={i}>
                  <Box justifyContent="space-between" display="flex">
                    <Tag
                      aria-label={`${t("common:client.program")} ${
                        programs.length > 1 ? `0${i + 1}` : ""
                      }`}
                      role={"columnheader"}
                      size={"sm"}
                      key={"sm"}
                      mb="5"
                      variant="solid"
                      fontSize={"16px"}
                      fontWeight="semibold"
                      borderRadius="full"
                      padding=" 5px 12px"
                      color="gray.900"
                      bgColor="lightGreen.100"
                    >
                      {programs.length > 1
                        ? `${t("common:client.program")} 0${i + 1}`
                        : t("common:client.program")}
                    </Tag>
                  </Box>
                  <Text fontSize="16px" fontWeight="500" color="white">
                    {program.opportunityName}
                    {program.isInvestmentPreferenceShariah ? (
                      <IslamIcon color="secondary.500" mr={3} ml={2} />
                    ) : (
                      false
                    )}
                  </Text>
                  {program.programDeals?.length ? (
                    <Text
                      mb="3"
                      fontSize="14px"
                      fontWeight="400"
                      mt="2"
                      color="white"
                    >
                      {t("programDetails.programDeals")}{" "}
                    </Text>
                  ) : (
                    <Text
                      mb="3"
                      fontSize="14px"
                      fontWeight="400"
                      mt="2"
                      color="white"
                    >
                      {t("programDetails.noProgramSelected")}
                    </Text>
                  )}

                  {program.programDeals?.length ? (
                    <Text
                      mb="4"
                      textAlign="right"
                      fontSize="12px"
                      fontWeight="medium"
                      color="gray.400"
                    >
                      {t("subscriptionDetails.subscriptionAmount")}
                    </Text>
                  ) : (
                    false
                  )}

                  {program.programDeals?.length
                    ? program.programDeals.map(
                        ({ dealName, commitedAmount }, j) => {
                          return (
                            <Fragment key={j}>
                              <Box
                                justifyContent="space-between"
                                alignItems="center"
                                display="flex"
                              >
                                <Text
                                  aria-label="Program Deal"
                                  role={"cell"}
                                  fontSize="16px"
                                  fontWeight="medium"
                                  color="white"
                                  dir="ltr"
                                >
                                  {dealName}
                                </Text>
                                <Text
                                  aria-label={`${
                                    programs.length > 1
                                      ? `${t("common:client.program")} 0${
                                          i + 1
                                        }`
                                      : t("common:client.program")
                                  } Amount`}
                                  role={"cell"}
                                  dir="ltr"
                                >
                                  $
                                  {commitedAmount
                                    ? roundCurrencyValue(Number(commitedAmount))
                                    : 0}
                                </Text>
                              </Box>
                              <Center px="15px" py="15px" pr="0px" pl="0px">
                                <Divider orientation="horizontal" />
                              </Center>
                            </Fragment>
                          )
                        },
                      )
                    : false}
                  <Card bg="gray.800" padding="8px">
                    <CardContent p="4">
                      <Box justifyContent="space-between" display="flex">
                        <Text
                          aria-label="Program Deal"
                          role={"heading"}
                          fontSize="18px"
                          fontWeight="bold"
                          color="primary.500"
                        >
                          {program.opportunityName}
                        </Text>
                        <Text
                          aria-label={`${
                            programs.length > 1
                              ? `${t("common:client.program")} 0${i + 1}`
                              : t("common:client.program")
                          } Total Amount`}
                          role={"cell"}
                          fontSize="20px"
                          fontWeight="400"
                          color="primary.500"
                          lineHeight="24px"
                          minW="50%"
                          alignSelf="center"
                          textAlign="right"
                          dir="ltr"
                        >
                          $
                          {program.programDeals?.length
                            ? formatCurrencyWithCommas(
                                `${getProgramTotal(program.programDeals)}`,
                              )
                            : 0}
                        </Text>
                      </Box>
                    </CardContent>
                  </Card>
                  <Center px="15px" py="15px" pr="0px" pl="0px">
                    <Divider orientation="horizontal" />
                  </Center>
                </Fragment>
              )
            })
          : false}
        {deals.length ? (
          <Box
            justifyContent="space-between"
            display="flex"
            alignItems="center"
            mb="5"
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
              bgColor="primary.500"
            >
              {t("common:client.deal")}
            </Tag>
            <Text fontSize="12px" fontWeight="medium" color="gray.400">
              {t("subscriptionDetails.subscriptionAmount")}
            </Text>
          </Box>
        ) : (
          false
        )}
        {deals.length
          ? deals.map((deal, i) => {
              return (
                <Fragment key={i}>
                  <Box
                    justifyContent="space-between"
                    display="flex"
                    alignItems="center"
                    mb="16px"
                  >
                    <Text
                      aria-label="Deal Name"
                      fontSize="16px"
                      dir="ltr"
                      fontWeight="medium"
                      color="white"
                    >
                      {deal.isInvestmentPreferenceShariah &&
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
                      {deal.opportunityName}
                      {deal.isInvestmentPreferenceShariah &&
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

                    <Text aria-label="Deal Amount">
                      ${deal.investmentAmountLabel}
                    </Text>
                  </Box>
                </Fragment>
              )
            })
          : false}
        {deals.length && programs.length ? (
          <Card bg="gray.800" mt="24px" padding="8px" mb="24px">
            <CardContent p="4">
              <Box justifyContent="space-between" display="flex">
                <Text
                  aria-label="Deal Name"
                  role={"heading"}
                  fontSize="18px"
                  fontWeight="bold"
                  color="white"
                >
                  {t("orderSummary.dealImmediateInvestment")}
                </Text>
                <Text
                  aria-label="Total Deal Amount"
                  role={"cell"}
                  fontSize="20px"
                  fontWeight="400"
                  color="primary.500"
                  lineHeight="24px"
                  minW="50%"
                  alignSelf="center"
                  textAlign="right"
                  dir="ltr"
                >
                  $
                  {getDealTotal() > 0
                    ? formatCurrencyWithCommas(`${getDealTotal()}`)
                    : 0}
                </Text>
              </Box>
            </CardContent>
          </Card>
        ) : (
          false
        )}

        <Card bg="raisinBlack.600" padding="8px">
          <CardContent p="4">
            <Box justifyContent="space-between" display="flex">
              <Text
                aria-label="Total Immediate Investment"
                role={"heading"}
                fontSize="18px"
                fontWeight="bold"
                color="primary.500"
              >
                {t("orderSummary.totalImmediateInvestment")}
              </Text>
              <Text
                aria-label="Total Immediate Amount"
                role={"cell"}
                fontSize="20px"
                fontWeight="400"
                color="primary.500"
                lineHeight="24px"
                minW="50%"
                alignSelf="center"
                textAlign="right"
                dir="ltr"
              >
                $
                {getTotal() > 0 ? formatCurrencyWithCommas(`${getTotal()}`) : 0}
              </Text>
            </Box>
          </CardContent>
        </Card>
        <Box
          justifyContent="flex-start"
          display="flex"
          mt="32px"
          alignItems="center"
        >
          <Checkbox
            aria-label="authSignatory"
            role={"checkbox"}
            mr="2"
            color="gray.400"
            fontWeight="400"
            fontSize="14px"
            colorScheme="secondary"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSignAuth(e.target.checked)
            }}
          />
          <Text fontWeight="400" fontSize="14px">
            {t("common:client.authSignatory.title")}
          </Text>
        </Box>
        {showSignAuthError && showCheckError ? (
          <Box>
            <Text
              fontSize="14px"
              color="red.500"
              fontWeight="400"
              textAlign="left"
              mt="8px"
              ml="32px"
            >
              {t("common:client.authSignatory.error")}
            </Text>
          </Box>
        ) : (
          false
        )}
        <Box
          justifyContent="flex-start"
          display="flex"
          mt="32px"
          alignItems="center"
        >
          <Checkbox
            aria-label="agreeTerms"
            role={"checkbox"}
            mr="2"
            color="gray.400"
            fontWeight="400"
            fontSize="14px"
            colorScheme="secondary"
            onChange={(e) => {
              setTerms(e.target.checked)
            }}
          ></Checkbox>{" "}
          <Box>
            <Text as="span" fontWeight="400" fontSize="14px" me="2">
              {t("common:client.agreeTerms.title")}
            </Text>
            <Text
              as="span"
              fontWeight="400"
              fontSize="14px"
              color="primary.500"
              cursor="pointer"
              onClick={() => {
                viewTerms()
              }}
              textDecoration="underline"
            >
              {t("common:client.agreeTerms.termsandConditions")}
            </Text>
          </Box>
        </Box>
        {showTermsError && showCheckError ? (
          <Box>
            <Text
              fontSize="14px"
              color="red.500"
              fontWeight="400"
              textAlign="left"
              mt="8px"
              ml="32px"
            >
              {t("common:client.agreeTerms.error")}
            </Text>
          </Box>
        ) : (
          false
        )}
        <Box
          mt="32px"
          color="gray.400"
          fontWeight="400"
          fontSize="14px"
          fontStyle="italic"
          display="inline-block"
        >
          <b style={{ color: "#fff" }}>
            {" "}
            {t("orderSummary.disclaimer.title")}{" "}
          </b>{" "}
          {t("orderSummary.disclaimer.description")}
        </Box>
        <Box h={"20px"}></Box>
      </Container>
      {IsviewTerms ? (
        <OrderManagementTerms
          show={IsviewTerms}
          close={() => setIsviewTerms(false)}
        />
      ) : (
        false
      )}
    </Flex>
  )
}
