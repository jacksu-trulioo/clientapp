import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion"
import { Button } from "@chakra-ui/button"
import {
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/media-query"
import {
  chakra,
  CloseButton,
  HStack,
  IconButton,
  Tooltip,
  useToast,
} from "@chakra-ui/react"
import ky from "ky"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR, { mutate } from "swr"

import {
  InfoIcon,
  InvestmentOpportunityCard,
  IslamIcon,
  Layout,
  OpportunitiesRMCard,
  PlayPrimaryIcon,
  SkeletonOpportunityCard,
  SuccessTickIcon,
  ThumbsUpIcon,
  WarningIcon,
} from "~/components"
import { useSpentTime } from "~/hooks/useSpentTime"
import {
  LogActivity,
  OpportunitiesResponse,
  Opportunity,
} from "~/services/mytfo/types"
import {
  downloadDealOnePager,
  markOportunityInterested,
  markOportunityUnInterested,
  watchOpportunityVideo,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

import DownloaddocIcon from "../../components/Icon/DownloaddocIcon"

function OpportunitiesScreen() {
  const { t, lang } = useTranslation("opportunities")
  const { push, query } = useRouter()
  const toast = useToast()

  const toastIdRef = React.useRef(0)

  function close() {
    if (toastIdRef?.current) {
      toast.close(toastIdRef.current)
    }
  }

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isTableView = useBreakpointValue({ base: false, md: true, lg: false })
  const isDesktopView = !isMobileView && !isTableView
  const [isPlayIconVisible, setPlayIcon] = React.useState(true)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const opportunityId = query.id
  const opportunitiesShown = useBreakpointValue({ base: 3, md: 2, lg: 3 })

  const { data: opportunity, error: opportunityError } = useSWR<Opportunity>(
    [`/api/portfolio/opportunity?id=${opportunityId}`, lang],
    (url, lang) =>
      fetch(url, {
        headers: {
          "Accept-Language": lang,
        },
      }).then(async (res) => {
        if (res.status === 403) {
          const error = await res.json()
          throw new Error(error?.message)
        }
        return res.json()
      }),
  )
  const isOpportunityLoading = !opportunity && !opportunityError

  const { data: similarOpportunities, error: similarOpportunitiesError } =
    useSWR<OpportunitiesResponse>(
      ["/api/portfolio/opportunities", lang],
      (url, lang) =>
        fetch(url, {
          headers: {
            "Accept-Language": lang,
          },
        }).then((res) => res.json()),
    )

  const [showopportunityInterest, setShowOpportunityInterest] =
    React.useState(false)

  const { data: allInterestedOpportunities } = useSWR(
    "/api/user/preference/opportunity-interest",
  )

  React.useEffect(() => {
    if (allInterestedOpportunities) {
      const checkOpportunityInterest = (
        allInterestedOpportunities || []
      )?.includes(opportunityId)
      setShowOpportunityInterest(checkOpportunityInterest)
    }
  }, [allInterestedOpportunities, opportunityId])

  const issimilarOpportunitiesLoading =
    !similarOpportunities && !similarOpportunitiesError

  const downloadPdf = async (title: string | undefined) => {
    event(downloadDealOnePager(title || ""))
    await ky
      .post("/api/user/log-activity", {
        json: {
          event: "DownloadPdf",
          meta: JSON.stringify({ title: title }),
        },
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      })
      .json<LogActivity>()
  }
  useSpentTime("OpportunityTimeSpent", "logUserActivity", {
    opportunityId: opportunityId,
  })

  if (isOpportunityLoading) {
    return null
  }

  if (opportunityError) {
    if (opportunityError?.message.includes("403")) {
      push("/404")
    }
    return null
  }

  const breakdownList = [
    {
      label: "assetManager",
      value: opportunity?.sponsor,
      tooltipRequired: false,
    },
    {
      label: "assetClass",
      value: opportunity?.assetClass,
    },
    { label: "sector", value: opportunity?.sector, tooltipRequired: false },
    {
      label: opportunity?.isOpportunityClosed ? "exitDate" : "expectedExit",
      value: opportunity?.expectedExit,
    },
    {
      label: opportunity?.isOpportunityClosed ? "netIRR" : "expectedReturn",
      value: opportunity?.expectedReturn,
      tooltipRequired: opportunity?.isOpportunityClosed ? false : true,
    },
    { label: "country", value: opportunity?.country, tooltipRequired: false },
  ]

  const toggleOpportunityInterest = async () => {
    close()
    try {
      if (showopportunityInterest) {
        event({
          ...markOportunityUnInterested,
          label: `Mark the deal ${opportunityId} as not interested`,
        })
        toastIdRef.current = toast({
          isClosable: true,
          position: "top",
          render: () => (
            <HStack
              py="3"
              ps="10px"
              pe="4"
              bg="rgba(239, 98, 46, 0.19)"
              direction="row"
              alignItems="center"
              borderRadius="2px"
              role="alert"
              justifyContent="center"
            >
              <HStack>
                <WarningIcon w={5} h={5} color="red.600" />
                <Text fontSize="md" color="white">
                  {t("index.toast.showUnInterest")}
                </Text>
              </HStack>

              <CloseButton onClick={close} />
            </HStack>
          ),
        }) as number
        setShowOpportunityInterest(false)
        await ky
          .patch("/api/user/preference/opportunity-interest", {
            json: {
              opportunityId: opportunityId,
              isInterested: false,
            },
          })
          .json()
      }
      if (!showopportunityInterest) {
        event({
          ...markOportunityInterested,
          label: `Mark the deal ${opportunityId} as Interested`,
        })
        toastIdRef.current = toast({
          isClosable: true,
          position: "top",
          render: () => (
            <HStack
              py="3"
              ps="10px"
              pe="4"
              bg="shinyShamrock.800With10Opacity"
              direction="row"
              alignItems="center"
              borderRadius="2px"
              role="alert"
              justifyContent="center"
            >
              <HStack>
                <SuccessTickIcon w={5} h={5} color="shinyShamrock.800" />
                <Text fontSize="md" color="white">
                  {t("index.toast.showInterest")}
                </Text>
              </HStack>

              <CloseButton onClick={close} />
            </HStack>
          ),
        }) as number
        setShowOpportunityInterest(true)
        await ky
          .patch("/api/user/preference/opportunity-interest", {
            json: {
              opportunityId: opportunityId,
              isInterested: true,
            },
          })
          .json()
      }
      mutate(`/api/user/preference/opportunity-interest`)
    } catch (error) {}
  }

  return (
    <Layout
      title={t("index.page.title")}
      description={t("index.page.description")}
      heroImage={opportunity?.image}
    >
      <Container as="section" maxW="full" px="0">
        <Stack
          direction="row"
          alignItems={{ base: "center", md: "unset", lg: "unset" }}
        >
          <Stack direction="row" justifyContent="space-between" width="100%">
            <Stack
              direction="row"
              alignItems="center"
              width={{ base: "100%", md: "unset", lg: "unset" }}
              spacing={4}
              mb={8}
            >
              <Stack
                direction={{ base: "column-reverse", md: "row" }}
                spacing="4"
                w={{ base: "100%", md: "unset", lg: "unset" }}
              >
                <Heading
                  aria-label="opportunityTitle"
                  fontSize={{ base: "xl", lg: "2xl" }}
                >
                  {opportunity?.title}
                </Heading>
                {opportunity?.isShariahCompliant && (
                  <Box
                    color="gray.900"
                    backgroundColor="secondary.500"
                    borderRadius="full"
                    px="2"
                    display="flex"
                    alignSelf={{
                      base: "flex-start",
                      md: "flex-end",
                      lg: "center",
                    }}
                    py="1"
                  >
                    <IslamIcon
                      me="1"
                      w="3"
                      h="3"
                      color="gray.900"
                      alignSelf="center"
                    />
                    <Text
                      aria-label="opportunityIsShariahCompliant"
                      as="span"
                      fontSize={{ base: "xs", md: "sm" }}
                      fontWeight="bold"
                      alignSelf="center"
                    >
                      {t("index.card.tag.shariah")}
                    </Text>
                  </Box>
                )}
              </Stack>
              <IconButton
                aria-label="Interest Icon"
                icon={<ThumbsUpIcon w="4" h="4" />}
                borderRadius="full"
                alignSelf="flex-end"
                variant={showopportunityInterest ? "solid" : "outline"}
                isDisabled={opportunity?.isOpportunityClosed === true}
                border="1px solid var(--chakra-colors-primary-500)"
                rounded="full"
                colorScheme="primary"
                size="sm"
                onClick={toggleOpportunityInterest}
              />
            </Stack>
            {isDesktopView && (
              <Stack direction="row">
                {opportunity?.document && (
                  <Button
                    as="a"
                    target="_blank"
                    colorScheme="primary"
                    size="sm"
                    variant="outline"
                    // @ts-ignore
                    leftIcon={
                      <DownloaddocIcon h={6} w={6} color="primary.500" />
                    }
                    href={`${opportunity?.document}`}
                    onClick={() => downloadPdf(opportunity?.title)}
                    textDecoration="none"
                  >
                    {t("common:button.download")}
                  </Button>
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
        <Stack direction={{ base: "column", md: "column", lg: "row" }} mb="8">
          <Text
            aria-label="opportunityDescription"
            fontSize="md"
            color="gray.500"
            {...((isMobileView || isTableView) && { mb: 6 })}
            maxW="xl"
          >
            {opportunity?.description}
          </Text>

          {(isMobileView || isTableView) && (
            <Stack direction="row" spacing="4">
              {opportunity?.document && (
                <Button
                  as="a"
                  target="_blank"
                  colorScheme="primary"
                  variant="outline"
                  // @ts-ignore
                  leftIcon={<DownloaddocIcon h={6} w={6} color="primary.500" />}
                  href={`${opportunity?.document}`}
                  onClick={() => downloadPdf(opportunity?.title)}
                  textDecoration="none"
                  size="sm"
                >
                  <Text
                    ms={{ base: "-6px !important", md: "unset", lg: "unset" }}
                  >
                    {t("common:button.download")}
                  </Text>
                </Button>
              )}
            </Stack>
          )}
        </Stack>
        <Divider color="gray.800" mb="8" />
        {/* Breakdown Section */}
        <Text fontSize="lg" fontWeight="bold" mb="8">
          {t("index.text.breakdown")}
        </Text>
        <SimpleGrid
          columns={2}
          mb="12"
          {...(lang === "en" && {
            sx: {
              "div:nth-of-type(odd)": {
                borderBottom: "1px solid",
                borderBottomColor: "gray.700",
                marginEnd: "3",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  top: "1",
                  right: "-3",
                  bottom: "1",
                  borderStart: "1px solid",
                  borderStartColor: "gray.700",
                },
              },
              "div:nth-of-type(even)": {
                borderBottom: "1px solid",
                borderBottomColor: "gray.700",
                marginStart: "3",
              },
              "div:nth-last-of-type(2)": {
                borderBottom: "none",
              },
              "div:nth-last-of-type(1)": {
                borderBottom: "none",
              },
            },
          })}
          {...(lang === "ar" && {
            sx: {
              "div:nth-of-type(odd)": {
                borderBottom: "1px solid",
                borderBottomColor: "gray.700",
                marginEnd: "3",
                marginStart: "10",
                "&:before": {
                  content: '""',
                  position: "absolute",
                  top: "1",
                  right: "-3",
                  bottom: "1",
                  borderStart: "1px solid",
                  borderStartColor: "gray.700",
                },
              },
              "div:nth-of-type(even)": {
                borderBottom: "1px solid",
                borderBottomColor: "gray.700",
                marginStart: "3",
                marginEnd: "10",
              },
              "div:nth-last-of-type(2)": {
                borderBottom: "none",
              },
              "div:nth-last-of-type(1)": {
                borderBottom: "none",
              },
            },
          })}
        >
          {breakdownList.map((item) => {
            return (
              <VStack
                alignItems="flex-start"
                textAlign="start"
                position="relative"
                py="4"
                key={item.label}
              >
                <Text aria-label="breakdown" color="gray.500">
                  {t(`index.card.labels.${item.label}`)}
                  {item?.tooltipRequired && (
                    <Tooltip
                      hasArrow
                      label={t(`index.card.tooltip.${item.label}`)}
                      placement="bottom"
                      cursor="pointer"
                      textAlign="center"
                      sx={{
                        whiteSpace: "pre-line",
                      }}
                    >
                      <chakra.span>
                        <InfoIcon
                          aria-label="Info icon"
                          color="primary.500"
                          h={3.5}
                          width={3.5}
                          ml={1}
                        />
                      </chakra.span>
                    </Tooltip>
                  )}
                </Text>
                <Text>{item.value}</Text>
              </VStack>
            )
          })}
        </SimpleGrid>
        {opportunity?.videoLink && (
          <>
            <Text fontSize="lg" fontWeight="bold" mb="6">
              {t("index.text.video")}
            </Text>
            <Box mb="6" width="full" height="auto" position="relative">
              {isPlayIconVisible && (
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  h="full"
                  w="full"
                  background="linear-gradient(0deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55))"
                >
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    h="full"
                    w="full"
                    position="absolute"
                  >
                    <PlayPrimaryIcon
                      w={{ base: "40px", md: "64px", lg: "90px" }}
                      h={{ base: "41px", md: "65px", lg: "92px" }}
                      zIndex="modal"
                      color="white"
                      cursor="pointer"
                      onClick={() => {
                        setPlayIcon(false)
                        event(watchOpportunityVideo)
                        videoRef?.current?.play()
                      }}
                    />
                  </Flex>
                </Box>
              )}

              <video
                controls={!isPlayIconVisible}
                ref={videoRef}
                width="100%"
                preload="auto"
              >
                <source src={opportunity?.videoLink} key={opportunity.id} />
              </video>
            </Box>
          </>
        )}
        {opportunity?.isOpportunityClosed !== true && (
          <OpportunitiesRMCard opportunitiesId={opportunity?.id} />
        )}

        {/* Other Info Section */}
        {opportunity?.otherInfo && (
          <>
            <Text fontSize="lg" fontWeight="bold">
              {t("index.text.whyWeInvest")}
            </Text>
            <Accordion allowToggle w="full" mb="12">
              {opportunity?.otherInfo &&
                opportunity?.otherInfo.map((info) => (
                  <AccordionItem
                    borderBottom="1px solid"
                    borderBottomColor="gray.800"
                    mb="0"
                    key={info.title}
                  >
                    <h2>
                      <AccordionButton
                        bg="transparent"
                        p="0"
                        _hover={{ bg: "transparent" }}
                      >
                        <Flex
                          justifyContent="space-between"
                          py="6"
                          width="full"
                        >
                          <Text textAlign="start">{info.title}</Text>
                          <AccordionIcon />
                        </Flex>
                      </AccordionButton>
                    </h2>
                    <AccordionPanel bg="transparent">
                      <UnorderedList
                        spacing="4"
                        color="gray.500"
                        lineHeight="4"
                      >
                        {info.substances.map((item, index) => (
                          <ListItem key={index.toString()}>
                            {item.description}
                          </ListItem>
                        ))}
                      </UnorderedList>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
            </Accordion>
          </>
        )}
        <Text fontSize="sm" color="gray.500" mb="6">
          {t("index.text.disclaimer")}
        </Text>
        <Divider color="gray.800" mb="12" />
        <Heading as="h3" fontSize="2xl" mb="8">
          {t("index.text.seeSimilar")}
        </Heading>
        <Grid
          templateColumns={`repeat(${
            isMobileView ? 1 : opportunitiesShown
          }, 1fr)`}
          width="full"
          gap={{ base: "8", md: "6", lg: "8" }}
          mb="40"
        >
          {issimilarOpportunitiesLoading ? (
            <>
              <SkeletonOpportunityCard flex="1 0 218px" />
              <SkeletonOpportunityCard flex="1 0 218px" />
              <SkeletonOpportunityCard flex="1 0 218px" />
            </>
          ) : (
            <>
              {similarOpportunities?.opportunities
                .filter((op) => op.id !== opportunity?.id)
                .slice(0, opportunitiesShown)
                .map((opportunity) => {
                  return (
                    <InvestmentOpportunityCard
                      key={opportunity.id}
                      data={opportunity}
                      status={similarOpportunities?.status}
                      variant="summary"
                    />
                  )
                })}
            </>
          )}
        </Grid>
      </Container>
    </Layout>
  )
}

export default withPageAuthRequired(OpportunitiesScreen)
