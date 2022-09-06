import { Box, Container, SimpleGrid, Text } from "@chakra-ui/layout"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useState } from "react"

interface IlliquidTypes {
  subStrategy?: string
  targetAssetAllocationPercent: number
  currentAssetAllocationPercent?: number
  deviation?: number
}

type TargetAssetAllocationProps = {
  assetAllocation: {
    finalData: {
      targetAssetAllocation: {
        illiquid: {
          data: [
            {
              subStrategy: string
              targetAssetAllocationPercent: number
              currentAssetAllocationPercent: number
              deviation: number
            },
          ]
          illiquidPercentage: number
          strategyPerc: number
        }
        liquid: {
          liquidPercentage: number
          strategyPerc: number
          data: [
            {
              subStrategy: string
              targetAssetAllocationPercent: number
              currentAssetAllocationPercent: number
              deviation: number
            },
          ]
        }
      }
    }
  }
}

export default function TargetAssetAllocation({
  assetAllocation,
}: TargetAssetAllocationProps) {
  const { t, lang } = useTranslation("assetAllocation")
  const [opportunistic, setOpportunistic] = useState<IlliquidTypes>()

  useEffect(() => {
    getOpportunistic()
  }, [assetAllocation])

  const getOpportunistic = () => {
    var liquid =
      assetAllocation?.finalData?.targetAssetAllocation?.liquid?.data?.filter(
        (x) => {
          return x.subStrategy == "Opportunistic_Liquid"
        },
      )

    var illiquid =
      assetAllocation?.finalData?.targetAssetAllocation?.illiquid?.data?.filter(
        (x) => {
          return x.subStrategy == "Opportunistic_Illiquid"
        },
      )

    var liquidValue = liquid?.length
      ? liquid[0].targetAssetAllocationPercent
      : 0
    var illiquidValue = illiquid?.length
      ? illiquid[0].targetAssetAllocationPercent
      : 0
    var liquidDeviation = liquid?.length ? liquid[0].deviation : 0
    var illiquidDeviation = illiquid?.length ? illiquid[0].deviation : 0
    var liquidCurrentAssetAllocationPercent = liquid?.length
      ? liquid[0].currentAssetAllocationPercent
      : 0
    var illiquidCurrentAssetAllocationPercent = illiquid?.length
      ? illiquid[0].currentAssetAllocationPercent
      : 0

    setOpportunistic({
      targetAssetAllocationPercent: liquidValue + illiquidValue,
      deviation: liquidDeviation + illiquidDeviation,
      currentAssetAllocationPercent:
        liquidCurrentAssetAllocationPercent +
        illiquidCurrentAssetAllocationPercent,
    })
  }

  return (
    <Container as="section" maxW="full" px="0" flexDirection="row">
      <Box>
        <Text
          fontStyle="normal"
          fontWeight="700"
          fontSize="18px"
          lineHeight="120%"
          color="#fff"
          marginTop={{ base: "46px", md: "32px", lgp: "80px" }}
          marginBottom={{ base: "0", md: "35px" }}
        >
          {t("targetAssetAllocation.title")}
        </Text>
        <Box display="flex" flexWrap="wrap" width="100%">
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: "0", md: "20px" }}
            width="100%"
          >
            <Box
              className="target-allocation-grid-col"
              borderBottom="1px solid #4d4d4d"
              pos="relative"
              minH={{ base: "auto", md: "100px" }}
              paddingBottom={{ base: "16px", md: "20px" }}
            >
              <Box
                paddingTop="16px"
                paddingRight={{ base: "0", md: "15px" }}
                paddingLeft={{ base: "0", md: "15px" }}
                _after={{
                  content: '""',
                  position: "absolute",
                  height: "100%",
                  width: "1px",
                  right: "-10px",
                  top: "-12px",
                  backgroundColor: "#4d4d4d",
                  display: { base: "none", md: "block" },
                }}
              >
                <Text
                  fontSize={{
                    base: "14px",
                    md: "18px",
                    sm: "14px",
                    lgp: "18px",
                  }}
                  fontWeight="700"
                  margin={{ base: "0 0 8px", md: "0 0 15px" }}
                  color="gray.500"
                >
                  {t("targetAssetAllocation.liquid.title")}
                </Text>
                <Text
                  fontSize={{
                    base: "16px",
                    md: "26px",
                    sm: "16px",
                    lgp: "26px",
                  }}
                  fontWeight="400"
                  margin="0"
                  color="#fff"
                  display="flex"
                  flexDir={{
                    base: "row",
                    md: "column",
                    lgp: "row",
                  }}
                  alignItems={{ base: "center", md: "start", lgp: "center" }}
                >
                  {
                    assetAllocation?.finalData?.targetAssetAllocation?.liquid
                      .liquidPercentage
                  }
                  %
                  <Box
                    mt={{ base: "0", md: "8px", lgp: "0" }}
                    fontSize={{
                      base: "12px",
                      md: "14px",
                      sm: "12px",
                      lgp: "14px",
                    }}
                    fontWeight="400"
                    margin="0"
                    color="gray.500"
                    fontStyle="italic"
                    display={{
                      base: "inline-block",
                      md: "inline-block",
                      sm: "inline",
                    }}
                    paddingLeft={{
                      base: "8px",
                      md: "0",
                      sm: "6px",
                      lgp: "10px",
                    }}
                    dir={lang.includes("ar") ? "ltr" : "initial"}
                  >
                    +/- 20%
                  </Box>
                </Text>
              </Box>
            </Box>

            {assetAllocation?.finalData?.targetAssetAllocation?.liquid?.data
              ?.length > 0
              ? assetAllocation?.finalData?.targetAssetAllocation?.liquid?.data.map(
                  (liquid: IlliquidTypes, index: number) => {
                    if (
                      liquid.targetAssetAllocationPercent >= 0 &&
                      liquid.subStrategy != "Opportunistic_Liquid"
                    ) {
                      return (
                        <Box
                          key={index}
                          className="target-allocation-grid-col"
                          borderBottom="1px solid #4d4d4d"
                          minH={{ base: "auto", md: "100px" }}
                          paddingBottom={{ base: "16px", md: "20px" }}
                          position="relative"
                        >
                          <Box
                            paddingTop="16px"
                            paddingRight={{ base: "0", md: "15px" }}
                            paddingLeft={{
                              base: "0",
                              md: "24px",
                              lgp: "48px",
                            }}
                            _after={{
                              content: '""',
                              position: "absolute",
                              height: "100%",
                              width: "1px",
                              right: "-10px",
                              top: "-12px",
                              backgroundColor: "#4d4d4d",
                              display: { base: "none", md: "block" },
                            }}
                          >
                            <Text
                              fontSize={{
                                base: "14px",
                                md: "18px",
                                sm: "14px",
                                lgp: "18px",
                              }}
                              fontWeight="700"
                              margin={{ base: "0 0 8px", md: "0 0 15px" }}
                              color="gray.500"
                            >
                              {liquid.subStrategy == "Absolute Return"
                                ? t(
                                    `targetAssetAllocation.liquid.absoluteReturn.title`,
                                  )
                                : false}
                            </Text>
                            <Text
                              fontSize={{
                                base: "16px",
                                md: "26px",
                                sm: "16px",
                                lgp: "26px",
                              }}
                              fontWeight="400"
                              margin="0"
                              color="#fff"
                              display="flex"
                              flexDir={{
                                base: "row",
                                md: "column",
                                lgp: "row",
                              }}
                              alignItems={{
                                base: "center",
                                md: "start",
                                lgp: "center",
                              }}
                            >
                              {liquid.targetAssetAllocationPercent}%
                              <Box
                                mt={{ base: "0", md: "8px", lgp: "0" }}
                                fontSize={{
                                  base: "12px",
                                  md: "14px",
                                  sm: "12px",
                                  lgp: "14px",
                                }}
                                fontWeight="400"
                                margin="0"
                                color="gray.500"
                                fontStyle="italic"
                                display={{
                                  base: "inline-block",
                                  md: "inline-block",
                                  sm: "inline",
                                }}
                                paddingLeft={{
                                  base: "8px",
                                  md: "0",
                                  sm: "6px",
                                  lgp: "10px",
                                }}
                              >
                                <Text as="span" d="inline-block" mr="3px">
                                  {liquid.currentAssetAllocationPercent}%{" "}
                                  {t("common:client.currently")}
                                </Text>

                                <Text as="span" d="inline-block">
                                  (
                                  <Text
                                    as="span"
                                    d="inline-block"
                                    dir={
                                      lang.includes("ar") ? "ltr" : "initial"
                                    }
                                    mr="3px"
                                  >
                                    {liquid.deviation}%
                                  </Text>
                                  {t("common:client.deviation")})
                                </Text>
                              </Box>
                            </Text>
                          </Box>
                        </Box>
                      )
                    } else if (liquid.subStrategy == "Opportunistic_Liquid") {
                      return (
                        <Box
                          key={index}
                          className="target-allocation-grid-col"
                          borderBottom="1px solid #4d4d4d"
                          minH={{ base: "auto", md: "100px" }}
                          paddingBottom={{ base: "16px", md: "20px" }}
                          position="relative"
                        >
                          <Box
                            paddingTop="16px"
                            paddingLeft={{
                              base: "0",
                              md: "24px",
                              lgp: "48px",
                            }}
                          >
                            <Text
                              fontSize={{
                                base: "14px",
                                md: "18px",
                                sm: "14px",
                                lgp: "18px",
                              }}
                              fontWeight="700"
                              margin={{ base: "0 0 8px", md: "0 0 15px" }}
                              color="gray.500"
                            >
                              {t(
                                "targetAssetAllocation.liquid.opportunistic.title",
                              )}
                            </Text>
                            <Text
                              fontSize={{
                                base: "16px",
                                md: "26px",
                                sm: "16px",
                                lgp: "26px",
                              }}
                              fontWeight="400"
                              margin="0"
                              color="#fff"
                              display="flex"
                              flexDir={{
                                base: "row",
                                md: "column",
                                lgp: "row",
                              }}
                              alignItems={{
                                base: "center",
                                md: "start",
                                lgp: "center",
                              }}
                            >
                              {opportunistic?.targetAssetAllocationPercent}%
                              <Box
                                mt={{ base: "0", md: "8px", lgp: "0" }}
                                fontSize={{
                                  base: "12px",
                                  md: "14px",
                                  sm: "12px",
                                  lgp: "14px",
                                }}
                                fontWeight="400"
                                margin="0"
                                color="gray.500"
                                fontStyle="italic"
                                display={{
                                  base: "inline-block",
                                  md: "inline-block",
                                  sm: "inline",
                                }}
                                paddingLeft={{
                                  base: "8px",
                                  md: "0",
                                  sm: "6px",
                                  lgp: "10px",
                                }}
                              >
                                <Text as="span" d="inline-block" mr="3px">
                                  {opportunistic?.currentAssetAllocationPercent}
                                  % {t("common:client.currently")}
                                </Text>

                                <Text as="span" d="inline-block">
                                  (
                                  <Text
                                    as="span"
                                    d="inline-block"
                                    dir={
                                      lang.includes("ar") ? "ltr" : "initial"
                                    }
                                    mr="3px"
                                  >
                                    {opportunistic?.deviation}%
                                  </Text>
                                  {t("common:client.deviation")})
                                </Text>
                              </Box>
                            </Text>
                          </Box>
                        </Box>
                      )
                    }
                  },
                )
              : false}

            <Box
              className="target-allocation-grid-col"
              borderBottom={{
                base: "1px solid #4d4d4d",
                md: "none",
              }}
              minH={{ base: "auto", md: "100px" }}
              paddingBottom={{ base: "16px", md: "10px" }}
              position="relative"
            >
              <Box
                paddingTop={{ base: "16px", md: "0" }}
                paddingRight={{ base: "0", md: "15px" }}
                paddingLeft={{ base: "0", md: "15px" }}
                _before={{
                  content: '""',
                  position: "absolute",
                  height: "100%",
                  width: "1px",
                  right: "-10px",
                  top: "-12px",
                  backgroundColor: "#4d4d4d",
                  display: { base: "none", md: "block" },
                }}
              >
                <Text
                  fontSize={{
                    base: "14px",
                    md: "18px",
                    sm: "14px",
                    lgp: "18px",
                  }}
                  fontWeight="700"
                  margin={{ base: "0 0 8px", md: "0 0 15px" }}
                  color="gray.500"
                >
                  {t("targetAssetAllocation.illiquid.title")}
                </Text>
                <Text
                  fontSize={{
                    base: "16px",
                    md: "26px",
                    sm: "16px",
                    lgp: "26px",
                  }}
                  fontWeight="400"
                  margin="0"
                  color="#fff"
                  display="flex"
                  flexDir={{
                    base: "row",
                    md: "column",
                    lgp: "row",
                  }}
                  alignItems={{ base: "center", md: "start", lgp: "center" }}
                >
                  {
                    assetAllocation?.finalData?.targetAssetAllocation?.illiquid
                      ?.illiquidPercentage
                  }
                  %
                  <Box
                    mt={{ base: "0", md: "8px", lgp: "0" }}
                    fontSize={{
                      base: "12px",
                      md: "14px",
                      sm: "12px",
                      lgp: "14px",
                    }}
                    fontWeight="400"
                    margin="0"
                    color="gray.500"
                    fontStyle="italic"
                    display={{
                      base: "inline-block",
                      md: "inline-block",
                      sm: "inline",
                    }}
                    paddingLeft={{
                      base: "8px",
                      md: "0",
                      sm: "6px",
                      lgp: "10px",
                    }}
                    dir={lang.includes("ar") ? "ltr" : "initial"}
                  >
                    +/- 20%
                  </Box>
                </Text>
              </Box>
            </Box>

            {assetAllocation?.finalData?.targetAssetAllocation?.illiquid?.data
              .length
              ? assetAllocation?.finalData?.targetAssetAllocation.illiquid.data?.map(
                  (illiquid: IlliquidTypes, index: number) => {
                    if (illiquid.subStrategy != "Opportunistic_Illiquid") {
                      return (
                        <Box
                          key={index}
                          className="target-allocation-grid-col"
                          minH={{ base: "auto", md: "100px" }}
                          paddingBottom={{ base: "16px", md: "10px" }}
                          position="relative"
                          order={
                            illiquid.subStrategy == "Capital Growth" ? "1" : "0"
                          }
                          borderBottom={{
                            base:
                              illiquid.subStrategy == "Capital Growth"
                                ? "none"
                                : "1px solid",
                            md: "none",
                          }}
                          borderBottomColor={{
                            base:
                              illiquid.subStrategy == "Capital Growth"
                                ? "none"
                                : "gray.700",
                            md: "none",
                          }}
                        >
                          <Box
                            paddingTop={{ base: "16px", md: "0" }}
                            paddingRight={{
                              base: "0",
                              md:
                                illiquid.subStrategy == "Capital Growth"
                                  ? "0"
                                  : "15px",
                            }}
                            paddingLeft={{
                              base: "0",
                              md: "24px",
                              lgp: "48px",
                            }}
                            _before={{
                              base: {
                                content: '""',
                                position: "absolute",
                                height: "100%",
                                width: "1px",
                                right: "-10px",
                                top: "-12px",
                                backgroundColor: "#4d4d4d",
                                display: {
                                  base: "none",
                                  md:
                                    illiquid.subStrategy == "Capital Growth"
                                      ? "none"
                                      : "block",
                                },
                              },
                            }}
                          >
                            <Text
                              fontSize={{
                                base: "14px",
                                md: "18px",
                                sm: "14px",
                                lgp: "18px",
                              }}
                              fontWeight="700"
                              margin={{ base: "0 0 8px", md: "0 0 15px" }}
                              color="gray.500"
                            >
                              {illiquid.subStrategy == "Capital Growth"
                                ? t(
                                    `targetAssetAllocation.illiquid.capitalGrowth.title`,
                                  )
                                : t(
                                    `targetAssetAllocation.illiquid.capitalYielding.title`,
                                  )}
                            </Text>
                            <Text
                              fontSize={{
                                base: "16px",
                                md: "26px",
                                sm: "16px",
                                lgp: "26px",
                              }}
                              fontWeight="400"
                              margin="0"
                              color="#fff"
                              display="flex"
                              flexDir={{
                                base: "row",
                                md: "column",
                                lgp: "row",
                              }}
                              alignItems={{
                                base: "center",
                                md: "start",
                                lgp: "center",
                              }}
                            >
                              {illiquid.targetAssetAllocationPercent}%
                              <Box
                                mt={{ base: "0", md: "8px", lgp: "0" }}
                                fontSize={{
                                  base: "12px",
                                  md: "14px",
                                  sm: "12px",
                                  lgp: "14px",
                                }}
                                fontWeight="400"
                                margin="0"
                                color="gray.500"
                                fontStyle="italic"
                                display={{
                                  base: "inline-block",
                                  md: "inline-block",
                                  sm: "inline",
                                }}
                                paddingLeft={{
                                  base: "8px",
                                  md: "0",
                                  sm: "6px",
                                  lgp: "10px",
                                }}
                              >
                                <Text as="span" d="inline-block" mr="3px">
                                  {illiquid.currentAssetAllocationPercent}%{" "}
                                  {t("common:client.currently")}
                                </Text>

                                <Text as="span" d="inline-block">
                                  (
                                  <Text
                                    as="span"
                                    d="inline-block"
                                    dir={
                                      lang.includes("ar") ? "ltr" : "initial"
                                    }
                                    mr="3px"
                                  >
                                    {illiquid.deviation}%
                                  </Text>
                                  {t("common:client.deviation")})
                                </Text>
                              </Box>
                            </Text>
                          </Box>
                        </Box>
                      )
                    }
                  },
                )
              : false}
          </SimpleGrid>
        </Box>
      </Box>
    </Container>
  )
}
