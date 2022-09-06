import { Box, Center, Flex, Grid, GridItem, Text } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment } from "react"

import { Card, CardContent } from "~/components"
import { roundCurrencyValue } from "~/utils/clientUtils/globalUtilities"

type recentDealPops = {
  viewType: string
  valutionDate: string
  activityData: {
    month: number
    moneyInvested: number
    recentFunding: number
    distribution: {
      capitalGain: number
      incomeDistribution: number
    }
  }
}
export default function RecentDealsCard({
  viewType,
  activityData,
  valutionDate,
}: recentDealPops) {
  const { lang, t } = useTranslation("portfolioSummary")

  const getColor = (dataValue: number) => {
    return dataValue > 0
      ? "green.500"
      : dataValue < 0
      ? "red.500"
      : "contrast.200"
  }

  return (
    <Fragment>
      {viewType == "all" ? (
        <Card
          aria-label="Recent Activity"
          role={"grid"}
          bg="rgba(255, 255, 255, 0.03)"
          boxShadow="none"
          border="1px solid #4d4d4d"
        >
          <CardContent>
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                lgp: "repeat(12, 1fr)",
              }}
              // minHeight="240px"
            >
              <GridItem colSpan={3}>
                <Flex
                  aria-label="Recent Funding"
                  role={"gridcell"}
                  flexDirection="column"
                  justifyContent="space-between"
                  height="100%"
                  textAlign="center"
                  padding="30px 0"
                  borderRight={{
                    lgp: "1px solid #4d4d4d",
                  }}
                  borderBottom={{
                    base: "1px solid #4d4d4d",
                    md: "1px solid #4d4d4d",
                    lgp: "0px",
                    xl: "0px",
                  }}
                >
                  <Box>
                    <Text
                      color="gray.500"
                      fontSize="18px"
                      fontWeight="bold"
                      mb="5px"
                    >
                      {t("recentActivity.recentFunding.title")}
                    </Text>
                    <Text color="gray.500" fontSize="14px" fontWeight="400">
                      {t("recentActivity.recentFunding.description", {
                        month: activityData.month,
                      })}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color="green.500"
                      fontSize={{
                        base: "30px",
                        md: "26px",
                        lgp: "30px",
                      }}
                      fontWeight="100"
                    >
                      {activityData.recentFunding}
                    </Text>
                  </Box>
                </Flex>
              </GridItem>
              <GridItem colSpan={4}>
                <Flex
                  aria-label="Money Invested"
                  role={"gridcell"}
                  flexDirection="column"
                  justifyContent="space-between"
                  height="100%"
                  textAlign="center"
                  padding="30px 0"
                  borderRight={{
                    lgp: "1px solid #4d4d4d",
                  }}
                  borderBottom={{
                    base: "1px solid #4d4d4d",
                    lgp: "0px",
                    xl: "0px",
                    md: "1px solid #4d4d4d",
                  }}
                >
                  <Box>
                    <Text
                      color="gray.500"
                      align="center"
                      fontSize="18px"
                      fontWeight="bold"
                      mb="20px"
                    >
                      {t("recentActivity.investedOpportunities")}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={getColor(activityData.moneyInvested)}
                      fontSize={{
                        base: "30px",
                        md: "26px",
                        lgp: "30px",
                      }}
                      fontWeight="100"
                      style={{
                        direction: "ltr",
                      }}
                    >
                      $
                      {roundCurrencyValue(Math.abs(activityData.moneyInvested))}
                    </Text>
                  </Box>
                </Flex>
              </GridItem>
              <GridItem colSpan={5}>
                <Flex
                  aria-label="Distributions"
                  role={"gridcell"}
                  flexDirection="column"
                  justifyContent="space-between"
                  height="100%"
                  textAlign="center"
                  padding="30px 0"
                >
                  <Box>
                    <Text
                      color="gray.500"
                      align="center"
                      fontSize="18px"
                      fontWeight="bold"
                      mb="20px"
                    >
                      {t("recentActivity.distributionReceived.title")}
                    </Text>
                    <Grid
                      d={{
                        md: "inline-grid",
                        lgp: "grid",
                      }}
                      gap={{
                        md: "30px",
                        lgp: "inherit",
                      }}
                      templateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                      }}
                    >
                      <GridItem>
                        <Box
                          aria-label="Capital Gains"
                          role={"gridcell"}
                          d="inline-block"
                          textAlign={{ base: "center", md: "left" }}
                        >
                          <Text
                            color="gray.500"
                            fontSize="14px"
                            fontWeight="400"
                            mb="4px"
                            ml={{
                              base: "0",
                              md: "0",
                              lgp: lang.includes("ar") ? "0" : "28px",
                            }}
                          >
                            {t(
                              "recentActivity.distributionReceived.labels.capitalGains",
                            )}
                          </Text>
                          <Text
                            color={getColor(
                              activityData.distribution.capitalGain,
                            )}
                            fontSize={{
                              base: "30px",
                              md: "26px",
                              lgp: "30px",
                            }}
                            fontWeight="100"
                            whiteSpace="nowrap"
                            style={{
                              direction: "ltr",
                            }}
                          >
                            $
                            {roundCurrencyValue(
                              Math.abs(activityData.distribution.capitalGain),
                            )}
                          </Text>
                        </Box>
                      </GridItem>
                      <GridItem>
                        <Box
                          aria-label="Income Distributions"
                          role={"gridcell"}
                          d="inline-block"
                          textAlign={{ base: "center", md: "left" }}
                        >
                          <Text
                            color="gray.500"
                            fontSize="14px"
                            fontWeight="400"
                            mb="4px"
                            mt={{ base: "40px", md: "0" }}
                            ml={{
                              base: "0",
                              md: "0",
                              lgp: lang.includes("ar") ? "0" : "26px",
                            }}
                          >
                            {t(
                              "recentActivity.distributionReceived.labels.income",
                            )}
                          </Text>
                          <Text
                            color={getColor(
                              activityData.distribution.incomeDistribution,
                            )}
                            fontSize={{
                              base: "30px",
                              md: "26px",
                              lgp: "30px",
                            }}
                            fontWeight="100"
                            whiteSpace="nowrap"
                            style={{
                              direction: "ltr",
                            }}
                          >
                            $
                            {roundCurrencyValue(
                              Math.abs(
                                activityData.distribution.incomeDistribution,
                              ),
                            )}
                          </Text>
                        </Box>
                      </GridItem>
                    </Grid>
                  </Box>
                </Flex>
              </GridItem>
            </Grid>
          </CardContent>
        </Card>
      ) : viewType == "moneyInvested" || viewType == "distribution" ? (
        <Flex flexDirection={{ base: "column", lgp: "row", md: "column" }}>
          <Card
            aria-label="Recent Activity"
            role={"grid"}
            bg="rgba(255, 255, 255, 0.03)"
            mr={{ base: "0", lgp: "10px" }}
            mb={{ base: "10px", lgp: "0" }}
            boxShadow="none"
            border="1px solid #4d4d4d"
            width={{
              base: "full", // 0-48em
              lgp: "50%", // 48em-80em,
              xl: "50%",
            }}
          >
            <CardContent p="22px">
              <Box
                aria-label="Recent Funding"
                role={"gridcell"}
                padding="10px"
                paddingTop={{
                  lgp: "10px",
                  base: "15px",
                  md: "15px",
                }}
              >
                <Center flexDirection="column">
                  <Text
                    color="gray.500"
                    fontSize="18px"
                    fontWeight="bold"
                    mb="4px"
                  >
                    {t("recentActivity.recentFunding.title")}
                  </Text>
                  <Text
                    color="gray.500"
                    fontSize="14px"
                    fontWeight="300"
                    mb="16px"
                  >
                    {t("recentActivity.recentFunding.description", {
                      month: activityData.month,
                    })}
                  </Text>
                  <Text
                    color="green.500"
                    fontSize={{
                      base: "30px",
                      md: "26px",
                      lgp: "30px",
                    }}
                    fontWeight="100"
                  >
                    {activityData.recentFunding}
                  </Text>
                </Center>
              </Box>
            </CardContent>
          </Card>
          {viewType == "moneyInvested" ? (
            <Card
              bg="rgba(255, 255, 255, 0.03)"
              ml={{ base: "0", lgp: "10px" }}
              boxShadow="none"
              border="1px solid #4d4d4d"
              width={{
                base: "full", // 0-48em
                lgp: "50%", // 48em-80em,
                xl: "50%",
              }}
            >
              <CardContent p="22px">
                <Box
                  aria-label="Money Invested"
                  role={"gridcell"}
                  padding="10px"
                  paddingTop={{
                    lgp: "10px",
                    base: "15px",
                    md: "15px",
                  }}
                >
                  <Center flexDirection="column">
                    <Text align="center"></Text>
                    <Text
                      color="gray.500"
                      align="center"
                      fontSize="18px"
                      fontWeight="bold"
                      mb="16px"
                    >
                      {t("recentActivity.investedOpportunities")}
                    </Text>
                    <Text
                      color={getColor(activityData.moneyInvested)}
                      fontSize={{
                        base: "30px",
                        md: "26px",
                        lgp: "30px",
                      }}
                      fontWeight="100"
                      dir="ltr"
                    >
                      $
                      {roundCurrencyValue(
                        Math.abs(activityData?.moneyInvested),
                      )}
                    </Text>
                  </Center>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card
              bg="rgba(255, 255, 255, 0.03)"
              ml={{ base: "0", lgp: "10px" }}
              boxShadow="none"
              border="1px solid #4d4d4d"
              width={{
                base: "full", // 0-48em
                lgp: "50%", // 48em-80em,
                xl: "50%",
              }}
            >
              <CardContent p="22px">
                <Box
                  padding="10px"
                  paddingTop={{
                    lgp: "10px",
                    base: "15px",
                    md: "15px",
                  }}
                >
                  <Center flexDirection="column">
                    <Text
                      color="gray.500"
                      align="center"
                      fontSize="18px"
                      fontWeight="bold"
                      mb="16px"
                    >
                      {t("recentActivity.distributionReceived.title")}
                    </Text>
                    <Box
                      justify="space-between"
                      display="flex"
                      flexDirection={{
                        base: "column",
                        md: "row",
                      }}
                    >
                      <Box
                        aria-label="Capital Gains"
                        role={"gridcell"}
                        paddingBottom={{ base: "10px", lgp: "0px", md: "10px" }}
                        paddingRight={{ base: "0", md: "20px" }}
                        marginBottom={{ base: "16px", lgp: "0" }}
                        textAlign={{ base: "center", md: "left" }}
                      >
                        <Text
                          color="gray.500"
                          fontSize="14px"
                          fontWeight="400"
                          marginBottom="4px"
                          ml={{
                            base: "0",
                            md: "0",
                            lgp: lang.includes("ar") ? "0" : "25px",
                          }}
                        >
                          {t(
                            "recentActivity.distributionReceived.labels.capitalGains",
                          )}
                        </Text>
                        <Text
                          color={getColor(
                            activityData.distribution.capitalGain,
                          )}
                          fontSize={{
                            base: "30px",
                            md: "26px",
                            lgp: "30px",
                          }}
                          fontWeight="100"
                          dir="ltr"
                        >
                          $
                          {roundCurrencyValue(
                            Math.abs(activityData.distribution.capitalGain),
                          )}
                        </Text>
                      </Box>
                      <Box
                        aria-label="Income Distributions"
                        role={"gridcell"}
                        paddingBottom={{ base: "10px", lgp: "0px", md: "10px" }}
                        paddingLeft={{ base: "0", md: "20px" }}
                        textAlign={{ base: "center", md: "left" }}
                      >
                        <Text
                          color="gray.500"
                          fontSize="14px"
                          fontWeight="400"
                          marginBottom="4px"
                          ml={{
                            base: "0",
                            md: "0",
                            lgp: lang.includes("ar") ? "0" : "25px",
                          }}
                        >
                          {t(
                            "recentActivity.distributionReceived.labels.income",
                          )}
                        </Text>
                        <Text
                          color={getColor(
                            activityData.distribution.incomeDistribution,
                          )}
                          fontSize={{
                            base: "30px",
                            md: "26px",
                            lgp: "30px",
                          }}
                          fontWeight="100"
                          dir="ltr"
                        >
                          $
                          {roundCurrencyValue(
                            Math.abs(
                              activityData.distribution.incomeDistribution,
                            ),
                          )}
                        </Text>
                      </Box>
                    </Box>
                  </Center>
                </Box>
              </CardContent>
            </Card>
          )}
        </Flex>
      ) : (
        false
      )}

      <Center>
        <Text
          fontStyle="italic"
          fontSize="14px"
          color="gray.500"
          marginTop="16px"
          marginBottom={{ base: "70px", lgp: "72px" }}
        >
          {t("recentActivity.disclaimer", {
            valuationDate: valutionDate,
          })}
        </Text>
      </Center>
    </Fragment>
  )
}
