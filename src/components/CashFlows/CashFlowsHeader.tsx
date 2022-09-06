import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/layout"
import useTranslation from "next-translate/useTranslation"
import React from "react"

type CashFlowProps = {
  cashflowData?: {
    year?: string | number
    ytdDistributionProjection: string | number
    ytdCapitalCallProjection: string | number
    itdDistributionProjection: string | number
    itdCapitalCallProjection: string | number
  }
}

export default function CashFlowsHeader({ cashflowData }: CashFlowProps) {
  const { t, lang } = useTranslation("cashflow")

  return (
    <Container as="section" maxW="full" px="0" flexDirection="row">
      <Box>
        <Text fontWeight="400" fontSize="30px" lineHeight="120%" color="#fff">
          {t("heading")}
        </Text>
        <Text
          color="#c7c7c7"
          fontSize={{ base: "18px", md: "18px", sm: "14px" }}
          marginTop={{ lgp: "13px", md: "8px", sm: "8px" }}
          fontWeight="400"
          lineHeight="120%"
        >
          {t("description")}
        </Text>
        <Heading
          fontWeight="400"
          fontSize="14px"
          color="contrast.200"
          mt={{ lgp: "40px", base: "24px", md: "24px" }}
          mb={{ base: "24px", lgp: "0", md: "24px" }}
        >
          {t("actualized.title")}
        </Heading>
      </Box>
      <Box p={{ lgp: "32px 0px", md: "0 30px", base: "0" }}>
        <Grid
          templateColumns={{
            base: "repeat(2, 1fr)",
            lgp: "repeat(2, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={{ base: "60px", md: "90px" }}
          pos="relative"
          _after={{
            display: {
              base: "block",
              lgp: "none",
            },
            content: '""',
            position: "absolute",
            insetStart: "50%",
            height: "142%",
            width: "1px",
            top: "-3px",
            backgroundColor: {
              base: "gray.700",
              md: "gray.700",
            },
          }}
          _before={{
            display: {
              base: "block",
              lgp: "none",
            },
            content: '""',
            position: "absolute",
            height: "1px",
            width: "110%",
            bottom: {
              base: "-17px",
              md: "-23px",
            },
            left: {
              base: "-16px",
              md: "-40px",
            },
            backgroundColor: {
              base: "gray.700",
              md: "gray.700",
            },
          }}
        >
          <GridItem p={{ sm: "40px 0", md: "50px 30px", lgp: "0" }}>
            <Heading
              color="gray.400"
              fontSize={{ base: "14px", md: "18px" }}
              fontWeight="700"
              mb={{ base: "16px", md: "15px", lgp: "4px" }}
              pl={{ lgp: lang === "en" ? "26px" : "0", md: "0", base: "0" }}
              pr={{ lgp: lang === "ar" ? "22px" : "0", md: "0", base: "0" }}
            >
              {cashflowData?.year} {t("actualized.YTDDistribution")}
            </Heading>
            <Box>
              <Text
                fontSize={{ base: "16px", md: "26px", lgp: "36px" }}
                color="white"
                fontWeight="400"
                display="inline-block"
              >
                <Box as="span">$</Box>
                {cashflowData?.ytdDistributionProjection}
              </Text>
            </Box>
          </GridItem>
          <GridItem p={{ sm: "40px 0", md: "50px 30px", lgp: "0" }}>
            <Heading
              color="gray.400"
              fontSize={{ base: "14px", md: "18px" }}
              fontWeight="700"
              mb={{ base: "16px", md: "15px", lgp: "4px" }}
              pl={{ lgp: lang === "en" ? "26px" : "0", md: "0", base: "0" }}
              pr={{ lgp: lang === "ar" ? "22px" : "0", md: "0", base: "0" }}
            >
              {t("actualized.ITDDistribution")}
            </Heading>
            <Box>
              <Heading
                fontSize={{ base: "16px", md: "26px", lgp: "36px" }}
                color="white"
                fontWeight="400"
                display="inline-block"
              >
                <Box as="span">$</Box>
                {cashflowData?.itdDistributionProjection}
              </Heading>
            </Box>
          </GridItem>
        </Grid>
        <Grid
          mt={{ base: "32px", md: "40px", lgp: "40px" }}
          templateColumns={{
            base: "repeat(2, 1fr)",
            lgp: "repeat(2, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={{ base: "60px", md: "90px" }}
          pos="relative"
          _after={{
            display: {
              base: "block",
              lgp: "none",
            },
            content: '""',
            position: "absolute",
            insetStart: "50%",
            height: "135%",
            width: "1px",
            top: "-12px",
            backgroundColor: {
              base: "gray.700",
              md: "gray.700",
            },
          }}
        >
          <GridItem p={{ sm: "40px 0", md: "50px 30px", lgp: "0" }}>
            <Heading
              color="gray.400"
              fontSize={{ base: "14px", md: "18px" }}
              fontWeight="700"
              mb={{ base: "16px", md: "15px", lgp: "4px" }}
              pl={{ lgp: lang === "en" ? "26px" : "0", md: "0", base: "0" }}
              pr={{ lgp: lang === "ar" ? "22px" : "0", md: "0", base: "0" }}
            >
              {cashflowData?.year} {t("actualized.YTDCapitalCall")}
            </Heading>
            <Box>
              <Heading
                fontSize={{ base: "16px", md: "26px", lgp: "36px" }}
                color="white"
                fontWeight="400"
                display="inline-block"
              >
                <Box as="span">$</Box>
                {cashflowData?.ytdCapitalCallProjection}
              </Heading>
            </Box>
          </GridItem>
          <GridItem p={{ sm: "40px 0", md: "50px 30px", lgp: "0" }}>
            <Heading
              color="gray.400"
              fontSize={{ base: "14px", md: "18px" }}
              fontWeight="700"
              mb={{ base: "16px", md: "15px", lgp: "4px" }}
              pl={{ lgp: lang === "en" ? "26px" : "0", md: "0", base: "0" }}
              pr={{ lgp: lang === "ar" ? "22px" : "0", md: "0", base: "0" }}
            >
              {t("actualized.ITDCapitalCall")}
            </Heading>
            <Box>
              <Heading
                fontSize={{ base: "16px", md: "26px", lgp: "36px" }}
                color="white"
                fontWeight="400"
                display="inline-block"
              >
                <Box as="span">$</Box>
                {cashflowData?.itdCapitalCallProjection}
              </Heading>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Container>
  )
}
