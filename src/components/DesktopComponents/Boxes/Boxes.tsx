import { Box, Flex, Text } from "@chakra-ui/react"
import moment from "moment"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Period } from "~/services/mytfo/clientTypes"

type DealDetailBoxesProps = {
  selectedQuarterData: Period
}

const DealDetailBoxes = ({ selectedQuarterData }: DealDetailBoxesProps) => {
  const { t, lang } = useTranslation("investmentDetail")

  return (
    <Box>
      <Flex
        justifyContent={{ lgp: "space-between" }}
        flexWrap={{ base: "wrap", md: "wrap", lgp: "wrap" }}
        textAlign={{ base: "center", lgp: "start", md: "center" }}
      >
        <Box
          w={{ base: "50%", md: "50%", lgp: "auto" }}
          position="relative"
          borderBottom={{
            base: "1px solid #4d4d4d",
            md: "none",
            lgp: "none",
          }}
        >
          <Box
            p={{ md: "25px", base: "12px", lgp: "0" }}
            borderBottom={{
              base: "none",
              md: "1px solid #4d4d4d",
              lgp: "none",
            }}
            minH={{ base: "auto", md: "100px" }}
          >
            <Box
              aria-label={t("summary.initialInvestmentDate")}
              role={"group"}
              _after={{
                content: "''",
                height: "70%",
                width: "1px",
                right: "-2px",
                top: "14px",
                position: "absolute",
                borderRight: {
                  base: "1px solid #4d4d4d",
                  md: "1px solid #4d4d4d",
                  lgp: "none",
                },
              }}
            >
              <Box textAlign={{ base: "start", lgp: "start", md: "start" }}>
                <Text
                  color={"gray.400"}
                  fontSize={{ lgp: "18px", md: "18px", base: "14px" }}
                  fontWeight="700"
                  lineHeight="120%"
                >
                  {t("summary.initialInvestmentDate")}
                </Text>
              </Box>
              <Box textAlign="start">
                <Text
                  color="contrast.200"
                  fontSize={{ base: "16px", lgp: "36px", md: "26px" }}
                  mt={"15px"}
                  fontWeight="400"
                  lineHeight="120%"
                >
                  {moment(selectedQuarterData.initialInvestmentDate).format(
                    "MMM YYYY",
                  )}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          w={{ base: "50%", md: "50%", lgp: "auto" }}
          borderBottom={{
            base: "1px solid #4d4d4d",
            md: "none",
            lgp: "none",
          }}
        >
          <Box
            p={{ md: "25px", base: "12px", lgp: "0" }}
            borderBottom={{
              base: "none",
              md: "1px solid #4d4d4d",
              lgp: "none",
            }}
            minH={{ base: "auto", md: "100px" }}
          >
            <Box aria-label={t("summary.priceDate")} role={"group"}>
              <Box textAlign={{ base: "start", lgp: "start", md: "start" }}>
                <Text
                  color={"gray.400"}
                  fontSize={{ lgp: "18px", md: "18px", base: "14px" }}
                  fontWeight="700"
                  lineHeight="120%"
                >
                  {t("summary.priceDate")}
                </Text>
              </Box>
              <Box textAlign="start">
                <Text
                  color="contrast.200"
                  fontSize={{ base: "16px", lgp: "36px", md: "26px" }}
                  mt={"15px"}
                  fontWeight="400"
                  lineHeight="120%"
                >
                  {moment(selectedQuarterData.priceDate).format("MMM YYYY")}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          borderBottom={{
            base: "1px solid #4d4d4d",
            md: "none",
            lgp: "none",
          }}
          w={{ base: "50%", md: "50%", lgp: "auto" }}
          position="relative"
        >
          <Box
            p={{ md: "25px", base: "12px", lgp: "0" }}
            borderBottom={{
              base: "none",
              md: "1px solid #4d4d4d",
              lgp: "none",
            }}
            minH={{ base: "auto", md: "100px" }}
          >
            <Box
              aria-label={t("summary.holdingPeriod")}
              role={"group"}
              _after={{
                content: "''",
                height: "70%",
                width: "1px",
                right: "-2px",
                top: lang.includes("ar") ? "12px" : "15px",
                position: "absolute",
                borderRight: {
                  base: "1px solid #4d4d4d",
                  md: "1px solid #4d4d4d",
                  lgp: "none",
                },
              }}
            >
              <Box textAlign={{ base: "start", lgp: "start", md: "start" }}>
                <Text
                  color={"gray.400"}
                  fontSize={{ lgp: "18px", md: "18px", base: "14px" }}
                  fontWeight="700"
                  lineHeight="120%"
                >
                  {t("summary.holdingPeriod")}
                </Text>
              </Box>
              <Box textAlign="start">
                <Text
                  color="contrast.200"
                  fontSize={{ base: "16px", lgp: "36px", md: "26px" }}
                  mt={"15px"}
                  fontWeight="400"
                  lineHeight="120%"
                  textAlign={{
                    base: lang.includes("ar") ? "end" : "start",
                    md: "left",
                  }}
                  dir="ltr"
                >
                  {selectedQuarterData.holdingPeriod}{" "}
                  {selectedQuarterData.holdingPeriod
                    ? selectedQuarterData.holdingPeriod >= 2
                      ? "Years"
                      : "Year"
                    : "Year"}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          w={{ base: "50%", md: "50%", lgp: "auto" }}
          borderBottom={{
            base: "1px solid #4d4d4d",
            md: "none",
            lgp: "none",
          }}
        >
          <Box
            p={{ md: "25px", base: "12px", lgp: "0" }}
            borderBottom={{
              base: "none",
              md: "1px solid #4d4d4d",
              lgp: "none",
            }}
            minH={{ base: "auto", md: "100px" }}
          >
            <Box aria-label={t("summary.sponsorPartner")} role={"group"}>
              <Box textAlign={{ base: "start", lgp: "start", md: "start" }}>
                <Text
                  color={"gray.400"}
                  fontSize={{ lgp: "18px", md: "18px", base: "14px" }}
                  fontWeight="700"
                  lineHeight="120%"
                >
                  {t("summary.sponsorPartner")}
                </Text>
              </Box>
              <Box textAlign="start">
                <Text
                  color="contrast.200"
                  fontSize={{ base: "16px", lgp: "36px", md: "26px" }}
                  mt={"15px"}
                  fontWeight="400"
                  lineHeight="120%"
                >
                  {selectedQuarterData.sponsorOrPartner == "No Sponsor"
                    ? t("common:client.no_sponsor")
                    : selectedQuarterData.sponsorOrPartner}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          w={{ base: "50%", md: "50%", lgp: "auto" }}
          position="relative"
          borderBottom={{
            base: "1px solid #4d4d4d",
            md: "none",
            lgp: "none",
          }}
        >
          <Box
            p={{ md: "25px", base: "12px", lgp: "0" }}
            borderBottom={{
              base: "none",
              md: "none",
              lgp: "none",
            }}
            minH={{ base: "auto", md: "100px" }}
          >
            <Box
              aria-label={t("summary.strategy")}
              role={"group"}
              _after={{
                content: "''",
                height: "70%",
                width: "1px",
                right: "-2px",
                top: "14px",
                position: "absolute",
                borderRight: {
                  base: "1px solid #4d4d4d",
                  md: "1px solid #4d4d4d",
                  lgp: "none",
                },
              }}
            >
              <Box textAlign={{ base: "start", lgp: "start", md: "start" }}>
                <Text
                  color={"gray.400"}
                  fontSize={{ lgp: "18px", md: "18px", base: "14px" }}
                  fontWeight="700"
                  lineHeight="120%"
                >
                  {t("summary.strategy")}
                </Text>
              </Box>
              <Box textAlign="start">
                <Text
                  color="contrast.200"
                  fontSize={{ base: "16px", lgp: "36px", md: "26px" }}
                  mt={"15px"}
                  fontWeight="400"
                  lineHeight="120%"
                >
                  {t(`common:client.strategy.${selectedQuarterData.strategy}`)}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          display={{ base: "block", md: "block", lgp: "none" }}
          w={{ base: "50%", md: "50%", lgp: "auto" }}
          p={{ md: "25px", base: "12px", lgp: "0" }}
          borderBottom={{
            base: "1px solid #4d4d4d",
            md: "none",
            lgp: "none",
          }}
        ></Box>
      </Flex>
    </Box>
  )
}

export default DealDetailBoxes
