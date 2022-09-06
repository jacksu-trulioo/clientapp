import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react"
import moment from "moment"
import useTranslation from "next-translate/useTranslation"
import { Fragment } from "react"

import RightArrowInIcon from "~/components/Icon/RightArrowInIcon"
import ChartAssets from "~/components/PortfolioAllocationChart/ChartAssets"
import {
  absoluteConvertCurrencyWithDollar,
  percentTwoDecimalPlace,
} from "~/utils/clientUtils/globalUtilities"
type DesktopTable = {
  tableHeader?: TableHeaderType[]
  tableBodyData?: [
    {
      bodyData: dataTypeForDeal[]
      header: string
      headerSize: number
      colspan?: number
      style: {}
      labelColor?: string
      onClickRedirect?: (path: string, dealId?: number | string) => void
    },
  ]
  tableGridSize: number
  isHeaderLegend?: boolean
  isHeader?: boolean
  isArrow?: boolean
  isRowNotClickable?: boolean
}
type TableHeaderType = {
  headerSize: number
  name: string
  colspan?: number
  style: {}
  textAlign:
    | "center"
    | "end"
    | "justify"
    | "left"
    | "match-parent"
    | "right"
    | "start"
}
type dataTypeForDeal = {
  id: number
  name: string
  investmentVehicle: string
  initialInvestmentDate: string
  bookValue: number
  marketValue: number
  performance: {
    percent: number
  }
}
const DesktopTableVarientOne = ({
  tableHeader,
  tableGridSize,
  tableBodyData,
  isHeaderLegend,
  isHeader = true,
  isArrow,
  isRowNotClickable,
}: DesktopTable) => {
  const { lang } = useTranslation()
  return (
    <Fragment>
      {isHeader ? (
        <Box
          bg="gray.800"
          border="1px solid #222222"
          position="sticky"
          top="0"
          zIndex="1"
        >
          <Grid
            aria-label="SPV Table Header"
            role={"group"}
            templateColumns={`repeat(${tableGridSize}, 1fr)`}
            alignItems="center"
            p="10px 16px"
          >
            {tableHeader?.map(({ name, textAlign, colspan }, i) => (
              <GridItem
                key={i}
                colSpan={colspan}
                textAlign={textAlign}
                p="0 15px"
              >
                <Text fontSize="12px" color="#C7C7C7" fontWeight="700">
                  {name}
                </Text>
              </GridItem>
            ))}
          </Grid>
        </Box>
      ) : (
        false
      )}
      <Box d="flex" flexDir="column">
        <Box>
          {tableBodyData?.map(
            ({ header, bodyData, onClickRedirect, labelColor }, k) => (
              <Box
                aria-label="SPV Box"
                role={"group"}
                bg="#222222"
                m="16px 16px"
                key={k}
                borderRadius="6px"
                pb="15px"
              >
                <Grid
                  templateColumns={`repeat(${6}, 1fr)`}
                  py="15px"
                  px="20px"
                  borderBottom="1px solid #313131"
                  fontSize="14px"
                  color="#C7C7C7"
                  fontWeight="400"
                  mb="10px"
                >
                  {isHeaderLegend ? (
                    <GridItem colSpan={tableGridSize}>
                      <ChartAssets color={labelColor || ""} text={header} />
                    </GridItem>
                  ) : (
                    <Text aria-label="SPV Name Header" role={"heading"}>
                      {header}
                    </Text>
                  )}
                </Grid>
                {bodyData.map(
                  (
                    {
                      name,
                      investmentVehicle,
                      initialInvestmentDate,
                      bookValue,
                      marketValue,
                      performance,
                      id,
                    },
                    j,
                  ) => (
                    <Grid
                      aria-label={`Deal Row ${j + 1}`}
                      role={"row"}
                      key={j}
                      _odd={{
                        backgroundColor: "#00000026",
                      }}
                      templateColumns={`repeat(${tableGridSize}, 1fr)`}
                      p="10px 0 10px 0"
                      cursor={isRowNotClickable ? "inherit" : "pointer"}
                      onClick={() => {
                        if (onClickRedirect) {
                          onClickRedirect(`/client/investment-detail`, id)
                        }
                      }}
                    >
                      <GridItem
                        w="100%"
                        h="10"
                        p="0 15px"
                        colSpan={3}
                      ></GridItem>
                      <GridItem
                        aria-label={
                          tableHeader ? tableHeader[1].name : "Deal Name"
                        }
                        role={"cell"}
                        w="100%"
                        d="flex"
                        flexDir={{ base: "column", md: "column" }}
                        justifyContent="center"
                        fontSize="14px"
                        color="#C7C7C7"
                        fontWeight="400"
                        colSpan={3}
                        textAlign="left"
                        p="0 15px"
                      >
                        {name}
                      </GridItem>
                      <GridItem
                        aria-label={tableHeader ? tableHeader[2].name : "SPV"}
                        role={"cell"}
                        w="100%"
                        d="flex"
                        flexDir={{ base: "column", md: "column" }}
                        justifyContent="center"
                        fontSize="14px"
                        color="#C7C7C7"
                        fontWeight="400"
                        colSpan={2}
                        style={{
                          textAlign: lang.includes("ar") ? "right" : "left",
                        }}
                        p="0 15px"
                      >
                        {investmentVehicle}
                      </GridItem>
                      <GridItem
                        aria-label={
                          tableHeader ? tableHeader[4].name : "Investment Date"
                        }
                        role={"cell"}
                        w="100%"
                        d="flex"
                        flexDir={{ base: "column", md: "column" }}
                        justifyContent="center"
                        fontSize="14px"
                        color="#C7C7C7"
                        fontWeight="400"
                        style={{
                          textAlign: lang.includes("en") ? "end" : "start",
                        }}
                        p="0 15px"
                        colSpan={3}
                      >
                        {moment(initialInvestmentDate).format("DD/MM/YYYY")}
                      </GridItem>
                      <GridItem
                        aria-label={
                          tableHeader
                            ? tableHeader[3].name
                            : "Investment Amount"
                        }
                        role={"cell"}
                        w="100%"
                        d="flex"
                        flexDir={{ base: "column", md: "column" }}
                        justifyContent="center"
                        fontSize="14px"
                        color="#C7C7C7"
                        fontWeight="400"
                        colSpan={3}
                        style={{
                          textAlign: "end",
                        }}
                        p="0 15px"
                        dir="ltr"
                      >
                        {absoluteConvertCurrencyWithDollar(bookValue)}
                      </GridItem>
                      <GridItem
                        aria-label={
                          tableHeader ? tableHeader[5].name : "Market Value"
                        }
                        role={"cell"}
                        w="100%"
                        d="flex"
                        flexDir={{ base: "column", md: "column" }}
                        justifyContent="center"
                        fontSize="14px"
                        color="#C7C7C7"
                        fontWeight="400"
                        colSpan={3}
                        style={{
                          textAlign: "end",
                        }}
                        p="0 15px"
                        dir="ltr"
                      >
                        {absoluteConvertCurrencyWithDollar(marketValue)}
                      </GridItem>
                      <GridItem
                        aria-label={
                          tableHeader
                            ? tableHeader[6].name
                            : "Performance Contribution(%)"
                        }
                        role={"cell"}
                        w="100%"
                        d="flex"
                        flexDir={{ base: "column", md: "column" }}
                        justifyContent="center"
                        fontSize="14px"
                        color="#C7C7C7"
                        fontWeight="400"
                        colSpan={3}
                        textAlign="end"
                        p="0 15px"
                        alignItems="flex-end"
                      >
                        <Flex alignItems="center">
                          <Box mr="8px">
                            {percentTwoDecimalPlace(performance?.percent)}%
                          </Box>
                          {isArrow && (
                            <Box>
                              <RightArrowInIcon
                                transform={
                                  lang.includes("ar")
                                    ? "rotate(-180deg)"
                                    : "inherit"
                                }
                              />
                            </Box>
                          )}
                        </Flex>
                      </GridItem>
                    </Grid>
                  ),
                )}
              </Box>
            ),
          )}
        </Box>
      </Box>
    </Fragment>
  )
}
export default DesktopTableVarientOne
