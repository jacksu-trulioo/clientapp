import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/react"
import ky from "ky"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"

import {
  ArchiveCard,
  ClientLayout,
  ModalBox,
  PageContainer,
  Pagination,
  SkeletonCard,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import {
  Insights,
  marketArchiveReqBody,
  MatketArchiveClient,
} from "~/services/mytfo/clientTypes"
import {
  getInsightTypeKey,
  getInsightTypeTag,
} from "~/utils/clientUtils/globalUtilities"
import {
  openInsightsMarketArchiveArticles,
  screenSpentTime,
  timeOpenArticleFromMarketArchive,
} from "~/utils/googleEventsClient"
import { clientEvent, clientUniEvent } from "~/utils/gtag"

type MarketArchiveType = {
  type: string
}

export default function MarketArticle({ type }: MarketArchiveType) {
  const { user } = useUser()
  const { lang, t } = useTranslation("insights")
  const [insights, setInsights] = useState<MatketArchiveClient[]>()
  const [currentPage, setCurrentPage] = useState(1)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [translationKey, setTranslationKey] = useState<string>("")

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Insights Market Archive See more Page",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  useEffect(() => {
    insightsData({
      lang,
      count: 0,
      type: "",
      category: type,
      currentPage: 1,
    })

    setTranslationKey(getInsightTypeKey(type) || "")
  }, [])

  useEffect(() => {
    if (isLoading) {
      setIsPageLoading(true)
    } else {
      setIsPageLoading(false)
    }
  }, [isLoading])

  const insightsData = async (body: marketArchiveReqBody) => {
    setIsLoading(true)
    try {
      const marketArchiveData: MatketArchiveClient[] = await ky
        .post("/api/client/insights/insights-market-archive", {
          json: body,
        })
        .json<MatketArchiveClient[]>()
      if (marketArchiveData.length) {
        setInsights(marketArchiveData)
      }
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const getDescription = (publishDate: string, estimatedDuration: string) => {
    moment.locale("en")
    return `${moment(publishDate).format("MMM DD YYYY")} | ${estimatedDuration}`
  }

  return (
    <Fragment>
      <ClientLayout
        title={t(`page.index.title`)}
        description={t(`page.${translationKey}.description`)}
        footerRequired={false}
      >
        {!insights?.length && !isPageLoading && !isLoading ? (
          <ModalBox
            isOpen={true}
            modalDescription={t("common:client.errors.noDate.description")}
            modalTitle={t("common:client.errors.noDate.title")}
            primaryButtonText={t("common:client.errors.noDate.button")}
            onClose={() => {
              router.push("/client/insights")
            }}
            onPrimaryClick={() => {
              router.push("/client/insights")
            }}
          />
        ) : (
          <PageContainer
            isLoading={isPageLoading}
            as="section"
            maxW="full"
            px="0"
            mt={{ base: 8, md: 8, lgp: 0 }}
            filter={isPageLoading ? "blur(3px)" : "none"}
          >
            {!isLoading && insights?.length ? (
              <Box bg="#111111" w="100%">
                <Breadcrumb
                  fontSize="12px"
                  m="8px 0"
                  d={{ base: "none", md: "block", lgp: "block" }}
                >
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      color="primary.500"
                      href="../"
                      _focus={{ boxShadow: "none" }}
                      fontSize="12px"
                    >
                      {t("common:breadcrumb.insights")}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      fontSize="12px"
                      dir="ltr"
                      href="./"
                      fontFamily="'Gotham'"
                      color="primary.500"
                      _focus={{ boxShadow: "none" }}
                    >
                      {t("page.marketArchive.heading")}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink
                      fontSize="12px"
                      dir="ltr"
                      fontFamily="'Gotham'"
                      _hover={{ textDecoration: "none" }}
                      cursor="default"
                    >
                      {t(`page.${translationKey}.heading`)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
                <Box mb="20px">
                  <Heading
                    fontSize={{ base: "24px", md: "30px", lgp: "30px" }}
                    fontWeight="400"
                    color="#fff"
                  >
                    {t(`page.${translationKey}.heading`)}
                  </Heading>
                  <Text
                    fontSize={{ base: "14px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#C7C7C7"
                    mt="8px"
                  >
                    {t(`page.${translationKey}.subheading`)}
                  </Text>
                </Box>
                <>
                  <Grid
                    templateColumns={{
                      base: "repeat(1, 1fr)",
                      md: "repeat(2, 1fr)",
                      lgp: "repeat(2, 1fr)",
                      xl: "repeat(3, 1fr)",
                      "2xl": "repeat(3, 1fr)",
                    }}
                    gap={6}
                  >
                    {insights[0].insights.map(
                      (cardDetails: Insights, i: number) => (
                        <GridItem
                          w="100%"
                          key={i}
                          pb={{ base: "10px", md: "20px" }}
                          // my={{ base: "10px", md: "20px" }}
                          onClick={() => {
                            clientUniEvent(
                              openInsightsMarketArchiveArticles,
                              cardDetails.content.Title,
                              user?.mandateId as string,
                              user?.email as string,
                            )
                            clientEvent(
                              timeOpenArticleFromMarketArchive,
                              cardDetails.content.Title,
                              moment().format("LT"),
                              user?.mandateId as string,
                              user?.email as string,
                            )
                            router.push(
                              `/client/insights/markets-archive/${type}/${cardDetails.id}`,
                            )
                          }}
                        >
                          <ArchiveCard
                            cardImage={
                              cardDetails.content?.CardImage_clientapp
                                ? cardDetails.content?.CardImage_clientapp
                                    ?.filename
                                : cardDetails.content?.CardImage
                                ? cardDetails.content?.CardImage?.filename
                                : cardDetails.content?.BannerImage?.filename
                            }
                            title={cardDetails.content.Title}
                            tag={t(`tag.${getInsightTypeTag(type)}`)}
                            showVideoIcon={
                              type == "articles" ||
                              type == "whitepapers" ||
                              type == "marketupdates"
                                ? false
                                : true
                            }
                            description={`${getDescription(
                              cardDetails.content.PublishDate,
                              cardDetails.content.EstimatedDuration,
                            )}`}
                          />
                        </GridItem>
                      ),
                    )}
                  </Grid>
                </>
                <Box>
                  <Pagination
                    currentPage={currentPage}
                    pageLength={insights[0].pageCount}
                    paginationOnClick={(i: number | undefined) => {
                      setCurrentPage(i || 0)
                      insightsData({
                        lang,
                        count: 0,
                        type: "",
                        category: type,
                        currentPage: i || 0,
                      })
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <SkeletonCard flex="1" mb="25px" mt="20px" />
            )}
          </PageContainer>
        )}
      </ClientLayout>
    </Fragment>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const sesison = getSession(ctx.req, ctx.res)
    if (sesison?.mandateId && ctx?.params?.type) {
      return {
        props: {
          type: ctx?.params?.type,
        },
      }
    }
    return {
      notFound: true,
    }
  },
})
