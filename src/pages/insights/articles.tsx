import { Container, Divider, Heading, Text } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import { Breadcrumb, InsightCard, Layout } from "~/components"
import Pagination from "~/components/Pagination"
import { Insight, InsightsWithPagination } from "~/services/mytfo/types"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function ArticlesScreen() {
  const { t, lang } = useTranslation("insights")
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const [currentPage, setCurrentPage] = React.useState(1)
  const pageLimit = 10

  const { data, error } = useSWR<InsightsWithPagination>(
    [`/api/portfolio/insights/articles?currentPage=${currentPage}`, lang],

    (url, lang) =>
      fetch(url, {
        headers: {
          "Accept-Language": lang,
        },
      }).then((res) => res.json()),
  )

  const isLoading = !data && !error

  if (isLoading) {
    return null
  }

  // Note: Pending design decisions from Product/Design.
  if (error) {
    return null
  }

  return (
    <Layout
      title={t("page.articles.title")}
      description={t("page.articles.description")}
    >
      <Container as="section" maxW="full" p="0">
        <Breadcrumb />
        <Heading
          as="h1"
          mb="6"
          mt={{ base: 8, md: 0 }}
          textAlign={{ base: "center", md: "start" }}
        >
          {t("page.articles.heading")}
        </Heading>
        <Text
          as="h3"
          fontSize="xl"
          color="gray.500"
          mb="16"
          textAlign={{ base: "center", md: "start" }}
        >
          {t("page.articles.subheading")}
        </Text>
        <>
          {data?.data.map((insight: Insight) => {
            return (
              <div key={insight.id}>
                <InsightCard
                  insight={insight}
                  {...(!isMobileView && { variant: "rowCard" })}
                />
                {isMobileView && (
                  <Divider
                    my="6"
                    borderBottomWidth="2px"
                    borderColor="gray.800"
                    opacity="1"
                  />
                )}
              </div>
            )
          })}
        </>
      </Container>
      {data && data.totalCount > pageLimit && (
        <Pagination
          currentPage={currentPage}
          pageLength={Math.round(data?.totalCount / pageLimit)}
          paginationOnClick={(i) => {
            i && setCurrentPage(i)
          }}
        />
      )}
    </Layout>
  )
}

export default withPageAuthRequired(ArticlesScreen)
