import {
  Box,
  Flex,
  Grid,
  GridItem,
  Link,
  SimpleGrid,
  Text,
} from "@chakra-ui/react"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { PolygonDownIcon, PolygonIcon } from "~/components"
import { PerformanceMetrixProps } from "~/services/mytfo/types"
import {
  absoluteConvertCurrencyWithDollar,
  percentTwoDecimalPlace,
} from "~/utils/clientUtils/globalUtilities"

export default function PerformanceMetrics({
  metricsData,
}: PerformanceMetrixProps) {
  const { t, lang } = useTranslation("clientDashboard")

  return (
    <>
      <Flex>
        <Box w="100%">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="centers"
            w="100%"
            mb="15px"
          >
            <Text fontSize="18px" fontWeight="700" color="white">
              {" "}
              {t("portfolio.title")}
            </Text>
            <Link
              fontSize="14px"
              fontWeight="500"
              color="primary.500"
              display="flex"
              alignItems="center"
              onClick={() => {
                router.push("/client/portfolio-summary")
              }}
              outline="none"
              _hover={{
                textDecoration: "none",
              }}
              _focus={{
                boxShadow: "none",
              }}
            >
              {t("portfolio.button")}
              <svg
                style={{
                  marginLeft: lang.includes("en") ? "16px" : 0,
                  marginRight: lang.includes("ar") ? "16px" : 0,
                  transform: lang.includes("ar") ? "rotate(180deg)" : "none",
                }}
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.25478 11.7557L7.64793 6.4073C7.87517 6.18216 7.87517 5.81842 7.64793 5.5927L2.25478 0.244292C1.92673 -0.0814308 1.39301 -0.0814308 1.06439 0.244292C0.736349 0.570015 0.736349 1.09866 1.06439 1.42438L5.67794 6.00029L1.06439 10.575C0.736349 10.9013 0.736349 11.43 1.06439 11.7557C1.39301 12.0814 1.92673 12.0814 2.25478 11.7557Z"
                  fill="#B99855"
                />
              </svg>
            </Link>
          </Box>
        </Box>
      </Flex>
      <Box
        p={{ base: "32px 32px", md: "32px 40px" }}
        m="24px 0 30px"
        background="rgba(255, 255, 255, 0.03)"
        border="1px solid #4D4D4D"
        borderRadius="6px"
        mt="30px"
      >
        <SimpleGrid
          columns={{ base: 1, md: 1, lgp: 2 }}
          spacing={{ base: "32px", md: 10 }}
        >
          <GridItem>
            <SimpleGrid columns={1}>
              <GridItem
                textAlign="center"
                minH={{
                  base: "auto",
                  md: "120px",
                  lgp: lang.includes("ar") ? "120px" : "100px",
                }}
              >
                <Text
                  fontWeight="700"
                  color="gray.500"
                  fontSize="18px"
                  mb={{
                    base: "16px",
                    md: lang.includes("ar") ? "25px" : "16px",
                  }}
                >
                  {t("portfolio.portfolioMetricesData.totalAum")}
                </Text>
                <Box
                  d="flex"
                  style={{
                    direction: "ltr",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    fontSize={{
                      base: "22px",
                      md: "30px",
                      lgp: "22px",
                      xl: "30px",
                    }}
                    fontWeight="300"
                    lineHeight="120%"
                    mt={{ base: "0", md: "16px" }}
                    style={{
                      direction: "ltr",
                      justifyContent: lang.includes("ar") ? "center" : "",
                    }}
                  >
                    {absoluteConvertCurrencyWithDollar(
                      metricsData.totalAumValue,
                    )}
                  </Text>{" "}
                </Box>
              </GridItem>
              <GridItem
                textAlign="center"
                minH={{ base: "120px", md: "120px", lgp: "100px" }}
                pt={{ base: "32px", md: "30px" }}
                margin={{
                  base: "32px auto 0",
                  lgp: "15px auto 0",
                  xl: "20px auto 0",
                }}
                borderTop="1px solid #4d4d4d"
                borderBottom={{
                  base: "1px solid #4d4d4d",
                  md: "1px solid #4d4d4d",
                  lgp: "none",
                }}
                pb="32px"
                width="100%"
              >
                <Text
                  fontWeight="700"
                  color="gray.500"
                  fontSize="18px"
                  mb={{
                    base: "16px",
                    md: lang.includes("ar") ? "25px" : "16px",
                  }}
                >
                  {t("portfolio.portfolioMetricesData.netChange")}
                </Text>
                <Flex
                  align="center"
                  justifyContent="center"
                  style={{
                    direction: "ltr",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    mt={{ base: "0", md: "16px" }}
                    fontSize={{
                      base: "22px",
                      md: "30px",
                      lgp: "22px",
                      xl: "30px",
                    }}
                    fontWeight="300"
                  >
                    {absoluteConvertCurrencyWithDollar(
                      metricsData?.netChangeValue?.money,
                    ) || 0}{" "}
                  </Text>
                </Flex>
              </GridItem>
            </SimpleGrid>
          </GridItem>
          <GridItem>
            <SimpleGrid columns={1}>
              <GridItem
                textAlign="center"
                minH={{ base: "120px", md: "120px", lgp: "100px" }}
                pb="32px"
              >
                <Text
                  fontWeight="700"
                  color="gray.500"
                  mb="16px"
                  fontSize="18px"
                >
                  {t("portfolio.portfolioMetricesData.performance.title")}
                </Text>
                <Grid
                  d={{ base: "grid", md: "flex", lgp: "flex" }}
                  justifyContent={{
                    base: "space-between",
                    md: "space-between",
                    lgp: "space-around",
                  }}
                  m={{ base: "0", sm: "0", md: "0 70px", lgp: "0" }}
                  pt={{ base: "0", md: "30px", lgp: "0" }}
                  templateColumns={{
                    base: "repeat(1, 1fr)",
                    sm: "repeat(1, 1fr)",
                    md: "repeat(3, 1fr)",
                    lgp: "repeat(3, 1fr)",
                  }}
                >
                  <GridItem
                    marginBottom={{ base: "0", md: "10px", lgp: "0px" }}
                    marginTop={{ base: "16px", sm: "16px", md: "0", lgp: "0" }}
                    margin={{
                      sm: "16px 0 auto",
                      base: "0 auto",
                      md: "0",
                      lgp: "inherit",
                    }}
                  >
                    <Box
                      d={{ base: "inline-block", md: "block" }}
                      minW={{ base: "120px", md: "auto" }}
                      textAlign={{ base: "left", md: "start" }}
                      ms={{ base: "30px", md: "0" }}
                    >
                      <Text
                        color="gray.500"
                        fontSize="14px"
                        fontWeight="normal"
                        textAlign="left"
                        ml={{
                          base: lang.includes("en") ? "21px" : 0,
                          md: lang.includes("en") ? "26px" : 0,
                        }}
                      >
                        {t(
                          "portfolio.portfolioMetricesData.performance.labels.ytd",
                        )}
                      </Text>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={
                          lang.includes("ar") ? "flex-end" : "flex-start"
                        }
                        style={{
                          direction: "ltr",
                        }}
                      >
                        <Text
                          fontSize={{
                            base: "22px",
                            md: "30px",
                            lgp: "22px",
                            xl: "30px",
                          }}
                          color={`${
                            metricsData.ytdGrowth.direction == "upwards"
                              ? "green.500"
                              : "red.500"
                          }`}
                          fontWeight="thin"
                          ml={{
                            base: "0",
                            md: lang.includes("ar") ? "0" : "5px",
                          }}
                          mr={lang.includes("ar") ? "5px" : "0"}
                          display="inline-flex"
                          direction="ltr"
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <Text style={{ marginRight: "5px" }}>
                            {metricsData.ytdGrowth.direction == "upwards" ? (
                              <PolygonIcon width={4} />
                            ) : (
                              <PolygonDownIcon width={4} />
                            )}
                          </Text>
                          <Text>
                            {percentTwoDecimalPlace(
                              metricsData.ytdGrowth.percent,
                            )}
                            %
                          </Text>
                        </Text>
                      </Box>
                    </Box>
                  </GridItem>
                  <GridItem
                    marginBottom={{ base: "0", md: "10px", lgp: "0px" }}
                    margin={{
                      sm: "16px 0 auto",
                      base: "16px 0 auto",
                      md: "0",
                      lgp: "inherit",
                    }}
                  >
                    <Box
                      d={{ base: "inline-block", md: "block" }}
                      minW={{ base: "120px", md: "auto" }}
                      textAlign={{ base: "left", md: "start" }}
                      ms={{ base: "30px", md: "0" }}
                    >
                      <Text
                        color="gray.500"
                        fontSize="14px"
                        fontWeight="normal"
                        textAlign="left"
                        ml={{
                          base: lang.includes("en") ? "21px" : 0,
                          md: lang.includes("en") ? "26px" : 0,
                        }}
                      >
                        {t(
                          "portfolio.portfolioMetricesData.performance.labels.itd",
                        )}
                      </Text>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={
                          lang.includes("ar") ? "flex-end" : "flex-start"
                        }
                        style={{
                          direction: lang.includes("ar") ? "ltr" : "revert",
                        }}
                      >
                        <Text
                          fontSize={{
                            base: "22px",
                            md: "30px",
                            lgp: "22px",
                            xl: "30px",
                          }}
                          color={`${
                            metricsData.itdGrowth.direction == "upwards"
                              ? "green.500"
                              : "red.500"
                          }`}
                          fontWeight="thin"
                          ml={{
                            base: "0",
                            md: lang.includes("ar") ? "0" : "5px",
                          }}
                          display="inline-flex"
                          direction="rtl"
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <Flex me="5px">
                            {metricsData.itdGrowth.direction == "upwards" ? (
                              <PolygonIcon width={4} />
                            ) : (
                              <PolygonDownIcon width={4} />
                            )}
                          </Flex>
                          <Text>
                            {" "}
                            {percentTwoDecimalPlace(
                              metricsData.itdGrowth.percent,
                            )}
                            %
                          </Text>
                        </Text>
                      </Box>
                    </Box>
                  </GridItem>
                  <GridItem
                    marginBottom={{ base: "0px", md: "0", lgp: "0px" }}
                    marginTop={{ base: "16px", sm: "16px", md: "0", lgp: "0" }}
                  >
                    <Box
                      d={{ base: "inline-block", md: "block" }}
                      minW={{ base: "120px", md: "auto" }}
                      textAlign={{ base: "left", md: "start" }}
                      ms={{ base: "30px", md: "0" }}
                    >
                      <Text
                        color="gray.500"
                        fontSize="14px"
                        fontWeight="normal"
                        textAlign="start"
                        ms={{
                          base: lang.includes("en") ? "21px" : 0,
                          md: lang.includes("en") ? "22px" : 0,
                        }}
                      >
                        {t(
                          "portfolio.portfolioMetricesData.performance.labels.annualized",
                        )}
                      </Text>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={
                          lang.includes("ar") ? "flex-end" : "flex-start"
                        }
                        style={{
                          direction: lang.includes("ar") ? "ltr" : "revert",
                        }}
                      >
                        <Text
                          fontSize={{
                            base: "22px",
                            md: "30px",
                            lgp: "22px",
                            xl: "30px",
                          }}
                          color={`${
                            metricsData.annualizedGrowth.direction == "upwards"
                              ? "green.500"
                              : "red.500"
                          }`}
                          fontWeight="thin"
                          display="inline-flex"
                          direction="rtl"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Flex me="5px">
                            {metricsData.annualizedGrowth.direction ==
                            "upwards" ? (
                              <PolygonIcon width={4} />
                            ) : (
                              <PolygonDownIcon width={4} />
                            )}{" "}
                          </Flex>
                          <Text>
                            {" "}
                            {percentTwoDecimalPlace(
                              metricsData.annualizedGrowth.percent,
                            )}
                            %
                          </Text>
                        </Text>
                      </Box>
                    </Box>
                  </GridItem>
                </Grid>
              </GridItem>
              <GridItem
                textAlign="center"
                minH={{ base: "120px", md: "120px", lgp: "100px" }}
                pt="32px"
                borderTop="1px solid #4d4d4d"
                width="100%"
              >
                <Text fontSize="18px" fontWeight="bold" color="gray.500">
                  {t("portfolio.portfolioMetricesData.irr.title")}
                </Text>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  style={{
                    direction: lang.includes("ar") ? "ltr" : "revert",
                  }}
                  marginTop={{
                    base: "16px",
                    md: "16px",
                    lgp: "16px",
                    xl: "16px",
                  }}
                >
                  <Text
                    fontSize={{
                      base: "22px",
                      md: "30px",
                      lgp: "22px",
                      xl: "30px",
                    }}
                    color={`${
                      metricsData.irrGrowth.direction == "upwards"
                        ? "green.500"
                        : metricsData.irrGrowth.direction == "downwards"
                        ? "red.500"
                        : "contrast.200"
                    }`}
                    fontWeight="thin"
                    ml={{ md: "5px", base: "-10px" }}
                    display="inline-flex"
                    direction="rtl"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text
                      style={{ marginRight: "5px" }}
                      d="flex"
                      alignItems="center"
                    >
                      {" "}
                      {metricsData.irrGrowth.direction == "upwards" ? (
                        <PolygonIcon width={4} />
                      ) : metricsData.irrGrowth.direction == "downwards" ? (
                        <PolygonDownIcon width={4} />
                      ) : (
                        false
                      )}
                    </Text>
                    <Text>
                      {percentTwoDecimalPlace(metricsData.irrGrowth.percent)}%
                    </Text>
                  </Text>
                </Box>

                <Text
                  color="gray.500"
                  fontSize="14px"
                  fontWeight="normal"
                  mt="16px"
                  fontStyle="italic"
                >
                  {t("portfolio.portfolioMetricesData.irr.disclaimer")}
                </Text>
              </GridItem>
            </SimpleGrid>
          </GridItem>
        </SimpleGrid>
      </Box>
    </>
  )
}
