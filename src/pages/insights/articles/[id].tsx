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
import { useBreakpointValue } from "@chakra-ui/react"
import { format } from "date-fns"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import { ChakraUIMarkDownRenderer, InsightCard, Layout } from "~/components"
import { useSpentTime } from "~/hooks/useSpentTime"
import { Article, Insight } from "~/services/mytfo/types"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function ArticleScreen() {
  const { t, lang } = useTranslation("insights")

  const router = useRouter()

  const isMobileView = useBreakpointValue({ base: true, md: false })

  const id = router.query?.id

  const { data: article, error: articleError } = useSWR<Article>(
    [`/api/portfolio/insights/article?id=${id}`, lang],
    (url, lang) =>
      fetch(url, {
        headers: {
          "Accept-Language": lang,
        },
      }).then((res) => res.json()),
  )

  const isArticleLoading = !article && !articleError

  // wait till the above call is completed and then make api call
  const { data: topArticles, error: topArticlesError } = useSWR<Insight[]>(
    article
      ? [`/api/portfolio/insights/top-articles?excludingId=${article.id}`, lang]
      : null,
    (url, lang) =>
      fetch(url, {
        headers: {
          "Accept-Language": lang,
        },
      }).then((res) => res.json()),
  )

  useSpentTime("ArticleTimeSpent", "logUserActivity", { articleId: id })

  // Note: Pending design decisions from Product/Design.
  if (isArticleLoading || articleError) {
    return null
  }

  return (
    <Layout
      title={t("page.articles.title")}
      description={t("page.articles.description")}
      heroImage={article?.bannerImage}
    >
      <Container as="section" maxW="full" px="0">
        <Text mb={{ base: 4, md: 6 }} color="secondary.500" fontWeight="bold">
          {t(`tag.${article?.insightType}`)}
        </Text>
        <Heading size="lg" mb={{ base: 10, md: 6 }}>
          {article?.title}
        </Heading>
        <Text
          aria-label="publishDateAndDuration"
          color="gray.400"
          fontSize="xs"
          mb={{ base: 10, md: 8 }}
          fontFamily="Gotham"
        >
          {`${
            article?.publishDate
              ? format(new Date(article.publishDate), "MMM dd yyyy")
              : ""
          } | ${article?.estimatedDuration}`}
        </Text>

        <Text fontSize="xl" color="gray.500" mb="10">
          <ChakraUIMarkDownRenderer>
            {article?.description || ""}
          </ChakraUIMarkDownRenderer>
        </Text>

        <Divider borderColor="gray.800" mb="12" border="1px" />
        <Accordion allowToggle w="full" mb="12">
          {article?.contents &&
            article?.contents.map((content) => (
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
        {article?.disclaimer && (
          <Box mb="12">
            <Heading as="h3" fontSize="2xl" mb="8" fontStyle="italic">
              {t("label.disclaimer")}
            </Heading>
            <Text fontSize="xs" color="gray.500">
              <ChakraUIMarkDownRenderer>
                {article.disclaimer}
              </ChakraUIMarkDownRenderer>
            </Text>
          </Box>
        )}
        {topArticles && !topArticlesError && topArticles.length > 0 && (
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
        {topArticles &&
          !topArticlesError &&
          topArticles.length > 0 &&
          topArticles
            ?.slice(0, 3)
            .map((insight) => (
              <InsightCard insight={insight} key={insight.id} />
            ))}
      </Grid>
    </Layout>
  )
}

export default withPageAuthRequired(ArticleScreen)
