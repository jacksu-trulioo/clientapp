import { Box, Container, Text } from "@chakra-ui/layout"
import useTranslation from "next-translate/useTranslation"
import React from "react"

export default function AssetAllocationHeader() {
  const { t } = useTranslation("assetAllocation")

  return (
    <Container as="section" maxW="full" px="0" flexDirection="row">
      <Box>
        <Text
          fontWeight="400"
          fontSize="30px"
          lineHeight="120%"
          color="contrast.200"
        >
          {t("heading")}
        </Text>
        <Text
          color="#c7c7c7"
          fontSize="18px"
          marginTop="8px"
          fontWeight="400"
          lineHeight="120%"
        >
          {t("description")}
        </Text>
      </Box>
      <Box>
        <Text
          fontStyle="normal"
          fontWeight="700"
          fontSize="18px"
          lineHeight="120%"
          color="#fff"
          marginTop="40px"
          marginBottom="16px"
        >
          {t("objectives.title")}
        </Text>
        <Text fontSize="20px" fontWeight="400" lineHeight="120%" mb="16px">
          {t("objectives.objectives.ObjectiveOneDescriptionOne")}{" "}
          <span style={{ color: "#b88955" }}>
            {t("objectives.objectives.ObjectiveOneDescriptionTwo")}
          </span>
        </Text>
        <Text fontSize="20px" fontWeight="400" lineHeight="120%">
          {t("objectives.objectives.ObjectiveTwoDescriptionOne")}{" "}
          <span style={{ color: "#b88955" }}>
            {t("objectives.objectives.ObjectiveTwoDescriptionTwo")}
          </span>{" "}
          {t("objectives.objectives.ObjectiveTwoDescriptionThree")}
        </Text>
      </Box>
    </Container>
  )
}
