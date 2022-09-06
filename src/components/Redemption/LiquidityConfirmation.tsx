import { Box, Center, Container, Divider, Flex, Text } from "@chakra-ui/layout"
import { Button, useBreakpointValue } from "@chakra-ui/react"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Card, CardContent, ConfirmedIcon } from "~/components"
import { RedeemDetailsRoot, RedemptionFund } from "~/services/mytfo/types"
import { formatDate } from "~/utils/clientUtils/dateUtility"
import { absoluteConvertCurrencyWithDollar } from "~/utils/clientUtils/globalUtilities"

type props = {
  LiquidityConfirmationData: RedeemDetailsRoot
  amount: number
  fundData: RedemptionFund
}

export default function LiquidityConfirmation({
  LiquidityConfirmationData,
  amount,
  fundData,
}: props) {
  const { t, lang } = useTranslation("redemption")
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lgp: false,
  })
  const isMobileView = useBreakpointValue({ base: true, md: false })
  return (
    <Flex
      pb={{ base: 2, md: 16 }}
      mt={{ base: "26px", md: "86px", lgp: "86px" }}
      direction={{ base: "column", md: "row" }}
    >
      <Container
        flex={isTabletView ? "2" : "1"}
        px="0"
        {...(isMobileView && { mb: "36" })}
        h="100vh"
      >
        <Box textAlign="center" mb="4">
          <ConfirmedIcon
            w="97px"
            h="97px"
            mb={{ base: "21px", md: "30px", lgp: "30px" }}
          />
          <Text
            fontSize="30px"
            fontWeight="400"
            mb={{ lgp: "16px", md: "16px", base: "21px" }}
            color="gray.400"
          >
            {t("confirmation.heading", {
              clientId:
                LiquidityConfirmationData.redemptionSavedClientAppDB.clientId,
            })}
          </Text>
          <Text fontSize="18px" fontWeight="400" color="gray.500">
            {t("confirmation.successMessage")}
          </Text>
        </Box>
        <Box
          fontSize="20px"
          mt={{ lgp: "48px", base: "48px", md: "14px" }}
          fontWeight="400"
          color="white"
          textAlign="center"
        >
          <Text aria-label="Asset Name" role={"heading"}>
            {LiquidityConfirmationData.redemptionSavedClientAppDB.assetName}
          </Text>
        </Box>
        <Card
          bg="gunmetal.500"
          // padding="8px"
          mt={{ lgp: "32px", base: "40px", md: "32px" }}
        >
          <CardContent p="16px">
            <Box display="flex" alignItems="center">
              <Text fontSize="14px" fontWeight="700" color="gray.400" mr="2">
                {t("labels.availableBalance")}
                <Text
                  fontSize="12px"
                  fontWeight="400"
                  color="gray.400"
                  d={{ md: "none", lgp: "none", base: "block" }}
                >
                  ({formatDate(fundData.date, lang)})
                </Text>
              </Text>{" "}
              <Text
                d={{ md: "block", lgp: "block", base: "none" }}
                fontSize="12px"
                fontWeight="400"
                color="gray.400"
              >
                ({formatDate(fundData.date, lang)})
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
                {absoluteConvertCurrencyWithDollar(amount)}
              </Text>
            </Box>
            <Box
              justifyContent="space-between"
              alignItems="center"
              display="flex"
              mt="4"
            >
              <Text fontSize="14px" fontWeight="700" color="gray.400">
                {t("labels.redemptionAmount")}
              </Text>
              {LiquidityConfirmationData.redemptionSavedClientAppDB
                .redemptionAmount ? (
                <Text
                  aria-label="Redemption Amount"
                  role={"gridcell"}
                  fontSize="18px"
                  fontWeight="400"
                  color="white"
                  lineHeight="24px"
                  style={{
                    direction: lang.includes("ar") ? "initial" : "ltr",
                  }}
                >
                  -
                  {absoluteConvertCurrencyWithDollar(
                    LiquidityConfirmationData.redemptionSavedClientAppDB
                      .redemptionAmount,
                  )}
                </Text>
              ) : (
                <Text
                  fontSize="18px"
                  fontWeight="400"
                  color="white"
                  lineHeight="24px"
                >
                  0
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
              <Text fontSize="14px" fontWeight="700" color="primary.500">
                {t("labels.remainingBalance")}
              </Text>
              <Text
                aria-label="Remaining Balance"
                role={"gridcell"}
                fontSize="20px"
                fontWeight="400"
                color="white"
                dir={"ltr"}
                lineHeight="24px"
              >
                {absoluteConvertCurrencyWithDollar(
                  LiquidityConfirmationData.redemptionSavedClientAppDB
                    .remainingBalance,
                )}
              </Text>
            </Box>
          </CardContent>
        </Card>

        <Box
          color="gray.400"
          fontWeight="400"
          fontSize="14px"
          mt={{ base: "24px", lgp: "32px", md: "32px" }}
          textAlign="left"
        >
          <Text mb="16px">
            {t("confirmation.accurateDate")} {formatDate(fundData.date, lang)}.
          </Text>
          <Text mb="16px"> {t("confirmation.emailConfirmationText")}</Text>
          <Text> {t("confirmation.processText")}</Text>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="center">
          <Button
            mb="5"
            mt={{ base: "48px", md: "30px" }}
            px={8}
            colorScheme="primary"
            variant="solid"
            width={"auto"}
            fontSize="16px"
            color="#1A1A1A"
            onClick={() => {
              router.push("/client/opportunities")
            }}
          >
            {t("confirmation.button")}
          </Button>
        </Box>
      </Container>
    </Flex>
  )
}
