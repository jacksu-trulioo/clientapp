import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion"
import {
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  Text,
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
import { Insight, MarketUpdate } from "~/services/mytfo/types"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function MarketUpdateScreen() {
  const { t, lang } = useTranslation("insights")
  const [isDownloaded, setIsDownloaded] = React.useState(false)

  const router = useRouter()
  const isMobileView = useBreakpointValue({ base: true, md: false })

  const id = router.query?.id
  const { data: marketUpdate, error: marketUpdateError } = useSWR<MarketUpdate>(
    [`/api/portfolio/insights/market-update?id=${id}`, lang],
    (url, lang) =>
      fetch(url, {
        headers: {
          "Accept-Language": lang,
        },
      }).then((res) => res.json()),
  )

  const isMarketUpdateLoading = !marketUpdate && !marketUpdateError

  // wait till the above call is completed and then make api call
  const { data: topMarketUpdates, error: topMarketUpdateError } = useSWR<
    Insight[]
  >(
    marketUpdate
      ? [
          `/api/portfolio/insights/top-market-updates?excludingId=${marketUpdate?.id}`,
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

  if (isMarketUpdateLoading) {
    return null
  }

  // Note: Pending design decisions from Product/Design.
  if (marketUpdateError) {
    return null
  }

  const downloadLink = () => {
    if (typeof window != "undefined" && marketUpdate?.downloadLink) {
      window.open(marketUpdate.downloadLink, "_blank")
      if (!isDownloaded) setIsDownloaded(true)
    }
  }

  return (
    <Layout
      title={t("page.marketUpdates.title")}
      description={t("page.marketUpdates.description")}
      heroImage={marketUpdate?.bannerImage}
    >
      <Container as="section" maxW="full" px="0">
        <Text mb={{ base: 4, md: 6 }} color="secondary.500" fontWeight="bold">
          {t(`tag.${marketUpdate?.insightType}`)}
        </Text>
        <Heading size="lg" mb={{ base: 10, md: 6 }}>
          {marketUpdate?.title}
        </Heading>
        <Text
          color="gray.400"
          fontSize="xs"
          mb={{ base: 10, md: 8 }}
          fontFamily="Gotham"
        >
          {`${
            marketUpdate?.publishDate
              ? format(new Date(marketUpdate.publishDate), "MMM dd yyyy")
              : ""
          } | ${marketUpdate?.estimatedDuration}`}
        </Text>

        <Text fontSize="xl" color="gray.500" mb="10">
          <ChakraUIMarkDownRenderer>
            {marketUpdate?.description || ""}
          </ChakraUIMarkDownRenderer>
        </Text>

        <Divider borderColor="gray.800" mb="12" border="1px" />
        <Accordion allowToggle w="full" mb="12">
          {marketUpdate?.contents &&
            marketUpdate?.contents.map((content) => (
              <AccordionItem
                aria-label="content"
                borderBottom="1px solid"
                borderBottomColor="gray.800"
                mb="0"
                key={content.title}
              >
                <h2>
                  <AccordionButton
                    bg="transparent"
                    p="0"
                    _hover={{ bg: "transparent" }}
                  >
                    <Flex justifyContent="space-between" py="6" width="full">
                      <Text textAlign="start" fontSize="xl">
                        {content.title}
                      </Text>
                      <AccordionIcon />
                    </Flex>
                  </AccordionButton>
                </h2>

                <AccordionPanel bg="transparent">
                  <ChakraUIMarkDownRenderer>
                    {content.description}
                  </ChakraUIMarkDownRenderer>
                </AccordionPanel>
              </AccordionItem>
            ))}
        </Accordion>
        {isDownloaded && (
          <Flex justify="flex-start" align="center" mb="6">
            <CheckCircleIcon color="primary.500" w="8" h="8" />
            <Heading color="gray.500" size="sm">
              {t("page.marketUpdates.downloadedMarketUpdate")}
            </Heading>
          </Flex>
        )}
        {marketUpdate?.downloadLink && (
          <Button
            colorScheme="primary"
            mb="12"
            isFullWidth={isMobileView}
            variant={isDownloaded ? "outline" : "solid"}
            onClick={downloadLink}
          >
            {isDownloaded
              ? t("common:button.downloadAgain")
              : t("common:button.downloadMarketUpdate")}
          </Button>
        )}
        {marketUpdate?.disclaimer && (
          <Box mb="12">
            <Heading as="h3" fontSize="2xl" mb="8" fontStyle="italic">
              {t("label.disclaimer")}
            </Heading>
            <Text fontSize="xs" color="gray.500">
              <ChakraUIMarkDownRenderer>
                {marketUpdate.disclaimer}
              </ChakraUIMarkDownRenderer>
            </Text>
          </Box>
        )}
        {topMarketUpdates &&
          !topMarketUpdateError &&
          topMarketUpdates.length > 0 && (
            <Heading as="h3" fontSize="2xl" mb="8">
              {t("label.relatedContent")}
            </Heading>
          )}
      </Container>

      <Grid
        templateColumns={`repeat(${isMobileView ? 1 : 3}, 1fr)`}
        width="full"
        gap={{ base: "8", md: "6", lg: "8" }}
        mb="12"
      >
        {topMarketUpdates &&
          !topMarketUpdateError &&
          topMarketUpdates.length > 0 &&
          topMarketUpdates
            ?.slice(0, 3)
            .map((insight) => (
              <InsightCard insight={insight} key={insight.id} />
            ))}
      </Grid>
    </Layout>
  )
}

export default withPageAuthRequired(MarketUpdateScreen)
