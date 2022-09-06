import { Button } from "@chakra-ui/button"
import {
  Box,
  Circle,
  Container,
  Divider,
  Grid,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/media-query"
import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import ky from "ky"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useState } from "react"
import useSWR, { mutate } from "swr"

import {
  BlackCheckIcon,
  Card,
  CardContent,
  InfoIcon,
  InvestmentOpportunityCard,
  Layout,
  PersonIcon,
  PortfolioSimulatorWidget,
  SkeletonOpportunityCard,
  VerifyProfileIcon,
} from "~/components"
import {
  Disclaimer,
  OpportunitiesResponse,
  UserQualificationStatus,
} from "~/services/mytfo/types"
import { clickedClosedDealTab, clickedOpenDealTab } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function OpportunitiesScreen() {
  const { t } = useTranslation("opportunities")
  const [understood, setUnderstood] = useState<boolean>(true)
  const [disclaimerLoader, setDisclaimerLoader] = useState(false)
  const isDesktopView = useBreakpointValue({ base: false, md: false, lg: true })
  const isTabletView = useBreakpointValue({ base: false, md: true, lg: false })

  const { data, error } = useSWR<OpportunitiesResponse>(
    "/api/portfolio/opportunities",
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  )

  const { data: disclaimerStatus, error: disclaimerError } = useSWR<Disclaimer>(
    "/api/user/preference/disclaimer",
  )

  useEffect(() => {
    if (router.asPath.split("#")[1] == "closed") {
      router.push(`/opportunities#closed`)
    } else {
      router.push(`/opportunities#open`)
    }
  }, [])

  const isVerified = data?.status === UserQualificationStatus.Verified
  const isLoadingDisclaimer = !disclaimerStatus && !disclaimerError

  const isLoading = !data && !error
  const isUnverified = data?.status === UserQualificationStatus.Unverified
  const isCardBtnFullWidth = useBreakpointValue({ base: true, md: false })
  const opportunitiesShown = useBreakpointValue({ base: 1, md: 2, lg: 3 })
  const defaultCardType =
    data?.status === UserQualificationStatus.Unverified
      ? "defaultUnlock"
      : "defaultVerify"

  useEffect(() => {
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

  const OpportunityList = ({
    isOpportunityClosed,
  }: {
    isOpportunityClosed: boolean
  }) => {
    return (
      <Grid
        templateColumns={`repeat(${opportunitiesShown}, 1fr)`}
        width="full"
        gap={{ base: "8", md: "6", lg: "8" }}
        justifyContent={useBreakpointValue({
          base: "center",
          md: "space-between",
          lg: "space-between",
        })}
        mb="12"
      >
        {isLoading ? (
          <>
            <SkeletonOpportunityCard flex="1 1 218px" />
            <SkeletonOpportunityCard flex="1 1 218px" />
            <SkeletonOpportunityCard flex="1 1 218px" />
          </>
        ) : (
          <>
            {data?.opportunities
              .filter(
                (opportunity) =>
                  opportunity.isOpportunityClosed === isOpportunityClosed,
              )
              .map((opportunity) => {
                return (
                  <InvestmentOpportunityCard
                    key={opportunity.id}
                    data={opportunity}
                    status={data?.status}
                    variant="detailed"
                    hasOverlay={isUnverified}
                  />
                )
              })}
          </>
        )}
      </Grid>
    )
  }

  return (
    <>
      <Layout
        title={t("index.page.title")}
        description={t("index.page.description")}
        understood={!understood}
      >
        <Container
          as="section"
          maxW="full"
          px="0"
          {...(!understood && {
            filter: "blur(1px)",
            opacity: "0.4",
            pointerEvents: "none",
          })}
        >
          <Heading
            as="h1"
            mb="6"
            mt={{ base: 8, lg: 0 }}
            textAlign={{ base: "center", md: "start" }}
          >
            {t("index.heading")}
          </Heading>
          <Text
            as="h3"
            fontSize="xl"
            color="gray.500"
            mb="8"
            textAlign={{ base: "center", md: "start" }}
          >
            {t(
              data?.status === UserQualificationStatus.PendingApproval
                ? "index.subheading.pendingApproval"
                : "index.subheading.unverified",
            )}
          </Text>

          {!isLoading &&
            (data?.status === UserQualificationStatus.Unverified ||
              data?.status === UserQualificationStatus.PendingApproval) && (
              <Card bg="gunmetal.500" w="full" mb="10">
                <CardContent p="8">
                  <Stack
                    direction={{ base: "column", md: "row" }}
                    textAlign={{ base: "center", md: "inherit" }}
                    alignItems="center"
                    w="full"
                    spacing="8"
                  >
                    {data?.status ===
                    UserQualificationStatus.PendingApproval ? (
                      <VerifyProfileIcon
                        color="secondary.500"
                        w="12"
                        h="12"
                        mb="6"
                      />
                    ) : (
                      <Circle
                        as="div"
                        size="40px"
                        position="relative"
                        _before={{
                          content: '""',
                          bg: "secondary.800",
                          opacity: "0.2",
                          position: "absolute",
                          width: "full",
                          height: "full",
                          borderRadius: "full",
                        }}
                        alignSelf={{ md: "flex-start" }}
                      >
                        <PersonIcon w="6" h="6" color="secondary.500" />
                      </Circle>
                    )}

                    <Box flex="1">
                      <Text fontSize="lg" mb="2">
                        {t(`index.card.${defaultCardType}.title`)}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {t(`index.card.${defaultCardType}.description`)}
                      </Text>
                    </Box>

                    {data?.status === UserQualificationStatus.Unverified && (
                      <Button
                        colorScheme="primary"
                        variant="outline"
                        onClick={() =>
                          router.push(
                            "/opportunities/unlock?originPage=opportunity",
                          )
                        }
                        isFullWidth={isCardBtnFullWidth}
                      >
                        {t("index.button.qualify")}
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}

          <Tabs
            defaultIndex={router.asPath.split("#")[1] == "closed" ? 1 : 0}
            onChange={(tabIndex: number) => {
              router.push(`/opportunities#${tabIndex == 0 ? "open" : "closed"}`)
              const tabEvent =
                tabIndex == 0 ? clickedOpenDealTab : clickedClosedDealTab
              event(tabEvent)
            }}
            colorScheme="primary"
          >
            <TabList>
              <Tab>{t("tabs.open")}</Tab>
              <Tab>{t("tabs.closed")}</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <OpportunityList isOpportunityClosed={false} />
              </TabPanel>
              <TabPanel>
                <OpportunityList isOpportunityClosed={true} />
              </TabPanel>
            </TabPanels>
          </Tabs>

          <PortfolioSimulatorWidget />

          {isUnverified && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb="52px"
            >
              <Divider borderColor="gray.700" mb="8" />
              <Text color="gray.500" size="lg" mb="6">
                {t("index.footer.detail")}
              </Text>
              <Button
                colorScheme="primary"
                onClick={() => router.push("/opportunities/unlock")}
                isFullWidth={isCardBtnFullWidth}
              >
                {t("index.button.qualify")}
              </Button>
            </Box>
          )}
        </Container>
        {!understood &&
          (isDesktopView || isTabletView) &&
          !isLoadingDisclaimer &&
          isVerified &&
          !isLoading && (
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
                <Stack direction="row" spacing="5">
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

export default withPageAuthRequired(OpportunitiesScreen)
