import { Button } from "@chakra-ui/button"
import {
  Box,
  Container,
  Divider,
  Grid,
  Heading,
  HStack,
  Text,
} from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/media-query"
import { Flex, Stack } from "@chakra-ui/react"
import ky from "ky"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR, { mutate } from "swr"
import useSWRImmutable from "swr/immutable"

import {
  BlackCheckIcon,
  Card,
  CardContent,
  CaretLeftIcon,
  CaretRightIcon,
  InfoIcon,
  InsightCard,
  Layout,
  Link,
} from "~/components"
import {
  Disclaimer,
  Insight,
  Insights,
  InsightType,
  OpportunitiesResponse,
  UserQualificationStatus,
} from "~/services/mytfo/types"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function InsightsScreen() {
  const { t, lang } = useTranslation("insights")
  const [understood, setUnderstood] = React.useState<boolean>(true)
  const [disclaimerLoader, setDisclaimerLoader] = React.useState(false)
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = useBreakpointValue({ base: false, md: false, lg: true })
  const isTabletView = useBreakpointValue({ base: false, md: true, lg: false })

  const { data, error } = useSWRImmutable<Insights[]>("/api/portfolio/insights")

  const { data: qualificationStatus, error: qualificationstatusError } =
    useSWR<OpportunitiesResponse>(
      ["/api/portfolio/opportunities", lang],

      (url, lang) =>
        fetch(url, {
          headers: {
            "Accept-Language": lang,
          },
        }).then((res) => res.json()),
    )
  const isLoadingQualificationstatus =
    !qualificationStatus && !qualificationstatusError
  const isVerified =
    qualificationStatus?.status === UserQualificationStatus.Verified

  const { data: disclaimerStatus, error: disclaimerError } = useSWR<Disclaimer>(
    "/api/user/preference/disclaimer",
  )
  const isLoadingDisclaimer = !disclaimerStatus && !disclaimerError

  React.useEffect(() => {
    if (!isVerified) {
      setUnderstood(true)
      return
    }

    if (disclaimerStatus?.disclaimerAccepted) {
      setUnderstood(true)
      return
    }
    if (!disclaimerStatus?.disclaimerAccepted) {
      setUnderstood(false)
      return
    }
    if (disclaimerError) setUnderstood(false)
  }, [disclaimerStatus?.disclaimerAccepted, disclaimerError, isVerified])

  const direction = lang === "ar" ? "rtl" : "ltr"
  const isLoading = !data && !error

  const cardLimit = isMobileView ? 1 : 3

  function getInsightPath(type: InsightType) {
    switch (type) {
      case "Article": {
        return "/insights/articles"
      }
      case InsightType.Whitepaper: {
        return "/insights/whitepapers"
      }
      case "Webinar": {
        return "/insights/webinars"
      }
      case InsightType.MarketUpdate: {
        return "/insights/market-updates"
      }
      case InsightType.ManagementView: {
        return "/insights/management-views"
      }
      default: {
        return "/insights"
      }
    }
  }

  if (isLoading) {
    return null
  }

  // Note: Pending design decisions from Product/Design.
  if (error) {
    return null
  }

  const onSubmitDisclaimer = async () => {
    setDisclaimerLoader(true)

    try {
      const disclaimerResponse = await ky
        .patch("/api/user/preference/disclaimer")
        .json<Disclaimer>()

      await mutate<Disclaimer>(
        "/api/user/preference/disclaimer",
        disclaimerResponse,
      )
      setUnderstood(true)
      setDisclaimerLoader(false)
    } catch (e) {
      setDisclaimerLoader(false)
    }
  }

  return (
    <>
      <Layout
        title={t("page.index.title")}
        description={t("page.index.description")}
        understood={!understood}
      >
        <Container
          as="section"
          maxW="full"
          px="0"
          pt={{ base: 8, lg: 0 }}
          {...(!understood && {
            filter: "blur(1px)",
            opacity: "0.4",
            pointerEvents: "none",
          })}
        >
          <Heading as="h1" mb="6" textAlign={{ base: "center", md: "start" }}>
            {t("page.index.heading")}
          </Heading>
          <Text
            as="h3"
            fontSize="xl"
            color="gray.500"
            mb="16"
            textAlign={{ base: "center", md: "start" }}
          >
            {t("page.index.subheading")}
          </Text>
          {data?.map((insights: Insights) => (
            <Box key={insights.type}>
              <Divider
                borderColor="gray.800"
                border="2px solid"
                mb={{ base: "6", md: "8" }}
              />
              <Box aria-label="insightContainer" w="full" mb="12">
                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  pb="8"
                >
                  <Heading as="h2" fontSize={["xl", "2xl"]}>
                    {t(`label.${insights.type}`)}
                  </Heading>
                  {insights?.insights?.length > cardLimit && (
                    <Button
                      colorScheme="primary"
                      as={Link}
                      role="link"
                      variant="link"
                      size="sm"
                      href={getInsightPath(insights.type)}
                      rightIcon={
                        direction === "rtl" ? (
                          <CaretLeftIcon w="6" h="6" />
                        ) : (
                          <CaretRightIcon w="6" h="6" />
                        )
                      }
                    >
                      {t("common:button.seeMore")}
                    </Button>
                  )}
                </HStack>
                <Grid
                  templateColumns={`repeat(${isMobileView ? 1 : 3}, 1fr)`}
                  width="full"
                  gap={{ base: "8", md: "6", lg: "8" }}
                >
                  <>
                    {insights.insights
                      ?.slice(0, cardLimit)
                      .map((insight: Insight) => {
                        return (
                          <InsightCard insight={insight} key={insight.id} />
                        )
                      })}
                  </>
                </Grid>
              </Box>
            </Box>
          ))}
        </Container>
        {!understood &&
          (isDesktopView || isTabletView) &&
          !isLoadingDisclaimer &&
          isVerified &&
          !isLoadingQualificationstatus && (
            <Card
              aria-label="opportunitiesDisclaimer"
              bg="gunmetal.700"
              maxW="full"
              mt="8"
              mb="8"
              zIndex="overlay"
              position="sticky"
              bottom="10"
            >
              <CardContent p="6">
                <Stack direction="row" spacing="4">
                  <InfoIcon color="primary.500" w={6} h={6} />
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    alignItems="flex-start"
                    gridColumnGap="3"
                    gridRowGap="5"
                  >
                    <Text textAlign="justify" fontSize="sm">
                      {t("common:disclaimer.description")}
                    </Text>
                    <Button
                      ms={{ md: "3", lg: "3" }}
                      alignSelf="center"
                      maxW="md"
                      w="full"
                      colorScheme="primary"
                      onClick={() => {
                        onSubmitDisclaimer()
                      }}
                      leftIcon={<BlackCheckIcon />}
                      disabled={disclaimerLoader}
                    >
                      {t("common:disclaimer.button")}
                    </Button>
                  </Flex>
                </Stack>
              </CardContent>
            </Card>
          )}
      </Layout>
      {!understood &&
        !isDesktopView &&
        !isLoadingDisclaimer &&
        isVerified &&
        !isLoading &&
        !isTabletView && (
          <Card
            aria-label="opportunitiesDisclaimer"
            bg="gunmetal.700"
            maxW="full"
            mt="8"
            mb="8"
            zIndex="overlay"
            position="sticky"
            bottom="0"
          >
            <CardContent p="6">
              <Stack direction="row" spacing="4">
                <InfoIcon color="primary.500" w={6} h={6} />
                <Flex direction="column" gridRowGap="4">
                  <Text fontSize="sm">
                    {t("common:disclaimer.description")}
                  </Text>
                  <Button
                    colorScheme="primary"
                    alignSelf={{ md: "flex-end" }}
                    onClick={() => {
                      onSubmitDisclaimer()
                    }}
                    leftIcon={<BlackCheckIcon />}
                    disabled={disclaimerLoader}
                  >
                    {t("common:disclaimer.button")}
                  </Button>
                </Flex>
              </Stack>
            </CardContent>
          </Card>
        )}
    </>
  )
}

export default withPageAuthRequired(InsightsScreen)
