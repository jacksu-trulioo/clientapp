import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { Box, Flex, Grid, GridItem, Hide, Show, Text } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"

import { QuarterTabs } from "~/components"
import {
  bond,
  indices,
  stock,
  WatchlistResponse,
} from "~/services/mytfo/clientTypes"
import {
  percentTwoDecimalPlace,
  roundPercentValue,
  roundValueWithoutAbsolute,
} from "~/utils/clientUtils/globalUtilities"

type watchlist = {
  WatchlistData: WatchlistResponse
}
const MarketWatchlist = (WatchlistData: watchlist) => {
  const { lang, t } = useTranslation("insights")
  const [activeState, setActiveState] = useState<string | number>("indices")
  const [isFX, setIsFX] = useState<boolean>(false)
  const [isStock, setIsStock] = useState<boolean>(false)
  const [isBond, setIsBond] = useState<boolean>(false)

  var [options] = useState([
    {
      value: "indices",
      label: t("marketSimplified.label.indices"),
    },
    {
      value: "stock",
      label: t("marketSimplified.label.stock"),
    },
    {
      value: "bond",
      label: t("marketSimplified.label.bonds"),
    },
    {
      value: "fx",
      label: t("marketSimplified.label.fx"),
    },
  ])
  const [fxData, setFxData] = useState<indices>()
  const [stockData, setStockData] = useState<stock>()
  const [bondData, setBondData] = useState<bond>()
  const [indicesData, setIndicesData] = useState<indices>(
    WatchlistData.WatchlistData.indices,
  )

  const changeActiveFilter = (value: string | number) => {
    setActiveState(value)
    if (value == "stock") {
      var getStockData = WatchlistData.WatchlistData["stock"]
      setStockData(getStockData)
      setIsStock(true)
      setIsBond(false)
      setIsFX(false)
    } else if (value == "bond") {
      var getBondData = WatchlistData.WatchlistData["bond"]
      setBondData(getBondData)
      setIsBond(true)
      setIsStock(false)
      setIsFX(false)
    } else if (value == "fx") {
      var getFxData = WatchlistData.WatchlistData.indices.filter(function (
        obj,
      ) {
        if (obj.indexFXCurrencyCode !== "") {
          return true
        }
      })
      setFxData(getFxData)
      setIsFX(true)
      setIsBond(false)
      setIsStock(false)
    } else {
      var getIndicesData = WatchlistData.WatchlistData["indices"]
      setIndicesData(getIndicesData)
      setIsFX(false)
      setIsBond(false)
      setIsStock(false)
    }
  }

  return (
    <Box mt={{ base: "32px", lgp: "72px" }}>
      <Flex mb="32px" justifyContent="space-between">
        {" "}
        <Text fontSize="18px" color="#ffffff" fontWeight="700">
          {t("marketSimplified.label.watchlist")}
        </Text>
        <Box>
          <Box d={{ lgp: "block", md: "block", base: "none" }}>
            <QuarterTabs
              viewType="desktop"
              options={options}
              activeOption={activeState}
              changeActiveFilter={changeActiveFilter}
            />
          </Box>
          <Box d={{ lgp: "none", md: "none", base: "block" }}>
            <QuarterTabs
              options={options}
              activeOption={activeState}
              changeActiveFilter={changeActiveFilter}
              viewType="mobile"
            />
          </Box>
        </Box>
      </Flex>

      {isBond ? (
        <>
          <Hide below="md">
            <Box
              p={{ lgp: "32px", md: "16px", base: "14px" }}
              bg="#222222"
              borderRadius="6px"
              alignSelf="stretch"
              margin="24px 0px"
            >
              <Flex
                aria-label="Bonds"
                role={"group"}
                justifyContent="space-between"
              >
                <Box w="17%">
                  <Text textAlign="center" h="20px" mb="20px"></Text>
                  <Grid
                    templateColumns="repeat(1, 1fr)"
                    borderBottom="1px solid #4d4d4d"
                  >
                    <GridItem pb="10px" fontSize="12px" color="gray.400">
                      {t("marketSimplified.marketSimplifiedTable.country")}
                    </GridItem>
                  </Grid>
                  {bondData?.map((item, i) => (
                    <Grid templateColumns="repeat(1, 1fr)" key={i}>
                      <GridItem p="10px 0" fontSize="14px">
                        {item.bondYields}
                      </GridItem>
                    </Grid>
                  ))}
                </Box>
                <Box w="46%">
                  <Text
                    textAlign="center"
                    h="20px"
                    mb="20px"
                    fontSize="14px"
                    fontWeight="700"
                  >
                    {t("marketSimplified.marketSimplifiedTable.bonds")}
                  </Text>
                  <Grid
                    templateColumns="repeat(3, 1fr)"
                    borderBottom="1px solid #4d4d4d"
                    alignItems="center"
                  >
                    <GridItem
                      pb="10px"
                      fontSize="12px"
                      color="gray.400"
                      textAlign="center"
                    >
                      {t("marketSimplified.marketSimplifiedTable.maturity")}
                    </GridItem>
                    <GridItem
                      pb="10px"
                      fontSize="12px"
                      color="gray.400"
                      textAlign="center"
                    >
                      {t("marketSimplified.marketSimplifiedTable.close")}
                    </GridItem>
                    <GridItem
                      pb="10px"
                      fontSize="12px"
                      color="gray.400"
                      textAlign="center"
                    >
                      {t("marketSimplified.marketSimplifiedTable.weekChange")}
                    </GridItem>
                  </Grid>
                  <Grid templateColumns="repeat(3, 1fr)">
                    {bondData?.map((item, i) => (
                      <>
                        <GridItem
                          p="10px 0"
                          fontSize="14px"
                          textAlign="center"
                          key={i}
                        >
                          {item.bondMaturity}
                        </GridItem>
                        <GridItem
                          p="10px 0"
                          fontSize="14px"
                          textAlign="center"
                          color={
                            item.bondCloseChange.direction == "upwards"
                              ? "#B5E361"
                              : "#C73D3D"
                          }
                          style={{
                            direction: lang.includes("ar") ? "ltr" : "inherit",
                          }}
                        >
                          {item.bondCloseChange?.direction == "upwards" ? (
                            <Text as="span" d="inline-flex" alignItems="center">
                              <TriangleUpIcon
                                style={{
                                  marginRight: "5px",
                                }}
                                h="10px"
                                w="10px"
                                color="#B5E361"
                              />
                            </Text>
                          ) : (
                            <Text as="span" d="inline-flex" alignItems="center">
                              <TriangleDownIcon
                                h="10px"
                                w="10px"
                                color="#C73D3D"
                                style={{
                                  marginRight: "5px",
                                }}
                              />
                            </Text>
                          )}
                          {percentTwoDecimalPlace(
                            item.bondCloseChange?.percent,
                          )}
                          %
                        </GridItem>
                        <GridItem
                          p="10px 0"
                          fontSize="14px"
                          textAlign="center"
                          color={
                            item.bondWeekChange?.direction == "upwards"
                              ? "#B5E361"
                              : "#C73D3D"
                          }
                          style={{
                            direction: lang.includes("ar") ? "ltr" : "inherit",
                          }}
                        >
                          {item.bondWeekChange?.direction == "upwards" ? (
                            <Text as="span" d="inline-flex" alignItems="center">
                              <TriangleUpIcon
                                style={{
                                  marginRight: "5px",
                                }}
                                h="10px"
                                w="10px"
                                color="#B5E361"
                              />
                            </Text>
                          ) : (
                            <Text as="span" d="inline-flex" alignItems="center">
                              <TriangleDownIcon
                                style={{
                                  marginRight: "5px",
                                }}
                                h="10px"
                                w="10px"
                                color="#C73D3D"
                              />
                            </Text>
                          )}
                          {roundPercentValue(item.bondWeekChange?.percent)}
                          {item.bondWeekChange?.unit == "BPS" ? "bps" : "%"}
                        </GridItem>
                      </>
                    ))}
                  </Grid>
                </Box>
                <Box w="27%">
                  <Text
                    textAlign="center"
                    h="20px"
                    mb="20px"
                    fontSize="14px"
                    fontWeight="700"
                  >
                    {t("marketSimplified.marketSimplifiedTable.stocks")}
                  </Text>
                  <Grid
                    templateColumns="repeat(2, 1fr)"
                    borderBottom="1px solid #4d4d4d"
                  >
                    <GridItem
                      pb="10px"
                      fontSize="12px"
                      color="gray.400"
                      textAlign="center"
                    >
                      {t("marketSimplified.marketSimplifiedTable.week")}
                    </GridItem>
                    <GridItem
                      pb="10px"
                      fontSize="12px"
                      color="gray.400"
                      textAlign="center"
                    >
                      {t("marketSimplified.marketSimplifiedTable.year")}
                    </GridItem>
                  </Grid>
                  <Grid templateColumns="repeat(2, 1fr)">
                    {bondData?.map((item, i) => (
                      <>
                        <GridItem
                          p="10px 0"
                          fontSize="14px"
                          textAlign="center"
                          color={
                            item.bondStockWeekChange?.direction == "upwards"
                              ? "#B5E361"
                              : "#C73D3D"
                          }
                          style={{
                            direction: lang.includes("ar") ? "ltr" : "inherit",
                          }}
                          key={i}
                        >
                          {item.bondStockWeekChange?.direction == "upwards" ? (
                            <Text as="span" d="inline-flex" alignItems="center">
                              <TriangleUpIcon
                                style={{
                                  marginRight: "5px",
                                }}
                                h="10px"
                                w="10px"
                                color="#B5E361"
                              />
                            </Text>
                          ) : (
                            <Text as="span" d="inline-flex" alignItems="center">
                              <TriangleDownIcon
                                style={{
                                  marginRight: "5px",
                                }}
                                h="10px"
                                w="10px"
                                color="#C73D3D"
                              />
                            </Text>
                          )}
                          {percentTwoDecimalPlace(
                            item.bondStockWeekChange?.percent,
                          )}
                          %
                        </GridItem>
                        <GridItem
                          p="10px 0"
                          fontSize="14px"
                          textAlign="center"
                          color={
                            item.bondYTDChange?.direction == "upwards"
                              ? "#B5E361"
                              : "#C73D3D"
                          }
                          style={{
                            direction: lang.includes("ar") ? "ltr" : "inherit",
                          }}
                        >
                          {item.bondYTDChange?.direction == "upwards" ? (
                            <Text as="span" d="inline-flex" alignItems="center">
                              <TriangleUpIcon
                                style={{
                                  marginRight: "5px",
                                }}
                                h="10px"
                                w="10px"
                                color="#B5E361"
                              />
                            </Text>
                          ) : (
                            <Text as="span" d="inline-flex" alignItems="center">
                              <TriangleDownIcon
                                style={{
                                  marginRight: "5px",
                                }}
                                h="10px"
                                w="10px"
                                color="#C73D3D"
                              />
                            </Text>
                          )}
                          {roundPercentValue(item.bondYTDChange?.percent)}
                          {item.bondYTDChange?.unit == "BPS" ? "bps" : "%"}
                        </GridItem>
                      </>
                    ))}
                  </Grid>
                </Box>
              </Flex>
            </Box>
          </Hide>
          <Show below="md">
            <Box>
              {bondData?.map((item, i) => (
                <>
                  <Box
                    bg="#222222"
                    _even={{
                      bg: "#1a1a1a",
                    }}
                    p="16px"
                    borderRadius="6px"
                    alignSelf="stretch"
                    margin="2px 0px"
                    key={i}
                  >
                    <Text textAlign="center" fontSize="16px">
                      Country -{" "}
                      <Text as="span" fontWeight="700">
                        {item.bondYields}
                      </Text>
                    </Text>
                    <Box mt="24px" borderBottom="1px solid #4D4D4D">
                      <Text textAlign="center" mb="12px" fontSize="14px">
                        {t("marketSimplified.marketSimplifiedTable.bonds")}
                      </Text>
                      <Grid pb="24px" templateColumns="repeat(2, 1fr)" gap={6}>
                        <GridItem fontSize="14px" color="gray.400">
                          {" "}
                          {t(
                            "marketSimplified.marketSimplifiedTable.maturity",
                          )}{" "}
                        </GridItem>
                        <GridItem fontSize="14px" textAlign="end">
                          {" "}
                          {item.bondMaturity}{" "}
                        </GridItem>
                      </Grid>
                      <Grid pb="24px" templateColumns="repeat(2, 1fr)" gap={6}>
                        <GridItem fontSize="14px" color="gray.400">
                          {" "}
                          {t(
                            "marketSimplified.marketSimplifiedTable.close",
                          )}{" "}
                        </GridItem>
                        <GridItem
                          fontSize="14px"
                          textAlign="end"
                          color={
                            item.bondCloseChange?.direction == "upwards"
                              ? "#B5E361"
                              : "#C73D3D"
                          }
                          style={{
                            direction: lang.includes("ar") ? "ltr" : "inherit",
                            textAlign: lang.includes("ar") ? "left" : "end",
                            justifyContent: lang.includes("ar")
                              ? "flex-start"
                              : "flex-end",
                          }}
                          d="flex"
                          alignItems="center"
                        >
                          {" "}
                          {item.bondCloseChange?.direction == "upwards" ? (
                            <TriangleUpIcon
                              style={{
                                marginRight: "5px",
                              }}
                              h="10px"
                              w="10px"
                              color="#B5E361"
                            />
                          ) : (
                            <TriangleDownIcon
                              style={{
                                marginRight: "5px",
                              }}
                              h="10px"
                              w="10px"
                              color="#C73D3D"
                            />
                          )}{" "}
                          {percentTwoDecimalPlace(
                            item.bondCloseChange?.percent,
                          )}
                          %{" "}
                        </GridItem>
                      </Grid>
                      <Grid pb="24px" templateColumns="repeat(2, 1fr)" gap={6}>
                        <GridItem fontSize="14px" color="gray.400">
                          {" "}
                          {t(
                            "marketSimplified.marketSimplifiedTable.weekChange",
                          )}{" "}
                        </GridItem>
                        <GridItem
                          fontSize="14px"
                          textAlign="end"
                          color={
                            item.bondWeekChange?.direction == "upwards"
                              ? "#B5E361"
                              : "#C73D3D"
                          }
                          style={{
                            direction: lang.includes("ar") ? "ltr" : "inherit",
                            textAlign: lang.includes("ar") ? "left" : "end",
                            justifyContent: lang.includes("ar")
                              ? "flex-start"
                              : "flex-end",
                          }}
                          d="flex"
                          alignItems="center"
                        >
                          {item.bondWeekChange?.direction == "upwards" ? (
                            <TriangleUpIcon
                              style={{
                                marginRight: "5px",
                              }}
                              h="10px"
                              w="10px"
                              color="#B5E361"
                            />
                          ) : (
                            <TriangleDownIcon
                              style={{
                                marginRight: "5px",
                              }}
                              h="10px"
                              w="10px"
                              color="#C73D3D"
                            />
                          )}{" "}
                          {roundPercentValue(item.bondWeekChange?.percent)}{" "}
                          {item.bondWeekChange?.unit == "BPS" ? "bps" : "%"}{" "}
                        </GridItem>
                      </Grid>
                    </Box>
                    <Box mt="24px">
                      <Text textAlign="center" mb="12px" fontSize="14px">
                        {t("marketSimplified.marketSimplifiedTable.stocks")}
                      </Text>
                      <Grid
                        pb="24px"
                        fontSize="14px"
                        templateColumns="repeat(2, 1fr)"
                        gap={6}
                      >
                        <GridItem color="gray.400">
                          {" "}
                          {t(
                            "marketSimplified.marketSimplifiedTable.week",
                          )}{" "}
                        </GridItem>
                        <GridItem
                          textAlign="end"
                          color={
                            item.bondStockWeekChange?.direction == "upwards"
                              ? "#B5E361"
                              : "#C73D3D"
                          }
                          style={{
                            direction: lang.includes("ar") ? "ltr" : "inherit",
                            textAlign: lang.includes("ar") ? "left" : "end",
                            justifyContent: lang.includes("ar")
                              ? "flex-start"
                              : "flex-end",
                          }}
                          d="flex"
                          alignItems="center"
                        >
                          {" "}
                          {item.bondStockWeekChange?.direction == "upwards" ? (
                            <TriangleUpIcon
                              style={{
                                marginRight: "5px",
                              }}
                              h="10px"
                              w="10px"
                              color="#B5E361"
                            />
                          ) : (
                            <TriangleDownIcon
                              style={{
                                marginRight: "5px",
                              }}
                              h="10px"
                              w="10px"
                              color="#C73D3D"
                            />
                          )}{" "}
                          {percentTwoDecimalPlace(
                            item.bondStockWeekChange?.percent,
                          )}
                          %{" "}
                        </GridItem>
                      </Grid>
                      <Grid
                        pb="24px"
                        fontSize="14px"
                        templateColumns="repeat(2, 1fr)"
                        gap={6}
                      >
                        <GridItem color="gray.400">
                          {" "}
                          {t(
                            "marketSimplified.marketSimplifiedTable.year",
                          )}{" "}
                        </GridItem>
                        <GridItem
                          textAlign="end"
                          color={
                            item.bondYTDChange?.direction == "upwards"
                              ? "#B5E361"
                              : "#C73D3D"
                          }
                          style={{
                            direction: lang.includes("ar") ? "ltr" : "inherit",
                            textAlign: lang.includes("ar") ? "left" : "end",
                            justifyContent: lang.includes("ar")
                              ? "flex-start"
                              : "flex-end",
                          }}
                          d="flex"
                          alignItems="center"
                        >
                          {item.bondYTDChange?.direction == "upwards" ? (
                            <TriangleUpIcon
                              style={{
                                marginRight: "5px",
                              }}
                              h="10px"
                              w="10px"
                              color="#B5E361"
                            />
                          ) : (
                            <TriangleDownIcon
                              style={{
                                marginRight: "5px",
                              }}
                              h="10px"
                              w="10px"
                              color="#C73D3D"
                            />
                          )}{" "}
                          {roundPercentValue(item.bondYTDChange?.percent)}{" "}
                          {item.bondYTDChange?.unit == "BPS" ? "bps" : "%"}
                        </GridItem>
                      </Grid>
                    </Box>
                  </Box>
                </>
              ))}
            </Box>
          </Show>
        </>
      ) : (
        <>
          {isFX ? (
            <Box
              p={{ lgp: "32px", md: "16px", base: "16px" }}
              bg="#222222"
              borderRadius="6px"
              alignSelf="stretch"
              margin="24px 0px"
            >
              <Grid
                aria-label="FX"
                role={"heading"}
                templateColumns={"repeat(3, 1fr)"}
                gap={6}
                mb="8px"
              >
                <GridItem
                  colSpan={1}
                  pb="8px"
                  borderBottom="1px solid #4D4D4D"
                  textAlign="left"
                  fontSize={{ base: "10px", lgp: "12px" }}
                  color="#C7C7C7"
                >
                  {t("marketSimplified.marketSimplifiedTable.name")}{" "}
                </GridItem>
                <GridItem
                  colSpan={1}
                  pb="8px"
                  borderBottom="1px solid #4D4D4D"
                  textAlign={{
                    lgp: "center",
                    md: "end",
                    base: "center",
                  }}
                  fontSize={{ base: "10px", lgp: "12px" }}
                  color="#C7C7C7"
                  style={{
                    direction: "ltr",
                  }}
                  m="auto"
                >
                  {t("marketSimplified.marketSimplifiedTable.fxValue")}{" "}
                </GridItem>
                <GridItem
                  colSpan={1}
                  pb="8px"
                  borderBottom="1px solid #4D4D4D"
                  textAlign={{
                    lgp: "center",
                    md: "end",
                    base: "center",
                  }}
                  fontSize={{ base: "10px", lgp: "12px" }}
                  style={{
                    direction: "ltr",
                  }}
                  m="auto"
                  color="#C7C7C7"
                >
                  {t("marketSimplified.marketSimplifiedTable.fxStrength")}
                </GridItem>
                <GridItem
                  colSpan={1}
                  pb="8px"
                  borderBottom="1px solid #4D4D4D"
                  textAlign={{
                    lgp: "center",
                    md: "end",
                    base: "center",
                  }}
                  fontSize={{ base: "10px", lgp: "12px" }}
                  color="#C7C7C7"
                  style={{
                    direction: "ltr",
                    display: "none",
                  }}
                  m="auto"
                >
                  {t("common:client.client")} %{" "}
                </GridItem>
              </Grid>

              {fxData?.map((item, i: number) => (
                <>
                  <Grid
                    aria-label={item.indexFXCurrencyCode}
                    role={"row"}
                    templateColumns={"repeat(3, 1fr)"}
                    gap={6}
                    key={i}
                  >
                    <GridItem colSpan={1} p="8px 0">
                      {/* <Flex> */}
                      <Text textAlign="left" fontSize="14px" color="#FFFFFF">
                        <Text
                          as="span"
                          textAlign="left"
                          fontSize="14px"
                          color="#FFFFFF"
                        >
                          {/* something */}
                          {item.indexFXCurrencyCode}
                        </Text>
                      </Text>
                      {/* </Flex>{" "} */}
                    </GridItem>
                    <GridItem
                      colSpan={1}
                      p="8px 0"
                      textAlign={{
                        lgp: "center",
                        md: "end",
                        base: "center",
                      }}
                      fontSize="14px"
                      color={
                        item.indexFXValue?.direction == "upwards"
                          ? "#B5E361"
                          : "#C73D3D"
                      }
                      style={{
                        direction: "ltr",
                      }}
                      m="auto"
                      d="flex"
                      alignItems="center"
                    >
                      {item.indexFXValue?.direction == "upwards" ? (
                        <TriangleUpIcon
                          style={{
                            marginRight: "5px",
                          }}
                          h="10px"
                          w="10px"
                          color="#B5E361"
                        />
                      ) : (
                        <TriangleDownIcon
                          style={{
                            marginRight: "5px",
                          }}
                          h="10px"
                          w="10px"
                          color="#C73D3D"
                        />
                      )}{" "}
                      {percentTwoDecimalPlace(item.indexFXValue?.percent)}
                      {"%"}
                    </GridItem>
                    <GridItem
                      colSpan={1}
                      p="8px 0"
                      textAlign={{
                        lgp: "center",
                        md: "end",
                        base: "center",
                      }}
                      fontSize="14px"
                      color="#FFFFFF"
                      style={{
                        direction: "ltr",
                      }}
                      m="auto"
                    >
                      {item.indexFXStrength}
                    </GridItem>
                  </Grid>
                </>
              ))}
            </Box>
          ) : isStock ? (
            <Box
              p={{ lgp: "32px", md: "16px", base: "16px" }}
              bg="#222222"
              borderRadius="6px"
              alignSelf="stretch"
              margin="24px 0px"
            >
              <Grid
                aria-label="Stock"
                role={"heading"}
                templateColumns={"repeat(5, 1fr)"}
                gap={{ lgp: 6, md: 6, base: 2 }}
                mb="8px"
              >
                <GridItem
                  colSpan={2}
                  pb="8px"
                  borderBottom="1px solid #4D4D4D"
                  textAlign="left"
                  fontSize={{ base: "10px", lgp: "12px" }}
                  color="#C7C7C7"
                >
                  {t("marketSimplified.marketSimplifiedTable.company")}{" "}
                </GridItem>
                <GridItem
                  colSpan={1}
                  pb="8px"
                  borderBottom="1px solid #4D4D4D"
                  textAlign={lang.includes("ar") ? "left" : "right"}
                  fontSize={{ base: "10px", lgp: "14px" }}
                  color="#C7C7C7"
                  style={{
                    direction: "ltr",
                  }}
                  ml={lang.includes("ar") ? "initial" : "auto"}
                >
                  {t("marketSimplified.marketSimplifiedTable.price")}{" "}
                </GridItem>
                <GridItem
                  colSpan={1}
                  pb="8px"
                  borderBottom="1px solid #4D4D4D"
                  textAlign={lang.includes("ar") ? "left" : "right"}
                  fontSize={{ base: "10px", lgp: "14px" }}
                  style={{
                    direction: "ltr",
                  }}
                  color="#C7C7C7"
                  ml={lang.includes("ar") ? "initial" : "auto"}
                >
                  {t("marketSimplified.marketSimplifiedTable.week")}
                </GridItem>
                <GridItem
                  colSpan={1}
                  pb="8px"
                  borderBottom="1px solid #4D4D4D"
                  textAlign={lang.includes("ar") ? "left" : "right"}
                  fontSize={{ base: "10px", lgp: "14px" }}
                  color="#C7C7C7"
                  style={{
                    direction: "ltr",
                    display: isFX ? "none" : "block",
                  }}
                  ml={lang.includes("ar") ? "initial" : "auto"}
                >
                  {t("common:client.YTD")}{" "}
                </GridItem>
              </Grid>

              {stockData?.map((item, i: number) => (
                <>
                  <Grid
                    aria-label={item.stockCompany}
                    role={"row"}
                    templateColumns={"repeat(5, 1fr)"}
                    gap={{ lgp: 6, md: 6, base: 2 }}
                    key={i}
                  >
                    <GridItem colSpan={2} p="8px 0">
                      {/* <Flex> */}
                      <Text
                        textAlign="left"
                        fontSize={{ lgp: "14px", md: "14px", base: "12px" }}
                        color="#FFFFFF"
                      >
                        {/* something */}
                        {item.stockCompany}

                        <Text
                          as="span"
                          d={{
                            base: "none",
                            md: "inline-block",
                            lgp: "inline-block",
                          }}
                          fontSize="14px"
                          color="#C7C7C7"
                          ml="10px"
                        >
                          {item.stockCode}
                        </Text>
                      </Text>
                      {/* </Flex>{" "} */}
                    </GridItem>
                    <GridItem
                      colSpan={1}
                      p="8px 0"
                      textAlign={{
                        lgp: "end",
                        md: "end",
                        base: "end",
                      }}
                      fontSize={{ lgp: "14px", md: "14px", base: "12px" }}
                      color="#FFFFFF"
                      style={{
                        direction: "ltr",
                      }}
                    >
                      ${item.stockPrice}
                    </GridItem>
                    <GridItem
                      colSpan={1}
                      p="8px 0"
                      textAlign={{
                        lgp: "end",
                        md: "end",
                        base: "end",
                      }}
                      fontSize={{ lgp: "14px", md: "14px", base: "12px" }}
                      color={
                        item.stockWeekChange?.direction == "upwards"
                          ? "#B5E361"
                          : "#C73D3D"
                      }
                      style={{
                        direction: "ltr",
                      }}
                    >
                      {item.stockWeekChange?.direction == "upwards" ? (
                        <Text as="span" d="inline-flex" alignItems="center">
                          <TriangleUpIcon
                            style={{
                              marginRight: "5px",
                            }}
                            h="10px"
                            w="10px"
                            color="#B5E361"
                          />
                        </Text>
                      ) : (
                        <Text as="span" d="inline-flex" alignItems="center">
                          <TriangleDownIcon
                            style={{
                              marginRight: "5px",
                            }}
                            h="10px"
                            w="10px"
                            color="#C73D3D"
                          />
                        </Text>
                      )}
                      {percentTwoDecimalPlace(item.stockWeekChange?.percent)}%
                    </GridItem>
                    <GridItem
                      colSpan={1}
                      p="8px 0"
                      textAlign="end"
                      fontSize={{ lgp: "14px", md: "14px", base: "12px" }}
                      color={
                        item.stockYTDChange?.direction == "upwards"
                          ? "#B5E361"
                          : "#C73D3D"
                      }
                      style={{
                        direction: "ltr",
                        display: "block",
                      }}
                    >
                      {item.stockYTDChange?.direction == "upwards" ? (
                        <Text as="span" d="inline-flex" alignItems="center">
                          <TriangleUpIcon
                            style={{
                              marginRight: "5px",
                            }}
                            h="10px"
                            w="10px"
                            color="#B5E361"
                          />
                        </Text>
                      ) : (
                        <Text as="span" d="inline-flex" alignItems="center">
                          <TriangleDownIcon
                            style={{
                              marginRight: "5px",
                            }}
                            h="10px"
                            w="10px"
                            color="#C73D3D"
                          />
                        </Text>
                      )}
                      {percentTwoDecimalPlace(item.stockYTDChange?.percent)}%
                    </GridItem>
                  </Grid>
                </>
              ))}
            </Box>
          ) : (
            <Box
              p={{ lgp: "32px", md: "16px", base: "16px" }}
              bg="#222222"
              borderRadius="6px"
              alignSelf="stretch"
              margin="24px 0px"
            >
              <Grid
                aria-label="Indices"
                role={"heading"}
                templateColumns={"repeat(5, 1fr)"}
                gap={{ lgp: 6, md: 6, base: 2 }}
                mb="8px"
              >
                <GridItem
                  colSpan={2}
                  pb="8px"
                  borderBottom="1px solid #4D4D4D"
                  textAlign={{ lgp: "left", md: "left", base: "left" }}
                  fontSize={{ base: "10px", lgp: "14px" }}
                  fontWeight="400"
                  color="#C7C7C7"
                >
                  {t("marketSimplified.marketSimplifiedTable.index")}
                </GridItem>
                <GridItem
                  colSpan={1}
                  pb="8px"
                  w={{ lgp: "33%" }}
                  borderBottom="1px solid #4D4D4D"
                  textAlign={lang.includes("ar") ? "left" : "right"}
                  fontSize={{ base: "10px", lgp: "14px" }}
                  color="#C7C7C7"
                  ml={lang.includes("ar") ? "initial" : "auto"}
                  whiteSpace="nowrap"
                >
                  {t("marketSimplified.marketSimplifiedTable.level")} %
                </GridItem>
                <GridItem
                  colSpan={1}
                  pb="8px"
                  w={{ lgp: "33%" }}
                  borderBottom="1px solid #4D4D4D"
                  textAlign={lang.includes("ar") ? "left" : "right"}
                  fontSize={{ base: "10px", lgp: "14px" }}
                  color="#C7C7C7"
                  ml={lang.includes("ar") ? "initial" : "auto"}
                  whiteSpace="nowrap"
                >
                  {t("marketSimplified.marketSimplifiedTable.week")} %
                </GridItem>
                <GridItem
                  colSpan={1}
                  pb="8px"
                  w={{ lgp: "33%" }}
                  borderBottom="1px solid #4D4D4D"
                  textAlign={lang.includes("ar") ? "left" : "right"}
                  fontSize={{ base: "10px", lgp: "12px" }}
                  color="#C7C7C7"
                  ml={lang.includes("ar") ? "initial" : "auto"}
                  whiteSpace="nowrap"
                >
                  {t("common:client.YTD")} %
                </GridItem>
              </Grid>

              {indicesData.map((item, i: number) => (
                <>
                  <Grid
                    aria-label={item.indexName}
                    role={"row"}
                    templateColumns={"repeat(5, 1fr)"}
                    gap={{ lgp: 6, md: 6, base: 2 }}
                    key={i}
                  >
                    <GridItem colSpan={2} p="8px 0">
                      <Text
                        textAlign="left"
                        fontSize="14px"
                        color="#c7c7c7"
                        dir="ltr"
                      >
                        <Text
                          as="span"
                          fontSize={{ lgp: "14px", md: "14px", base: "12px" }}
                          color="#c7c7c7"
                          me="1"
                        >
                          {item.indexName}
                        </Text>
                        <Text as="span" fontSize="14px" color="#FFFFFF">
                          {item.indexCode}
                        </Text>
                      </Text>
                    </GridItem>
                    <GridItem
                      colSpan={1}
                      p="8px 0"
                      textAlign="end"
                      fontSize={{ lgp: "14px", md: "14px", base: "12px" }}
                      color="#FFFFFF"
                      style={{
                        direction: "ltr",
                      }}
                    >
                      {roundValueWithoutAbsolute(Number(item.indexLevel))}
                    </GridItem>
                    <GridItem
                      colSpan={1}
                      p="8px 0"
                      textAlign={{
                        lgp: "end",
                        md: "end",
                        base: "end",
                      }}
                      fontSize={{ lgp: "14px", md: "14px", base: "12px" }}
                      color={
                        item.indexWeekChange.direction == "upwards"
                          ? "#B5E361"
                          : "#C73D3D"
                      }
                      style={{
                        direction: "ltr",
                      }}
                      whiteSpace="nowrap"
                    >
                      {item.indexWeekChange.direction == "upwards" ? (
                        <Text as="span" d="inline-flex" alignItems="center">
                          <TriangleUpIcon
                            style={{
                              marginRight: "5px",
                            }}
                            h="10px"
                            w="10px"
                            color="#B5E361"
                          />
                        </Text>
                      ) : (
                        <Text as="span" d="inline-flex" alignItems="center">
                          <TriangleDownIcon
                            style={{
                              marginRight: "5px",
                            }}
                            h="10px"
                            w="10px"
                            color="#C73D3D"
                          />
                        </Text>
                      )}
                      {percentTwoDecimalPlace(item.indexWeekChange?.percent)}
                      {item.indexWeekChange?.unit == "BPS" ? (
                        <>
                          <Hide above="sm">
                            <br />
                          </Hide>
                          bps
                        </>
                      ) : (
                        "%"
                      )}
                    </GridItem>
                    <GridItem
                      colSpan={1}
                      p="8px 0"
                      textAlign="end"
                      fontSize={{ lgp: "14px", md: "14px", base: "12px" }}
                      color={
                        item.indexYTDChange.direction == "upwards"
                          ? "#B5E361"
                          : "#C73D3D"
                      }
                      style={{
                        direction: "ltr",
                        display: "block",
                      }}
                    >
                      {item.indexYTDChange.direction == "upwards" ? (
                        <Text as="span" d="inline-flex" alignItems="center">
                          <TriangleUpIcon
                            style={{
                              marginRight: "5px",
                            }}
                            h="10px"
                            w="10px"
                            color="#B5E361"
                          />
                        </Text>
                      ) : (
                        <Text as="span" d="inline-flex" alignItems="center">
                          <TriangleDownIcon
                            style={{
                              marginRight: "5px",
                            }}
                            h="10px"
                            w="10px"
                            color="#C73D3D"
                          />
                        </Text>
                      )}
                      {percentTwoDecimalPlace(item.indexYTDChange?.percent)}
                      {item.indexYTDChange?.unit == "BPS" ? (
                        <>
                          <Hide above="sm">
                            <br />
                          </Hide>
                          bps
                        </>
                      ) : (
                        "%"
                      )}
                    </GridItem>
                  </Grid>
                </>
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  )
}
export default MarketWatchlist
