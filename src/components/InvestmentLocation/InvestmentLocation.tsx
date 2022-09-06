import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Asia, Europe, Global, Northamerica } from "~/components"
import { percentTwoDecimalPlace } from "~/utils/clientUtils/globalUtilities"

type LocationDataItem = {
  perAsia: number
  perEurope: number
  perGlobal: number
  perNorthAmerica: number
}

export type InvestmentLocationProps = {
  investmentLocationData: LocationDataItem
}
const InvestmentLocation = ({
  investmentLocationData,
}: InvestmentLocationProps) => {
  const { lang, t } = useTranslation("totalInvestment")

  return (
    <Box>
      <Box>
        <Grid
          aria-label="investmentLocations"
          role={"grid"}
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lgp: "repeat(4, 1fr)",
          }}
          gap={6}
        >
          <GridItem
            w="100%"
            d={{ base: "block", md: "block", lgp: "block" }}
            flexDir={{ base: "row", md: "row", lgp: "column" }}
          >
            <Box>
              <Flex
                flexDir={{ base: "row", md: "row", lgp: "column" }}
                alignItems="center"
                justifyContent="center"
              >
                <Northamerica />
                <Box
                  aria-label={t("common:client.regions.northAmerica")}
                  m={{
                    base: lang == "en" ? "0px 30px 0 60px" : "0px 30px 0 20px",
                    sm: "0px 30px 0 60px",
                    md: "0 30px",
                    lgp: "0px",
                  }}
                  textAlign="left"
                  minW={{ base: "120px", lgp: "unset" }}
                >
                  <Text
                    fontSize="18px"
                    color="#C7C7C7"
                    fontWeight="700"
                    mt={{ lgp: "16px" }}
                  >
                    {t("common:client.regions.northAmerica")}
                  </Text>
                  <Text
                    fontSize="26px"
                    color="#FFFFFF"
                    fontWeight="400"
                    mt={{ base: "4px", lgp: "4px" }}
                  >
                    {percentTwoDecimalPlace(
                      investmentLocationData.perNorthAmerica,
                    )}
                    %
                  </Text>
                </Box>
              </Flex>
            </Box>
          </GridItem>
          <GridItem
            w="100%"
            d={{ base: "block", md: "block", lgp: "block" }}
            flexDir={{ base: "row", md: "row", lgp: "column" }}
          >
            <Box>
              <Flex
                flexDir={{ base: "row", md: "row", lgp: "column" }}
                alignItems="center"
                justifyContent="center"
              >
                <Asia />
                <Box
                  aria-label={t("common:client.regions.asia")}
                  m={{
                    base: lang == "en" ? "0px 30px 0 60px" : "0px 30px 0 20px",
                    sm: "0px 30px 0 60px",
                    md: "0 30px",
                    lgp: "0px",
                  }}
                  textAlign="left"
                  minW={{ base: "120px", lgp: "unset" }}
                >
                  <Text
                    fontSize="18px"
                    color="#C7C7C7"
                    fontWeight="700"
                    mt={{ lgp: "16px" }}
                  >
                    {t("common:client.regions.asia")}
                  </Text>
                  <Text
                    fontSize="26px"
                    color="#FFFFFF"
                    fontWeight="400"
                    mt={{ base: "4px", lgp: "4px" }}
                  >
                    {percentTwoDecimalPlace(investmentLocationData.perAsia)}%
                  </Text>
                </Box>
              </Flex>
            </Box>
          </GridItem>
          <GridItem
            w="100%"
            d={{ base: "block", md: "block", lgp: "block" }}
            flexDir={{ base: "row", md: "row", lgp: "column" }}
          >
            <Box>
              <Flex
                flexDir={{ base: "row", md: "row", lgp: "column" }}
                alignItems="center"
                justifyContent="center"
              >
                <Europe />
                <Box
                  aria-label={t("common:client.regions.europe")}
                  m={{
                    base: lang == "en" ? "0px 30px 0 60px" : "0px 30px 0 20px",
                    sm: "0px 30px 0 60px",
                    md: "0 30px",
                    lgp: "0px",
                  }}
                  textAlign="left"
                  minW={{ base: "120px", lgp: "unset" }}
                >
                  <Text
                    fontSize="18px"
                    color="#C7C7C7"
                    fontWeight="700"
                    mt={{ lgp: "16px" }}
                  >
                    {t("common:client.regions.europe")}
                  </Text>
                  <Text
                    fontSize="26px"
                    color="#FFFFFF"
                    fontWeight="400"
                    mt={{ base: "4px", lgp: "4px" }}
                  >
                    {percentTwoDecimalPlace(investmentLocationData.perEurope)}%
                  </Text>
                </Box>
              </Flex>
            </Box>
          </GridItem>
          <GridItem
            w="100%"
            d={{ base: "block", md: "block", lgp: "block" }}
            flexDir={{ base: "row", md: "row", lgp: "column" }}
          >
            <Box>
              <Flex
                flexDir={{ base: "row", md: "row", lgp: "column" }}
                alignItems="center"
                justifyContent="center"
              >
                <Global />
                <Box
                  aria-label={t("common:client.regions.global")}
                  m={{
                    base: lang == "en" ? "0px 30px 0 60px" : "0px 30px 0 20px",
                    sm: "0px 30px 0 60px",
                    md: "0 30px",
                    lgp: "0px",
                  }}
                  textAlign="left"
                  minW={{ base: "120px", lgp: "unset" }}
                >
                  <Text
                    fontSize="18px"
                    color="#C7C7C7"
                    fontWeight="700"
                    mt={{ lgp: "16px" }}
                  >
                    {t("common:client.regions.global")}
                  </Text>
                  <Text
                    fontSize="26px"
                    color="#FFFFFF"
                    fontWeight="400"
                    mt={{ base: "4px", lgp: "4px" }}
                  >
                    {percentTwoDecimalPlace(investmentLocationData.perGlobal)}%
                  </Text>
                </Box>
              </Flex>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  )
}

export default InvestmentLocation
