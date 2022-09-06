import { Box, Divider, Flex, Text } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/media-query"
import { format } from "date-fns"
import NextImage from "next/image"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"

import { Card, CardContent, CardFooter } from "~/components"
import { Insight, InsightType } from "~/services/mytfo/types"
import {
  articleDetailsPage,
  managementViewsDetailsPage,
  marketUpdateDetailsPage,
  webinarDetailsPage,
  whitepaperDetailsPage,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import { logActivity } from "~/utils/logActivity"

function RowInsightCard(props: { insight: Insight; onClick: () => void }) {
  const { insight, onClick } = props
  const { t } = useTranslation("insights")
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const imageWidth = useBreakpointValue({
    base: "280px",
    md: "280px",
    lg: "310px",
  })
  const imageHeight = useBreakpointValue({
    base: "120px",
    md: "120px",
    lg: "132px",
  })
  return (
    <Card
      aria-label="insightCard"
      boxShadow="none"
      flex="1"
      width="full"
      bg="transparent"
      onClick={onClick}
      cursor="pointer"
      _hover={{
        "& #title": {
          color: "gray.400",
        },
        "& #imageOverlay": {
          bgGradient:
            "linear-gradient(118.19deg, rgba(26, 26, 26, 0.8) 5%, rgba(26, 26, 26, 0) 100%)",
        },
        "& #estimatedDuration": {
          color: "gray.500",
        },
      }}
    >
      <CardContent p="0" width="full" bg="transparent">
        <Flex flexDirection="row" gridGap={isMobileView ? 5 : 32}>
          <Box flex="1">
            <Text
              aria-label="insightType"
              mb="2"
              color="secondary.500"
              fontSize="xs"
              fontWeight="bold"
            >
              {t(`tag.${insight.insightType}`)}
            </Text>
            <Text
              aria-label="insightTitle"
              id="title"
              fontSize="lg"
              mb={{ base: 5, md: 6 }}
            >
              {insight.title}
            </Text>
            <Text
              aria-label="insightPublishDate"
              id="estimatedDuration"
              color="gray.400"
              fontSize="xs"
            >
              {`${format(new Date(insight.publishDate), "MMM dd yyyy")} | ${
                insight.estimatedDuration
              }`}
            </Text>
          </Box>

          <Box
            minW={isMobileView ? "92px" : "280px"}
            minH="120px"
            position="relative"
            sx={{
              "& img": {
                borderRadius: "md",
              },
            }}
          >
            {insight.cardImage && (
              <NextImage
                src={`${insight.cardImage}`}
                alt={insight.title}
                layout="responsive"
                objectFit="cover"
                width={imageWidth || "310px"}
                height={imageHeight || "132px"}
              />
            )}
            <Box position="absolute" id="imageOverlay" w="full" h="full"></Box>
          </Box>
        </Flex>
      </CardContent>
      <CardFooter px="0">
        <Divider borderColor="gray.800" border="2px solid" />
      </CardFooter>
    </Card>
  )
}

interface InsightCardProps {
  insight: Insight
  variant?: "rowCard" | "columnCard"
}

function InsightCard(props: InsightCardProps) {
  const { insight, variant } = props
  const router = useRouter()
  const { t } = useTranslation("insights")
  const imageWidth = useBreakpointValue({
    base: "280px",
    md: "280px",
    lg: "310px",
  })
  const imageHeight = useBreakpointValue({
    base: "120px",
    md: "120px",
    lg: "132px",
  })

  function getRoute(insightType: InsightType, id: string) {
    switch (insightType) {
      case InsightType.Article: {
        return `/insights/articles/${id}`
      }
      case InsightType.Webinar: {
        return `/insights/webinars/${id}`
      }
      case InsightType.Whitepaper: {
        return `/insights/whitepapers/${id}`
      }
      case InsightType.MarketUpdate: {
        return `/insights/market-updates/${id}`
      }
      case InsightType.ManagementView: {
        return `/insights/management-views/${id}`
      }
      default: {
        return `/insights/articles/${id}`
      }
    }
  }

  const handleEvent = (type: string, value: number) => {
    if (type === InsightType.Article) {
      logActivity("ArticleClick", JSON.stringify({ articleId: value }))
      event({
        ...articleDetailsPage,
        label: `View the article  ${value} details page`,
      })
    }
    if (type === InsightType.Webinar) {
      event({
        ...webinarDetailsPage,
        label: `View the webinar  ${value} details page`,
      })
    }
    if (type === InsightType.Whitepaper) {
      event({
        ...whitepaperDetailsPage,
        label: `View the whitepaper  ${value} details page`,
      })
    }
    if (type === InsightType.ManagementView) {
      event({
        ...managementViewsDetailsPage,
        label: `View the management ${value} details page`,
      })
    }
    if (type === InsightType.MarketUpdate) {
      event({
        ...marketUpdateDetailsPage,
        label: `View the monthly market update ${value} details page`,
      })
    }
  }

  function handleClick() {
    const route = getRoute(insight.insightType, insight.id)
    handleEvent(insight?.insightType || "", Number(insight?.id))
    router.push(route)
  }

  if (variant === "rowCard") {
    return <RowInsightCard insight={insight} onClick={handleClick} />
  }

  return (
    <Card
      aria-label="insightCard"
      boxShadow="none"
      flex="1"
      maxWidth={{ base: "full", md: "300px", lg: "320px" }}
      minW={{ base: "full", md: "218px", lg: "280px" }}
      onClick={handleClick}
      cursor="pointer"
      bgColor="gray.900"
      _hover={{
        "& #title": {
          color: "gray.400",
        },
        "& #imageOverlay": {
          bgGradient:
            "linear-gradient(118.19deg, rgba(26, 26, 26, 0.8) 5%, rgba(26, 26, 26, 0) 100%)",
        },
        "& #estimatedDuration": {
          color: "gray.500",
        },
      }}
    >
      <CardContent p="0">
        <Box
          position="relative"
          mb="6"
          __css={{
            "& img": {
              borderRadius: "md",
            },
          }}
        >
          {insight.cardImage && (
            <NextImage
              src={insight.cardImage}
              alt={insight.title}
              layout="responsive"
              objectFit="cover"
              width={imageWidth || "310px"}
              height={imageHeight || "132px"}
            />
          )}
          <Box
            position="absolute"
            top="0"
            id="imageOverlay"
            w="full"
            h="full"
          ></Box>
        </Box>
        <Text
          aria-label="insightCardType"
          mb="2"
          color="secondary.500"
          fontSize="xs"
          fontWeight="bold"
        >
          {t(`tag.${insight.insightType}`)}
        </Text>
        <Text id="title" aria-label="insightTitle" noOfLines={2} mb={2}>
          {insight.title}
        </Text>
        <Text
          id="description"
          aria-label="description"
          color="gray.400"
          fontSize="xs"
          lineHeight="162%"
          fontFamily="Gotham"
          noOfLines={2}
        >
          {insight.description}
        </Text>
      </CardContent>
      <CardFooter p="0" mt="6">
        <Text
          id="estimatedDuration"
          aria-label="insightPublishDate"
          color="gray.400"
          fontSize="xs"
          fontFamily="Gotham"
        >
          {`${format(new Date(insight.publishDate), "MMM dd yyyy")} | ${
            insight.estimatedDuration
          }`}
        </Text>
      </CardFooter>
    </Card>
  )
}

export default InsightCard
