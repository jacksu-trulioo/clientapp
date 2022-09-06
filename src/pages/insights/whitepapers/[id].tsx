import {
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/layout"
import { Button, useBreakpointValue } from "@chakra-ui/react"
import { format } from "date-fns"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import {
  ChakraUIMarkDownRenderer,
  CheckCircleIcon,
  InsightCard,
  Layout,
} from "~/components"
import { Insight, Whitepaper } from "~/services/mytfo/types"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function WhitepaperScreen() {
  const { t, lang } = useTranslation("insights")
  const [isDownloaded, setIsDownloaded] = React.useState(false)
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const router = useRouter()
  const id = router.query?.id
  const { data: whitepaper, error: whitepaperError } = useSWR<Whitepaper>(
    [`/api/portfolio/insights/whitepaper?id=${id}`, lang],
    (url, lang) =>
      fetch(url, {
        headers: {
          "Accept-Language": lang,
        },
      }).then((res) => res.json()),
  )

  const isWhitePaperLoading = !whitepaper && !whitepaperError

  const { data: topWhitepaperUpdates, error: topWhitepaperUpdateError } =
    useSWR<Insight[]>(
      whitepaper
        ? [
            `/api/portfolio/insights/top-whitepapers/?excludingId=${whitepaper.id}`,
            lang,
          ]
        : null,
      (url, lang) =>
        fetch(url, {
          headers: {
            "Accept-Language": lang,
          },
        }).then((res) => res.json()),
    )

  const downloadLink = () => {
    if (typeof window != "undefined" && whitepaper?.downloadLink) {
      window.open(whitepaper.downloadLink, "_blank")
      if (!isDownloaded) setIsDownloaded(true)
    }
  }

  if (isWhitePaperLoading) {
    return null
  }

  // Note: Pending design decisions from Product/Design.
  if (whitepaperError) {
    return null
  }

  return (
    <Layout
      title={t("page.whitepapers.title")}
      description={t("page.whitepapers.description")}
      heroImage={whitepaper?.bannerImage}
    >
      <Container as="section" maxW="full" px="0">
        <Text mb={{ base: 4, md: 6 }} color="secondary.500" fontWeight="bold">
          {t(`tag.${whitepaper?.insightType}`)}
        </Text>
        <Heading size="lg" mb={{ base: 10, md: 6 }}>
          {whitepaper?.title}
        </Heading>
        <Text
          color="gray.400"
          fontSize="xs"
          mb={{ base: 10, md: 8 }}
          fontFamily="Gotham"
        >
          {`${
            whitepaper?.publishDate
              ? format(new Date(whitepaper.publishDate), "MMM dd yyyy")
              : ""
          } | ${whitepaper?.estimatedDuration}`}
        </Text>

        <Text fontSize="xl" color="gray.500" mb="10">
          <ChakraUIMarkDownRenderer>
            {whitepaper?.description || ""}
          </ChakraUIMarkDownRenderer>
        </Text>

        <Divider borderColor="gray.800" mb="12" border="1px" />
        <VStack mb="12" spacing="12" width="full" align="flex-start">
          {whitepaper?.contents &&
            whitepaper.contents.map((content) => (
              <Box
                me={{ base: "10", md: "3" }}
                minW={{ base: "12", md: "72px" }}
                justifyItems="flex-start"
                key={content.title}
              >
                <Heading size="sm" mb={{ base: 10, md: 6 }}>
                  {content.title}
                </Heading>
                <ChakraUIMarkDownRenderer>
                  {content.description}
                </ChakraUIMarkDownRenderer>
              </Box>
            ))}
        </VStack>
        {isDownloaded && (
          <Flex justify="flex-start" align="center" mb="6">
            <CheckCircleIcon color="primary.500" w="8" h="8" />
            <Heading color="gray.500" size="sm">
              {t("page.whitepapers.downloadedWhitepaper")}
            </Heading>
          </Flex>
        )}
        <Button
          colorScheme="primary"
          mb="12"
          isFullWidth={isMobileView}
          variant={isDownloaded ? "outline" : "solid"}
          onClick={downloadLink}
        >
          {isDownloaded
            ? t("common:button.downloadAgain")
            : t("common:button.downloadWhitepaper")}
        </Button>
        {whitepaper?.disclaimer && (
          <Box mb="12">
            <Heading as="h3" fontSize="2xl" mb="8" fontStyle="italic">
              {t("label.disclaimer")}
            </Heading>
            <Text fontSize="xs" color="gray.500">
              <ChakraUIMarkDownRenderer>
                {whitepaper.disclaimer}
              </ChakraUIMarkDownRenderer>
            </Text>
          </Box>
        )}
        {topWhitepaperUpdates &&
          !topWhitepaperUpdateError &&
          topWhitepaperUpdates.length > 0 && (
            <>
              <Divider borderColor="gray.800" mb="12" border="1px" />
              <Heading as="h3" fontSize="2xl" mb="8">
                {t("label.relatedContent")}
              </Heading>
            </>
          )}
      </Container>

      <Grid
        templateColumns={`repeat(${isMobileView ? 1 : 3}, 1fr)`}
        width="full"
        gap={{ base: "8", md: "6", lg: "8" }}
        mb="12"
      >
        {topWhitepaperUpdates &&
          !topWhitepaperUpdateError &&
          topWhitepaperUpdates.length > 0 &&
          topWhitepaperUpdates
            ?.slice(0, 3)
            .map((insight) => (
              <InsightCard insight={insight} key={insight.id} />
            ))}
      </Grid>
    </Layout>
  )
}

export default withPageAuthRequired(WhitepaperScreen)
