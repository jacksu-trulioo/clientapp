import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { useBreakpointValue } from "@chakra-ui/media-query"
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Link,
  Spacer,
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
  SkeletonCard,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import { MatketArchiveClient } from "~/services/mytfo/clientTypes"
import {
  openInsightsMarketArchiveArticles,
  screenSpentTime,
  timeOpenArticleFromMarketArchive,
} from "~/utils/googleEventsClient"
import { clientEvent, clientUniEvent } from "~/utils/gtag"

export default function Marketarchive() {
  const { user } = useUser()
  const { lang, t } = useTranslation("insights")
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [marketArchiveData, setMarketArchiveData] = useState<
    MatketArchiveClient[]
  >([])
  const largeDesktopView = useBreakpointValue({
    base: false,
    md: false,
    lgp: false,
    "2xl": true,
    xl: true,
  })

  useEffect(() => {
    if (isLoading) {
      setIsPageLoading(true)
    } else {
      setIsPageLoading(false)
    }
  }, [isLoading])

  useEffect(() => {
    if (largeDesktopView !== undefined) {
      getMarketArchiveData()
    }
  }, [largeDesktopView])

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Insights Market Archive Landing Page",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  const getMarketArchiveData = async () => {
    setIsLoading(true)
    try {
      var response: MatketArchiveClient[] = await ky
        .post("/api/client/insights/insights-market-archive", {
          json: {
            lang,
            count: largeDesktopView ? 3 : 2,
            type: "all",
            category: "",
            currentPage: 1,
          },
        })
        .json<MatketArchiveClient[]>()
      setMarketArchiveData(response)
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
        title={t("page.marketArchive.title")}
        description={t("page.marketArchive.description")}
        footerRequired={false}
      >
        {!marketArchiveData && !isPageLoading && !isLoading ? (
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
            {isLoading ? (
              <SkeletonCard flex="1" mb="25px" mt="20px" />
            ) : (
              <Box w="100%">
                <Box>
                  <Heading
                    fontSize={{ base: "24px", md: "30px", lgp: "30px" }}
                    fontWeight="400"
                    color="#fff"
                  >
                    {t("page.marketArchive.heading")}
                  </Heading>
                  <Text
                    fontSize={{ base: "14px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#C7C7C7"
                    mt="8px"
                  >
                    {t("page.marketArchive.subheading")}
                  </Text>
                </Box>

                <>
                  {marketArchiveData?.map(
                    ({ type, totalCount, insights }, i) => (
                      <>
                        <Box m="32px 0px 36px 0px" key={i} display="flex">
                          <Heading
                            fontSize={{
                              base: "14px",
                              sm: "16px",
                              md: "24px",
                              lgp: "24px",
                            }}
                            fontWeight="400"
                            color="#fff"
                          >
                            {t(`label.${type}`)}
                          </Heading>
                          <Spacer />

                          {totalCount > 3 ? (
                            <Box display="flex" alignItems="center">
                              <Link
                                onClick={() =>
                                  router.push(
                                    `/client/insights/markets-archive/${type.toLocaleLowerCase()}s`,
                                  )
                                }
                                color="#B99855"
                                fontSize={{
                                  base: "12px",
                                  sm: "12px",
                                  md: "14px",
                                  lgp: "14px",
                                }}
                                fontWeight="600"
                              >
                                {t("common:button.seeMore")}
                                <Box
                                  ms="8px"
                                  display="inline-block"
                                  style={{
                                    transform: lang.includes("ar")
                                      ? "rotate(180deg)"
                                      : "none",
                                  }}
                                >
                                  <svg
                                    width="6"
                                    height="8"
                                    viewBox="0 0 6 8"
                                    fill="none"
                                    display="inline-block"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M3.72768 4L0.333496 0.888749L1.30307 0L5.66683 4L1.30307 8L0.333496 7.11125L3.72768 4Z"
                                      fill="#B99855"
                                    />
                                  </svg>
                                </Box>
                              </Link>
                            </Box>
                          ) : (
                            false
                          )}
                        </Box>
                        <Grid
                          templateColumns={{
                            base: "repeat(1, 1fr)",
                            md: "repeat(2, 1fr)",
                            lgp: "repeat(2, 1fr)",
                            xl: "repeat(3, 1fr)",
                            "2xl": "repeat(3, 1fr)",
                          }}
                          gap="16px"
                          borderBottom="1px solid #222222"
                        >
                          {insights.map((cardDetail, i) => (
                            <GridItem
                              w="100%"
                              key={i}
                              pb={{ base: "10px", md: "20px" }}
                              my={{ base: "10px", md: "8px" }}
                              onClick={() => {
                                clientUniEvent(
                                  openInsightsMarketArchiveArticles,
                                  cardDetail.content.Title,
                                  user?.mandateId as string,
                                  user?.email as string,
                                )
                                clientEvent(
                                  timeOpenArticleFromMarketArchive,
                                  cardDetail.content.Title,
                                  moment().format("LT"),
                                  user?.mandateId as string,
                                  user?.email as string,
                                )
                                router.push(
                                  `/client/insights/markets-archive/${type.toLocaleLowerCase()}s/${
                                    cardDetail.id
                                  }`,
                                )
                              }}
                            >
                              <ArchiveCard
                                imageMinHeight={"196px"}
                                cardImage={
                                  cardDetail.content?.CardImage_clientapp
                                    ? cardDetail.content?.CardImage_clientapp
                                        ?.filename
                                    : cardDetail.content?.CardImage
                                    ? cardDetail.content?.CardImage?.filename
                                    : cardDetail.content?.BannerImage?.filename
                                }
                                title={cardDetail.content.Title}
                                tag={t(`tag.${type}`)}
                                showVideoIcon={
                                  type == "Article" ||
                                  type == "Whitepaper" ||
                                  type == "MarketUpdate"
                                    ? false
                                    : true
                                }
                                description={`${getDescription(
                                  cardDetail.content.PublishDate,
                                  cardDetail.content.EstimatedDuration,
                                )}`}
                              />
                            </GridItem>
                          ))}
                        </Grid>
                      </>
                    ),
                  )}
                </>
              </Box>
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
    if (sesison?.mandateId) {
      return {
        props: {}, // will be passed to the page component as props
      }
    }
    return {
      notFound: true,
    }
  },
})
