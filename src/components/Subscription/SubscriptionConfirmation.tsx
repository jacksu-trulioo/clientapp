import { Box, Center, Container, Divider, Flex, Text } from "@chakra-ui/layout"
import {
  Button,
  Tag,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useState } from "react"

import {
  Card,
  CardContent,
  ConfirmedIcon,
  FeedbackModal,
  IslamIcon,
} from "~/components"
import siteConfig from "~/config"
import {
  FeedbackSubmissionScreen,
  SubscriptionSavedClientAppDbObj,
} from "~/services/mytfo/types"
import {
  getFeedbackCookieStatus,
  setFeedbackCookieStatus,
} from "~/utils/clientUtils/feedbackCookieUtilities"
import { roundCurrencyValue } from "~/utils/clientUtils/globalUtilities"
import { formatCurrencyWithCommas } from "~/utils/formatCurrency"

type SubscriptionConfirmationPropsType = {
  subscriptionConfirmation: {
    subscriptionProgramDTOList: SubscriptionSavedClientAppDbObj[]
    subscriptionDealDTOList: SubscriptionSavedClientAppDbObj[]
  }
}

export default function SubscriptionConfirmation({
  subscriptionConfirmation,
}: SubscriptionConfirmationPropsType) {
  const { t } = useTranslation("subscription")
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lgp: false,
  })
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const [programs] = useState<SubscriptionSavedClientAppDbObj[]>(
    subscriptionConfirmation.subscriptionProgramDTOList,
  )
  const [deals] = useState<SubscriptionSavedClientAppDbObj[]>(
    subscriptionConfirmation.subscriptionDealDTOList,
  )

  const sumValue = (type: string) => {
    var total = 0
    if (type == "totalInvestmentAmount") {
      if (programs.length) {
        programs?.forEach(({ totalInvestmentAmount }) => {
          total += Number(totalInvestmentAmount) || 0
        })
      }
    } else {
      if (programs.length) {
        programs?.forEach(({ indermediateInvestmentAmount }) => {
          total += Number(indermediateInvestmentAmount) || 0
        })
      }
    }
    if (deals.length) {
      deals?.forEach(({ investmentAmount }) => {
        total += Number(investmentAmount) || 0
      })
    }
    return total
  }

  const backToOpportunities = () => {
    onFeedbackModalClose()
    setFeedbackCookieStatus(
      siteConfig.clientFeedbackSessionVariableName,
      false,
      siteConfig.clientFeedbackSessionExpireDays,
    )
    router.push("/client/opportunities")
  }

  return (
    <Flex py={{ base: 2, md: 16 }} direction={{ base: "column", md: "row" }}>
      <Container
        flex={isTabletView ? "2" : "1"}
        px="0"
        {...(isMobileView && { mb: "36" })}
        h="100vh"
      >
        <Box textAlign="center" mb="4">
          <ConfirmedIcon w="97px" h="97px" mb="4" />
          <Text fontSize="30px" fontWeight="400" mb="8px" color="White">
            {t("confirmation.heading")}
          </Text>
          <Text fontSize="18px" fontWeight="400" color="gray.400">
            {t("confirmation.successMsg")}
          </Text>
        </Box>
        {programs.length ? (
          <Card bg="gray.800" padding="8px">
            <CardContent p="4">
              <Box justifyContent="space-between" display="flex">
                <Tag
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
                  {t("common:client.program")}
                </Tag>
              </Box>
              {programs.map(
                (
                  {
                    dealName,
                    subscriptionProgramDealDTOList,
                    isShariahSelected,
                  },
                  i,
                ) => (
                  <Fragment key={i}>
                    <Box alignItems="center" display="flex" mb="5">
                      <Text
                        fontSize="18px"
                        fontWeight="bold"
                        color="white"
                        mr={2}
                      >
                        {dealName}
                      </Text>
                      {isShariahSelected && (
                        <IslamIcon color="secondary.500" mr={3} />
                      )}
                    </Box>
                    {subscriptionProgramDealDTOList?.length == 0 ? (
                      <Text
                        mb="3"
                        fontSize="14px"
                        fontWeight="400"
                        mt="2"
                        color="white"
                      >
                        {t("programDetails.noProgramSelected")}
                      </Text>
                    ) : (
                      false
                    )}
                    {subscriptionProgramDealDTOList.length
                      ? subscriptionProgramDealDTOList.map(
                          ({ dealName, investmentAmount }, j) => (
                            <Box
                              key={j}
                              justifyContent="space-between"
                              mb="4"
                              alignItems="center"
                              display="flex"
                            >
                              <Text
                                aria-label="Program Deal Name"
                                fontSize="18px"
                                fontWeight="400"
                                color="gray.400"
                              >
                                {dealName}
                              </Text>
                              <Text
                                aria-label="Program Deal Amount"
                                alignSelf="center"
                                textAlign="right"
                                minW="50%"
                                dir="ltr"
                                fontSize="18px"
                              >
                                $
                                {investmentAmount
                                  ? roundCurrencyValue(Number(investmentAmount))
                                  : 0}
                              </Text>
                            </Box>
                          ),
                        )
                      : false}
                    <Center
                      _last={{
                        display: "none",
                      }}
                      px="15px"
                      py="15px"
                      pr="0px"
                      pl="0px"
                    >
                      <Divider orientation="horizontal" />
                    </Center>
                  </Fragment>
                  // <Card key={i} bg="gray.800" padding="8px">
                  //   <CardContent p="4">
                ),
              )}
            </CardContent>
          </Card>
        ) : (
          false
        )}

        {deals.length ? (
          <Card bg="gray.800" padding="8px" mt="5">
            <CardContent p="4">
              <Box justifyContent="space-between" display="flex">
                <Tag
                  size={"sm"}
                  key={"sm"}
                  mb="5"
                  variant="solid"
                  fontSize={"18px"}
                  fontWeight="semibold"
                  borderRadius="full"
                  padding=" 5px 12px"
                  color="gray.900"
                  bgColor="primary.500"
                >
                  {t("common:client.deal")}
                </Tag>
              </Box>
              {deals.map(
                (
                  { dealName, investmentAmount, isInvestmentPreferenceShariah },
                  i,
                ) => (
                  <Box
                    key={i}
                    justifyContent="space-between"
                    display="flex"
                    alignItems="center"
                    mb="16px"
                    _last={{
                      mb: "0px",
                    }}
                  >
                    <Box alignItems="center" display="flex">
                      <Text
                        aria-label="Deal Name"
                        fontSize="18px"
                        fontWeight="400"
                        color="gray.400"
                        mr={2}
                      >
                        {dealName}
                      </Text>
                      {isInvestmentPreferenceShariah && (
                        <IslamIcon color="secondary.500" mr={3} />
                      )}
                    </Box>
                    <Text
                      aria-label="Deal Amount"
                      dir="ltr"
                      alignSelf="center"
                      textAlign="right"
                      minW="50%"
                      fontWeight="400"
                      fontSize="18px"
                    >
                      <span>$</span>
                      {formatCurrencyWithCommas(`${investmentAmount}`)}
                    </Text>
                  </Box>
                ),
              )}
            </CardContent>
          </Card>
        ) : (
          false
        )}

        {programs.length ? (
          <Card bg="raisinBlack.600" mt="5" padding="8px">
            <CardContent p="4">
              <Box justifyContent="space-between" display="flex">
                <Text fontSize="18px" fontWeight="bold" color="primary.500">
                  {t("orderSummary.totalImmediateInvestment")}
                </Text>
                <Text
                  aria-label="Immediate Investment"
                  fontSize="20px"
                  fontWeight="400"
                  color="primary.500"
                  lineHeight="24px"
                  alignSelf="center"
                  textAlign="right"
                  minW="50%"
                  dir="ltr"
                >
                  <span>$</span>
                  {sumValue("totalImmediateInvestment") > 0
                    ? roundCurrencyValue(sumValue("totalImmediateInvestment"))
                    : 0}
                </Text>
              </Box>
            </CardContent>
          </Card>
        ) : (
          false
        )}
        <Card bg="gray.800" mt="5" padding="8px">
          <CardContent p="4">
            <Box justifyContent="space-between" display="flex">
              <Text fontSize="18px" fontWeight="bold" color="white">
                {t("orderSummary.totalInvestmentAmount")}
              </Text>
              <Text
                aria-label="Investment Amount"
                fontSize="20px"
                fontWeight="400"
                color="primary.500"
                lineHeight="24px"
                alignSelf="center"
                textAlign="right"
                minW="50%"
                dir="ltr"
              >
                <span>$</span>
                {sumValue("totalInvestmentAmount") > 0
                  ? formatCurrencyWithCommas(
                      `${sumValue("totalInvestmentAmount")}`,
                    )
                  : 0}
              </Text>
            </Box>
          </CardContent>
        </Card>

        <Box
          aria-label="Note of confirmation"
          role={"definition"}
          color="gray.400"
          fontWeight="400"
          fontSize="14px"
          mt="5"
          textAlign="center"
        >
          <Text mb="4">{t("confirmation.emailConfirmationText")}</Text>
          <Text> {t("confirmation.processText")}</Text>
        </Box>

        <Box
          aria-label="Disclaimer"
          mt="5"
          color="gray.500"
          fontWeight="400"
          fontSize="14px"
          fontStyle="italic"
          display="inline-block"
        >
          <b aria-label="Disclaimer" role={"heading"} style={{ color: "#fff" }}>
            {" "}
            {t("confirmation.disclaimer.title")}{" "}
          </b>{" "}
          {t("confirmation.disclaimer.description")}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Button
            mb="5"
            mt="32px"
            px={8}
            colorScheme="primary"
            variant="solid"
            width={"auto"}
            onClick={() => {
              if (
                getFeedbackCookieStatus(
                  siteConfig.clientFeedbackSessionVariableName,
                ) == "true"
              ) {
                onFeedbackModalOpen()
              } else {
                backToOpportunities()
              }
            }}
          >
            {t("confirmation.opportunitiesCTA")}
          </Button>
        </Box>
      </Container>
      <FeedbackModal
        hideReferalOption={true}
        isOpen={isFeedbackModalOpen}
        onClose={backToOpportunities}
        submissionScreen={FeedbackSubmissionScreen.ClientInvestmentCart}
      />
    </Flex>
  )
}
