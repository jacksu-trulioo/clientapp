import { Box, Grid, GridItem, Hide, Table, Text } from "@chakra-ui/react"
import moment from "moment"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment } from "react"

import { ChartAssets } from "~/components"
import {
  percentTwoDecimalPlace,
  roundCurrencyValue,
} from "~/utils/clientUtils/globalUtilities"

type PortfolioAllocationTableProps = {
  allocationTableData: AllocationTypeObject[]
  tablePage?: string
}

type AllocationTypeObject = {
  type: string
  data: dataTypeForDeal[]
}

type dataTypeForDeal = {
  name: string
  investmentVehicle: string
  initialInvestmentDate: string
  bookValue: number
  marketValue: number
  performance: {
    percent: number
  }
}

function PortfolioTable({
  allocationTableData,
  tablePage,
}: PortfolioAllocationTableProps) {
  const { t } = useTranslation("portfolioSummary")

  const getColor = (name: string) => {
    if (name == "privateEquity") {
      var color = "#B4985F"
      return color
    } else if (name == "cash") {
      var color = "#AED1DA"
      return color
    } else if (name == "otherIlliquid") {
      var color = "#738995"
      return color
    } else if (name == "yielding") {
      var color = "#624D70"
      return color
    } else if (name == "realEstate") {
      var color = "#E2F1F5"
      return color
    } else if (name == "alt") {
      var color = "#6FA485"
      return color
    } else if (name == "fixedIncome") {
      var color = "#9DCE62"
      return color
    }
  }

  return (
    <Box
      h={{ base: "auto", lgp: "670px" }}
      borderRadius={{ base: "0", lgp: "8px" }}
      overflow={{ base: "inherit", lgp: "auto" }}
    >
      <Hide below="lgp">
        <Box
          border="1px solid #222222"
          borderRadius="8px"
          d="flex"
          h="100%"
          flexDir="column"
        >
          <Box bg="rgba(34, 34, 34, 0.34)" border="1px solid #222222">
            <Grid
              templateColumns="repeat(7, 1fr)"
              alignItems="center"
              p="10px 50px 10px 40px"
            >
              <GridItem textAlign="left">
                <Text
                  fontSize="12px"
                  color="#C7C7C7"
                  fontWeight="700"
                  pl="25px"
                >
                  {tablePage == "Total Investment"
                    ? t("portfolioAllocation.table.tableHeader.investmentName")
                    : t(
                        "portfolioAllocation.table.tableHeader.assetClass",
                      )}{" "}
                </Text>
              </GridItem>
              <GridItem textAlign="center">
                <Text fontSize="12px" color="#C7C7C7" fontWeight="700">
                  {t("portfolioAllocation.table.tableHeader.dealName")}
                </Text>
              </GridItem>
              <GridItem textAlign="center">
                <Text fontSize="12px" color="#C7C7C7" fontWeight="700">
                  {t("portfolioAllocation.table.tableHeader.spv")}
                </Text>
              </GridItem>
              <GridItem textAlign="center">
                <Text fontSize="12px" color="#C7C7C7" fontWeight="700">
                  {t("portfolioAllocation.table.tableHeader.investmentAmount")}
                </Text>
              </GridItem>
              <GridItem textAlign="center">
                <Text fontSize="12px" color="#C7C7C7" fontWeight="700">
                  {t("portfolioAllocation.table.tableHeader.investmentDate")}
                </Text>
              </GridItem>
              <GridItem textAlign="center">
                <Text fontSize="12px" color="#C7C7C7" fontWeight="700">
                  {t("portfolioAllocation.table.tableHeader.marketValue")}
                </Text>
              </GridItem>
              <GridItem textAlign="center">
                <Text fontSize="12px" color="#C7C7C7" fontWeight="700">
                  {t(
                    "portfolioAllocation.table.tableHeader.performanceContribution",
                  )}
                </Text>
              </GridItem>
            </Grid>
          </Box>
          <Box h="100%" overflow="auto">
            {allocationTableData?.map(({ type, data = [] }, i) => (
              <Box key={i} bg="#222222" m="30px" borderRadius="6px" pb="15px">
                <Grid
                  templateColumns="repeat(7, 1fr)"
                  w="100%"
                  py="15px"
                  px="20px"
                  borderBottom="1px solid #313131"
                  fontSize="17px"
                  color="#C7C7C7"
                  fontWeight="400"
                  mb="10px"
                  textAlign="center"
                >
                  <GridItem colSpan={7}>
                    <ChartAssets
                      color={getColor(type) || `#E2F1F5`}
                      text={t(`common:client.assetClasses.${type}`)}
                      pageName={tablePage}
                    />
                  </GridItem>
                </Grid>
                {data.map(
                  (
                    {
                      name,
                      investmentVehicle,
                      initialInvestmentDate,
                      bookValue,
                      marketValue,
                      performance,
                    },
                    j,
                  ) => (
                    <Grid
                      key={j}
                      templateColumns="repeat(7, 1fr)"
                      p="10px 0 10px 0"
                    >
                      <GridItem w="100%" h="10"></GridItem>
                      <GridItem
                        w="100%"
                        d="flex"
                        flexDir={{ base: "column", md: "column" }}
                        justifyContent="center"
                        fontSize="12px"
                        color="#C7C7C7"
                        fontWeight="400"
                        colSpan="auto"
                        textAlign="left"
                      >
                        {name}
                      </GridItem>
                      <GridItem
                        w="100%"
                        d="flex"
                        flexDir={{ base: "column", md: "column" }}
                        justifyContent="center"
                        fontSize="12px"
                        color="#C7C7C7"
                        fontWeight="400"
                        colSpan="auto"
                        textAlign="center"
                      >
                        {investmentVehicle}
                      </GridItem>
                      <GridItem
                        w="100%"
                        d="flex"
                        flexDir={{ base: "column", md: "column" }}
                        justifyContent="center"
                        fontSize="12px"
                        color="#C7C7C7"
                        fontWeight="400"
                        colSpan="auto"
                        textAlign="center"
                      >
                        $ {roundCurrencyValue(bookValue)}
                      </GridItem>
                      <GridItem
                        w="100%"
                        d="flex"
                        flexDir={{ base: "column", md: "column" }}
                        justifyContent="center"
                        fontSize="12px"
                        color="#C7C7C7"
                        fontWeight="400"
                        colSpan="auto"
                        textAlign="center"
                      >
                        {moment(initialInvestmentDate).format("D.M.YYYY")}
                      </GridItem>
                      <GridItem
                        w="100%"
                        d="flex"
                        flexDir={{ base: "column", md: "column" }}
                        justifyContent="center"
                        fontSize="12px"
                        color="#C7C7C7"
                        fontWeight="400"
                        colSpan="auto"
                        textAlign="center"
                      >
                        $ {roundCurrencyValue(marketValue)}
                      </GridItem>
                      <GridItem
                        w="100%"
                        d="flex"
                        flexDir={{ base: "column", md: "column" }}
                        justifyContent="center"
                        fontSize="12px"
                        color="#C7C7C7"
                        fontWeight="400"
                        colSpan="auto"
                        textAlign="center"
                      >
                        {percentTwoDecimalPlace(performance?.percent)}%
                      </GridItem>
                    </Grid>
                  ),
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Hide>
      <Hide above="lgp">
        {/* need to add parent div here */}
        <Table p="20px 0 20px 0" mb="30px">
          {allocationTableData.map(({ type, data = [] }, i) => (
            <Fragment key={i}>
              <ChartAssets
                color={getColor(type) || `#E2F1F5`}
                text={t(`common:client.assetClasses.${type}`)}
                pageName=""
              />
              <Table mt="20px" fontSize="14px" pb="5px" pt="5px" mb="30px">
                {data.map(
                  (
                    {
                      name,
                      investmentVehicle,
                      initialInvestmentDate,
                      bookValue,
                      marketValue,
                      performance,
                    },
                    j,
                  ) => (
                    <Fragment key={j}>
                      <Table bg="#222" mb="10px">
                        <Text pt="15px" fontSize="14px" textAlign="center">
                          {name}
                        </Text>
                        <Grid
                          pl="15px"
                          pr="15px"
                          pt="5px"
                          pb="5px"
                          templateColumns="repeat(2, 1fr)"
                        >
                          <GridItem color="#aaa" pt="5px" pb="5px" w="100%">
                            {t("portfolioAllocation.table.tableHeader.spv")}
                          </GridItem>
                          <GridItem textAlign="end" pt="5px" pb="5px" w="100%">
                            {investmentVehicle}
                          </GridItem>
                        </Grid>
                        <Grid
                          pl="15px"
                          pr="15px"
                          pt="5px"
                          pb="5px"
                          templateColumns="repeat(2, 1fr)"
                        >
                          <GridItem color="#aaa" pt="5px" pb="5px" w="100%">
                            {t(
                              "portfolioAllocation.table.tableHeader.investmentAmount",
                            )}
                          </GridItem>
                          <GridItem textAlign="end" pt="5px" pb="5px" w="100%">
                            $ {roundCurrencyValue(bookValue)}
                          </GridItem>
                        </Grid>
                        <Grid
                          pl="15px"
                          pr="15px"
                          pt="5px"
                          pb="5px"
                          templateColumns="repeat(2, 1fr)"
                        >
                          <GridItem color="#aaa" pt="5px" pb="5px" w="100%">
                            {t(
                              "portfolioAllocation.table.tableHeader.investmentDate",
                            )}
                          </GridItem>
                          <GridItem textAlign="end" pt="5px" pb="5px" w="100%">
                            {moment(initialInvestmentDate).format("D.M.YYYY")}
                          </GridItem>
                        </Grid>
                        <Grid
                          pl="15px"
                          pt="5px"
                          pb="5px"
                          pr="15px"
                          templateColumns="repeat(2, 1fr)"
                        >
                          <GridItem color="#aaa" pt="5px" pb="5px" w="100%">
                            {t(
                              "portfolioAllocation.table.tableHeader.marketValue",
                            )}
                          </GridItem>
                          <GridItem textAlign="end" pt="5px" pb="5px" w="100%">
                            $ {roundCurrencyValue(marketValue)}
                          </GridItem>
                        </Grid>
                        <Grid
                          pl="15px"
                          pr="15px"
                          pt="5px"
                          pb="5px"
                          templateColumns="repeat(2, 1fr)"
                        >
                          <GridItem color="#aaa" pt="5px" pb="5px" w="100%">
                            {t(
                              "portfolioAllocation.table.tableHeader.performanceContribution",
                            )}
                          </GridItem>
                          <GridItem textAlign="end" pt="5px" pb="5px" w="100%">
                            {percentTwoDecimalPlace(performance?.percent)}%
                          </GridItem>
                        </Grid>
                      </Table>
                    </Fragment>
                  ),
                )}
              </Table>
            </Fragment>
          ))}
        </Table>
      </Hide>
    </Box>
  )
}

export default PortfolioTable
