import {
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/layout"
import { Box, RadioGroup, useBreakpointValue } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Card, CardContent, Radio, StepInfoCard } from "~/components"
import { formatDate } from "~/utils/clientUtils/dateUtility"
import { absoluteConvertCurrencyWithDollar } from "~/utils/clientUtils/globalUtilities"

type RedemptionFund = {
  date: string
  fundName: string
  balance: number
}

type RedeemFundProps = {
  fundData: RedemptionFund[]
  updateFund: Function
  selectedFund: number
}

export default function LiquidityHolding({
  fundData,
  updateFund,
  selectedFund,
}: RedeemFundProps) {
  const { t, lang } = useTranslation("redemption")
  const isFullWidth = useBreakpointValue({ base: true, lgp: false, md: true })
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lgp: false,
  })

  return (
    <Flex
      py={{ base: 2, md: 16 }}
      direction={{ base: "column", md: "column", lgp: "row" }}
    >
      <Container
        flex="1"
        maxW={{ base: "full", md: "full", lgp: "280px" }}
        px="0"
      >
        <Heading
          mb={{ base: 4, md: "8px", lgp: "8px" }}
          fontSize={{ base: "2xl", md: "30px", lgp: "3xl" }}
        >
          {t("myLiquidHolding.title")}
        </Heading>
        <Text
          fontSize="16px"
          color="gray.500"
          fontWeight="400"
          mb={{ base: "24px", md: "32px", lgp: "32px" }}
        >
          {t("myLiquidHolding.description")}
        </Text>
        <StepInfoCard
          heading={t("aboutLiquids.title")}
          description={t("aboutLiquids.description", {
            date: formatDate(fundData[selectedFund].date, lang),
          })}
        />
      </Container>

      <Center
        px={{ base: 0, md: "0" }}
        py={{ base: "32px", md: "32px", lg: "32px", lgp: 0 }}
      >
        <Divider orientation={isFullWidth ? "horizontal" : "vertical"} />
      </Center>

      <Container
        flex={isTabletView ? "2" : "1"}
        px="0"
        mb={{ base: "36", md: "60px", lgp: "60px" }}
        // h="100vh"
        maxW={{ lg: "lg", md: "full", base: "lg" }}
      >
        <VStack
          spacing={["6", "8"]}
          alignItems="start"
          maxW={{ lgp: "lg", md: "full", base: "lg" }}
        >
          <RadioGroup
            variant="filled"
            w="100%"
            onChange={(e) => {
              updateFund(e)
            }}
            defaultValue={`${selectedFund}`}
            color="#B99855"
          >
            <Stack aria-label="Liquid asset" role={"group"}>
              {fundData.map((fund, i) => {
                return (
                  <Radio
                    w="100%"
                    padding="20px"
                    variant="filled"
                    key={`${i}`}
                    value={`${i}`}
                    color="#B99855"
                    _selected={{
                      border: "1px solid",
                    }}
                  >
                    {fund.fundName}
                  </Radio>
                )
              })}
            </Stack>
          </RadioGroup>
        </VStack>
        {selectedFund >= 0 && fundData.length ? (
          <Card
            bg="gunmetal.500"
            padding="8px"
            mt={{ md: "24px", base: "24px", lgp: "24px" }}
            maxW={{ md: "full", base: "full", lgp: "lg" }}
          >
            <CardContent p="4">
              <Box
                aria-label="BondVest Class"
                role={"paragraph"}
                //  display="flex"
                alignItems="center"
              >
                <Text
                  as="span"
                  fontSize="14px"
                  fontWeight="600"
                  color="primary.500"
                  mr={2}
                >
                  {fundData[selectedFund].fundName}
                </Text>{" "}
                <Text
                  as="span"
                  fontSize="12px"
                  fontWeight="400"
                  color="primary.500"
                  d="block"
                >
                  ({formatDate(fundData[selectedFund].date, lang)}){" "}
                </Text>
              </Box>
              <Box
                justifyContent="space-between"
                display="flex"
                mt="16px"
                alignItems="flex-end"
              >
                <Text fontSize="14px" fontWeight="400" color="gray.400">
                  {t("myLiquidHolding.estimationText")}
                </Text>
                <Text
                  aria-label="Estimated balance"
                  role={"cell"}
                  fontSize="18px"
                  fontWeight="400"
                  color="white"
                  lineHeight="24px"
                >
                  {absoluteConvertCurrencyWithDollar(
                    fundData[selectedFund].balance || 0,
                  )}
                </Text>
              </Box>
            </CardContent>
          </Card>
        ) : (
          false
        )}
      </Container>
    </Flex>
  )
}
