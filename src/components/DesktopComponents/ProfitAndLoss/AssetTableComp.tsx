import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Hide,
  Text,
  useMediaQuery,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { PolygonDownIcon, PolygonIcon } from "~/components"
import {
  percentTwoDecimalPlace,
  roundCurrencyValue,
} from "~/utils/clientUtils/globalUtilities"

type AssetTableCompProps = {
  profitLossData: {
    data: AssetClassType[]
    sectionTitle?: string
    sectionSubTitle?: string
  }
  totalCommmitIs: boolean
}

interface AssetClassType {
  result: string
  value: {
    money: number
    direction?: string
  }
  percentChange?: {
    percent?: number
    direction?: string
  }
}

export default function AssetTableComp({
  profitLossData,
  totalCommmitIs,
}: AssetTableCompProps) {
  const { t, lang } = useTranslation("profitAndLoss")
  const [tabletView] = useMediaQuery([
    "(max-width: 1023px)",
    "(display-mode: browser)",
  ])

  return (
    <Box>
      <Box mt="60px">
        {!totalCommmitIs && (
          <>
            {!profitLossData.sectionSubTitle ? (
              <Heading
                fontWeight="400"
                fontSize="14px"
                textTransform="uppercase"
                color="#fff"
                mb={{ base: "30px", lgp: "0", md: "10px" }}
              >
                {profitLossData.sectionTitle}
              </Heading>
            ) : (
              false
            )}
            {profitLossData.sectionSubTitle ? (
              <Text
                mb={{ base: "30px", md: "30px", lgp: "0" }}
                mt={{ lgp: "40px" }}
                textTransform="capitalize"
              >
                {profitLossData.sectionSubTitle}
              </Text>
            ) : (
              false
            )}
          </>
        )}
        {!totalCommmitIs && (
          <Hide below="lgp">
            <Grid
              templateColumns={{
                base: "repeat(2, 1fr)",
                lgp: "repeat(8, 1fr)",
              }}
              p="12px 0"
            >
              <GridItem colSpan={5}></GridItem>
              <GridItem colSpan={3}>
                {!profitLossData.sectionSubTitle ? (
                  <Grid
                    gap="1px"
                    templateColumns={{
                      base: "repeat(1, 1fr)",
                      lgp: "repeat(2, 1fr)",
                    }}
                  >
                    <GridItem w="100%" mb={{ base: "15px", md: "0" }}>
                      <Flex
                        h="100%"
                        w="100%"
                        p={{ base: "0 10px", lgp: "0 30px" }}
                        alignItems="center"
                        justify={{ base: "space-between", lgp: "end" }}
                      >
                        <Heading
                          display={{ base: "block", lgp: "none" }}
                          fontSize="14px"
                          color="gray.400"
                          fontWeight="400"
                        >
                          {t("table.header.total")}
                        </Heading>
                        <Flex>
                          <Text
                            fontSize="14px"
                            color="gray.400"
                            fontWeight="400"
                          >
                            {t("table.header.total")}
                          </Text>
                        </Flex>
                      </Flex>
                    </GridItem>
                    <GridItem w="100%">
                      <Flex
                        h="100%"
                        w="100%"
                        p={{ base: "0 10px", lgp: "0 30px" }}
                        alignItems="center"
                        justify={{ base: "space-between", lgp: "end" }}
                        style={{
                          justifyContent: lang.includes("ar") ? "start" : "end",
                        }}
                      >
                        <Heading
                          display={{ base: "block", lgp: "none" }}
                          fontSize="14px"
                          color="gray.400"
                          fontWeight="400"
                        >
                          {t("table.header.relative")}
                        </Heading>
                        <Flex>
                          <Text
                            fontSize="14px"
                            color="gray.400"
                            fontWeight="400"
                          >
                            {t("table.header.relative")}
                          </Text>
                        </Flex>
                      </Flex>
                    </GridItem>
                  </Grid>
                ) : (
                  false
                )}
              </GridItem>
            </Grid>
          </Hide>
        )}

        {totalCommmitIs && (
          <Text
            mb={{ base: "30px", md: "30px", lgp: "30px" }}
            mt={{ lgp: "40px" }}
            color="gray.400"
            fontSize="14px"
            fontWeight="400"
          >
            {profitLossData.sectionSubTitle} <strong>Deployed: 90%</strong>
          </Text>
        )}

        <Box>
          {profitLossData?.data.length
            ? profitLossData?.data.map(
                (profitLoss: AssetClassType, i: number) => (
                  <Box bg="gray.800" mb="2px" borderRadius="2px" key={i}>
                    <Grid
                      templateColumns={{
                        base: !totalCommmitIs
                          ? "repeat(2, 1fr)"
                          : "repeat(8, 1fr)",
                        lgp: "repeat(8, 1fr)",
                      }}
                      p={{ base: "16px 10px", md: "16px 10px", lgp: "5px 0" }}
                    >
                      <GridItem colSpan={5}>
                        <Flex
                          h="100%"
                          w="100%"
                          p={{ base: "0 30px 20px", md: "0 30px" }}
                          alignItems="center"
                          justify={{ base: "center", lgp: "inherit" }}
                          textTransform="capitalize"
                        >
                          <Text
                            fontSize="14px"
                            fontWeight="400"
                            color="#FFFFFF"
                            // textTransform="capitalize"
                          >
                            {" "}
                            {t(`table.body.${profitLoss.result}`)}
                          </Text>
                        </Flex>
                      </GridItem>
                      <GridItem colSpan={3}>
                        <Grid
                          gap="1px"
                          templateColumns={{
                            base: "repeat(1, 1fr)",
                            lgp: !totalCommmitIs
                              ? "repeat(2, 1fr)"
                              : "repeat(1, 1fr)",
                          }}
                        >
                          <GridItem w="100%" mb={{ base: "15px", md: "0" }}>
                            <Flex
                              h="100%"
                              w="100%"
                              p={{ base: "0 10px", lgp: "0 30px" }}
                              alignItems="center"
                              justify={{
                                base: !totalCommmitIs ? "space-between" : "end",
                                lgp: "end",
                              }}
                              mb="20px"
                            >
                              {!totalCommmitIs && (
                                <Heading
                                  display={{ base: "block", lgp: "none" }}
                                  fontSize="14px"
                                  color="gray.500"
                                  fontWeight="400"
                                >
                                  {t("table.header.total")}
                                </Heading>
                              )}
                              <Flex>
                                <Text
                                  fontSize="14px"
                                  color="#ffffff"
                                  fontWeight="400"
                                >
                                  {profitLoss?.value?.direction == "downwards"
                                    ? "-"
                                    : ""}
                                </Text>
                                <Text
                                  fontSize="14px"
                                  color="#ffffff"
                                  fontWeight="400"
                                >
                                  $
                                </Text>
                                <Text
                                  fontSize="14px"
                                  color="#ffffff"
                                  fontWeight="400"
                                >
                                  {roundCurrencyValue(
                                    Math.abs(profitLoss?.value?.money),
                                  ) || 0}
                                </Text>
                              </Flex>
                            </Flex>
                          </GridItem>
                          {!totalCommmitIs && (
                            <GridItem w="100%">
                              <Flex
                                h="100%"
                                w="100%"
                                p={{ base: "0 10px", lgp: "0 30px" }}
                                alignItems="center"
                                justify={{ base: "space-between", lgp: "end" }}
                                style={{
                                  justifyContent:
                                    lang.includes("ar") || tabletView
                                      ? "space-between"
                                      : "end",
                                }}
                              >
                                <Heading
                                  display={{ base: "block", lgp: "none" }}
                                  fontSize="14px"
                                  color="gray.500"
                                  fontWeight="400"
                                  style={{
                                    justifyContent: lang.includes("ar")
                                      ? "normal"
                                      : "end",
                                  }}
                                >
                                  {t("table.header.relative")}
                                </Heading>
                                <Flex>
                                  {profitLoss?.percentChange?.direction ==
                                    "downwards" && (
                                    <PolygonDownIcon width={3} mr="2px" />
                                  )}
                                  {profitLoss?.percentChange?.direction ==
                                    "upwards" && (
                                    <PolygonIcon width={3} mr="2px" />
                                  )}

                                  <Text
                                    fontSize="14px"
                                    color={
                                      profitLoss?.percentChange?.direction ==
                                      "downwards"
                                        ? "red.500"
                                        : profitLoss?.percentChange
                                            ?.direction == "upwards"
                                        ? "green.500"
                                        : "#ffffff"
                                    }
                                    fontWeight="400"
                                  >
                                    {percentTwoDecimalPlace(
                                      profitLoss?.percentChange?.percent || 0,
                                    )}
                                    %
                                  </Text>
                                </Flex>
                              </Flex>
                            </GridItem>
                          )}
                        </Grid>
                      </GridItem>
                    </Grid>
                  </Box>
                ),
              )
            : false}
        </Box>
        <Box bg="gray.800" mb="2px" borderRadius="2px" p="15px 0">
          <Flex align="center" justify="center">
            <Button
              colorScheme="primary"
              variant="link"
              fontSize="14px"
              fontWeight="400"
              textDecoration="none"
            >
              View Related Investments
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}
