import { Box, Container, Text } from "@chakra-ui/layout"
import useTranslation from "next-translate/useTranslation"
import React from "react"

type AssetAllocationProps = {
  selectedData: {
    year: never | undefined
    data: {
      name: string
      value: []
      color: string
      assetDescription: string
    }[]
  }
}

export default function AssetAllocationYearByClass({
  selectedData,
}: AssetAllocationProps) {
  const { lang, t } = useTranslation("assetAllocation")
  return (
    <Container as="section" maxW="full" px="0" flexDirection="row">
      <Box>
        <Text
          className="assets-heading"
          aria-label="assetsHeading"
          role={"heading"}
        >
          {selectedData.year}
          <span
            style={{
              fontSize: "14px",
              fontWeight: "300",
              margin: "0",
              color: "#aaa",
              display: "inline-block",
              paddingLeft: "5px",
              paddingRight: lang.includes("ar") ? "5px" : "0",
            }}
          >
            {" "}
            {t("assetAllocationOvertheYears.subtitle")}
          </span>
        </Text>
      </Box>
      <Box>
        <ul className="assets-class-list">
          {selectedData?.data?.length > 0
            ? selectedData?.data?.map((asset, index) => (
                <li className="privateEquity" key={index}>
                  <span
                    className="class-icon"
                    style={{
                      background: asset?.color,
                      marginLeft: lang.includes("ar") ? "15px" : "0",
                    }}
                  ></span>
                  <span className="class-value positiveVal">
                    {asset.value}%
                  </span>
                  <div className="class-text">
                    <h5>{asset?.name}</h5>
                    <p>{asset?.assetDescription}</p>
                  </div>
                </li>
              ))
            : false}
        </ul>
      </Box>
    </Container>
  )
}
