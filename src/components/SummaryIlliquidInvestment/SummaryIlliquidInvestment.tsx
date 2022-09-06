import { Box, Container, Stack, Text } from "@chakra-ui/layout"
import { Hide, Image } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

function SummaryIlliquidInvestment() {
  const { t } = useTranslation("portfolioSummary")

  return (
    <Container
      as="section"
      maxW="full"
      className="illiquidBanner"
      background="linear-gradient(180deg,#3d3a36,#443c33)"
      borderRadius="6px"
      cursor="pointer"
      overflow="hidden"
      p="0"
    >
      <Box
        className="illiquidBannerInner"
        p={{ base: "32px 26px", md: "48px", lgp: "26px 64px" }}
      >
        <Box
          className="bannerContent"
          alignItems="center"
          flexDirection={{ base: "column", md: "row", lgp: "row" }}
          display="flex"
        >
          <Hide below="sm">
            <Box className="bannerFrame" marginRight="20px" textAlign="left">
              <Image
                w="168px"
                maxW="168px"
                alt="image"
                src={`/images/${"Frame_1728"}.svg`}
              />
            </Box>
          </Hide>
          <Box flex="1 0 0%" width="100%">
            <Hide above="sm">
              <Box
                textAlign={{ base: "center", md: "left", lgp: "left" }}
                mb={{ base: "20px", md: "25px" }}
              >
                <Image
                  w="168px"
                  maxW="168px"
                  d="inline-block"
                  alt="image"
                  src={`/images/${"Frame_1728"}.svg`}
                />
              </Box>
            </Hide>
            <Text
              className="bannerTitle"
              fontSize="20px"
              paddingBottom="8px"
              color="primary.500"
              fontStyle="normal"
              fontWeight="400"
              lineHeight="120%"
            >
              {t("underStandingInvestment.title")}
            </Text>
            <Text
              className="bannerDescription"
              fontStyle="normal"
              fontSize="18px"
              fontWeight="400"
              lineHeight="120%"
              color="contrast.200"
            >
              {t("underStandingInvestment.subTitle")}
            </Text>
          </Box>
          <Box
            ml={{ base: "0", md: "16px", lgp: "16px" }}
            mt={{ base: "30px", md: "0", lgp: "0" }}
          >
            <Stack
              align="center"
              justify="center"
              direction="row"
              width="max-content"
            >
              <Box
                as="button"
                className="bannerCTA"
                background="primary.500"
                borderRadius="2px"
                padding="10px 16px"
                fontStyle="normal"
                fontWeight="600"
                fontSize="16px"
                lineHeight="120%"
                color="gray.850"
              >
                {t("underStandingInvestment.button")}
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default SummaryIlliquidInvestment
