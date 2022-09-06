import { Box, Container, Grid, Heading, Stack, Text } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/react"
import { format } from "date-fns"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import { ChakraUIMarkDownRenderer, InsightCard, Layout } from "~/components"
import { Insight, ManagementView } from "~/services/mytfo/types"
import { MarketReactionView, NewMarketPhase } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function ManagementDetailsScreen() {
  const { t, lang } = useTranslation("insights")
  const router = useRouter()
  const isMobileView = useBreakpointValue({ base: true, lg: false })
  const isOnlyMobileView = useBreakpointValue({ base: true, md: false })
  const selectedManagementViewId = router.query?.id

  React.useEffect(() => {
    if (selectedManagementViewId === "160140129") {
      event(MarketReactionView)
    }
    if (selectedManagementViewId === "160138277") {
      event(NewMarketPhase)
    }
  }, [selectedManagementViewId])

  const { data: managementView, error: managementViewError } =
    useSWR<ManagementView>(
      [
        `/api/portfolio/insights/management-view?id=${selectedManagementViewId}`,
        lang,
      ],
      (url, selectedLang) =>
        fetch(url, {
          headers: {
            "Accept-Language": selectedLang,
          },
        }).then((res) => res.json()),
    )
  const isManagementViewLoading = !managementView && !managementViewError
  // wait till the above call is completed and then make api call
  const { data, error } = useSWR<Insight[]>(
    managementView
      ? [
          `/api/portfolio/insights/top-management-views?excludingId=${managementView?.id}`,
          lang,
        ]
      : null,
    (url, selectedLang) =>
      fetch(url, {
        headers: {
          "Accept-Language": selectedLang,
        },
      }).then((res) => res.json()),
  )
  if (isManagementViewLoading || managementViewError || error) {
    return null
  }

  return (
    <Layout
      title={t("page.managementViews.title")}
      description={t("page.managementViews.description")}
      heroImage={managementView?.bannerImage}
    >
      <Container
        as="section"
        maxW="full"
        px="0"
        {...(isMobileView && !managementView?.bannerImage && { mt: 5 })}
      >
        <Text mb={{ base: 4, md: 6 }} color="secondary.500" fontWeight="bold">
          {t(`tag.${managementView?.insightType}`)}
        </Text>
        <Heading size="lg" mb={{ base: 10, md: 6 }}>
          {managementView?.title}
        </Heading>
        <Text
          color="gray.400"
          fontSize="xs"
          mb={{ base: 10, md: 8 }}
          fontFamily="Gotham"
        >
          {`${
            managementView?.publishDate
              ? format(new Date(managementView?.publishDate), "MMM dd yyyy")
              : ""
          } | ${managementView?.estimatedDuration}`}
        </Text>
        <Text fontSize="lg" color="gray.500" mb="10">
          <ChakraUIMarkDownRenderer>
            {managementView?.description || ""}
          </ChakraUIMarkDownRenderer>
        </Text>
        {managementView?.video && (
          <Box position="relative" height="50vw" maxH="558px" mb="10">
            <iframe
              key={managementView?.video}
              src={managementView?.video}
              frameBorder="0"
              width="100%"
              height="100%"
              allowFullScreen
              title={managementView?.title}
            />
          </Box>
        )}
        {/* management view content section code starts from here */}
        {managementView?.contents &&
          managementView?.contents.map((content) => (
            <Stack
              justifyContent="space-between"
              py="4"
              width="full"
              key={content.title}
              _last={{
                borderBottom: "2px",
                borderColor: "gray.800",
                pb: "12",
              }}
              _first={{ pt: "8" }}
            >
              <Heading as="h3" fontSize="2xl" mb="4">
                {content.title}
              </Heading>
              <ChakraUIMarkDownRenderer>
                {content.description}
              </ChakraUIMarkDownRenderer>
            </Stack>
          ))}
        {managementView?.disclaimer && (
          <Box mb="12">
            <Heading as="h3" fontSize="2xl" mb="8" fontStyle="italic">
              {t("label.disclaimer")}
            </Heading>
            <Text fontSize="xs" color="gray.500">
              <ChakraUIMarkDownRenderer>
                {managementView.disclaimer}
              </ChakraUIMarkDownRenderer>
            </Text>
          </Box>
        )}
        {/* related content section code starts from here */}
        {data && data.length > 0 && (
          <Heading as="h3" fontSize="2xl" mb="8" mt="12">
            {t("label.relatedContent")}
          </Heading>
        )}
      </Container>

      <Grid
        templateColumns={`repeat(${isOnlyMobileView ? 1 : 3}, 1fr)`}
        width="full"
        gap={{ base: "8", md: "6", lg: "8" }}
        mb="12"
      >
        {data &&
          data.length > 0 &&
          data
            ?.slice(0, 3)
            .map((insight) => (
              <InsightCard insight={insight} key={insight.id} />
            ))}
      </Grid>
    </Layout>
  )
}

export default withPageAuthRequired(ManagementDetailsScreen)
