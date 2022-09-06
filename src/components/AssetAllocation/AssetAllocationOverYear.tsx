import { Box, Container, Text } from "@chakra-ui/layout"
import useTranslation from "next-translate/useTranslation"
import React from "react"

type AssetAllocationProps = {
  assetAllocation: {
    finalData: {
      metaData: {}
      targetAssetAllocation: {}
      assetAllocationOverYears: {
        assetClassValues: []
        years: []
        liquidAtBeginning: number
        illiquidAtBeginning: number
        illiquidAfterCommitments: number
        liquidAfterCommitments: number
      }
      detailedPerformance: {}
      overallPerformance: {}
      maximumDrawDown: {}
    }
    isSourceExists: boolean
    nonAA: boolean
  }
}

export default function AssetAllocationOverYear({
  assetAllocation,
}: AssetAllocationProps) {
  const { t } = useTranslation("assetAllocation")

  return (
    <Container as="section" maxW="full" px="0" flexDirection="row">
      <Box
        className="a-section"
        marginTop={{ base: "32px", md: "80px", sm: "30px" }}
        marginBottom="50px"
      >
        <Text
          className="insightHeader"
          fontStyle="normal"
          fontWeight="700"
          fontSize="18px"
          lineHeight="120%"
          color="#fff"
          marginTop={{ base: "0", md: "80px" }}
          marginBottom="32px"
        >
          {t("assetAllocationOvertheYears.title")}{" "}
          <span>{t("assetAllocationOvertheYears.subtitle")}</span>
        </Text>
        <Text
          maxWidth="680px"
          fontSize="20px"
          lineHeight="120%"
          fontWeight="400"
          mb="16px"
        >
          {t(
            "assetAllocationOvertheYears.liquidAndIlliquidBeginning.descriptionOne",
          )}
          <span style={{ color: "#b88955" }}>
            {" "}
            {
              assetAllocation?.finalData?.assetAllocationOverYears
                ?.liquidAtBeginning
            }
            %{" "}
          </span>
          {t("common:client.and")}
          <span style={{ color: "#b88955" }}>
            {" "}
            {
              assetAllocation?.finalData?.assetAllocationOverYears
                ?.illiquidAtBeginning
            }
            %{" "}
          </span>
          {t(
            "assetAllocationOvertheYears.liquidAndIlliquidBeginning.descriptionThree",
          )}
        </Text>
        <Text
          fontSize="20px"
          maxWidth="680px"
          lineHeight="120%"
          fontWeight="400"
        >
          {t(
            "assetAllocationOvertheYears.liquidAndIlliquidAfterCommitments.descriptionOne",
          )}
          <span style={{ color: "#b88955" }}>
            {" "}
            {
              assetAllocation?.finalData?.assetAllocationOverYears
                ?.liquidAfterCommitments
            }
            %{" "}
          </span>
          {t("common:client.and")}
          <span style={{ color: "#b88955" }}>
            {" "}
            {
              assetAllocation?.finalData?.assetAllocationOverYears
                ?.illiquidAfterCommitments
            }
            %{" "}
          </span>
          {t(
            "assetAllocationOvertheYears.liquidAndIlliquidAfterCommitments.descriptionThree",
          )}
        </Text>
      </Box>
    </Container>
  )
}
