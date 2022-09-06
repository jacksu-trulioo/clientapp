import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { Box, Link, ListItem, OrderedList } from "@chakra-ui/react"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import {
  ArticleView,
  ClientLayout,
  ManagementView,
  ModalBox,
  MonthlyMarketUpdatedView,
  PageContainer,
  PodcastView,
  SkeletonCard,
  WebinarView,
  WhitePaperView,
} from "~/components"
import { ArchiveDetailData } from "~/services/mytfo/types"
import { getInsightTypeTag } from "~/utils/clientUtils/globalUtilities"

type ArchiveType = {
  id: string | number
  type: string
}

type ViewType = {
  type: string
  data: ArchiveDetailData
}

export default function Archive({ id, type }: ArchiveType) {
  const { t, lang } = useTranslation("insights")

  const { data, error } = useSWR<ArchiveDetailData>(
    `/api/client/insights/get-insight-details?id=${id}&langCode=${lang}`,
  )

  const isLoading = !data && !error

  return (
    <ClientLayout
      title={t("page.articles.title")}
      description={t("page.articles.description")}
      heroImage={type != "podcasts" ? data?.bannerImage : undefined}
      isHideInvmestmentCart={true}
      archiveType={type}
    >
      {!data && !isLoading ? (
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
          isLoading={isLoading}
          as="section"
          maxW="full"
          px="0"
          mt={{
            base: type == "podcasts" || !data?.bannerImage ? 8 : 0,
            md: 8,
            lgp: 0,
          }}
          filter={isLoading ? "blur(3px)" : "none"}
        >
          {isLoading ? (
            <SkeletonCard flex="1" mb="25px" mt="20px" />
          ) : (
            <>
              {type == "podcasts" || !data?.bannerImage ? (
                <OrderedList
                  m="8px 0 12px 0"
                  d={{ base: "none", md: "block", lgp: "block" }}
                >
                  <ListItem display="inline-flex" alignItems="center">
                    <Link
                      onClick={() =>
                        router.push("/client/insights/markets-archive")
                      }
                      fontSize="12px"
                      color="primary.500"
                      _focus={{
                        boxShadow: "none",
                      }}
                    >
                      {t("tag.MarketArchive")}
                    </Link>
                    <Box as="span" marginInline="0.5rem">
                      /
                    </Box>
                  </ListItem>
                  <ListItem
                    display="inline-flex"
                    alignItems="center"
                    fontSize="12px"
                  >
                    {t(`tag.${getInsightTypeTag(type)}`)}
                  </ListItem>
                </OrderedList>
              ) : (
                ""
              )}

              {data ? <View data={data} type={type} /> : false}
            </>
          )}
        </PageContainer>
      )}
    </ClientLayout>
  )
}

const View = ({ type, data }: ViewType) => {
  if (type == "articles") {
    return <ArticleView article={data} />
  }
  if (type == "webinars") {
    return <WebinarView webinar={data} />
  }
  if (type == "managementviews") {
    return <ManagementView managementView={data} />
  }
  if (type == "marketupdates") {
    return <MonthlyMarketUpdatedView marketUpdate={data} />
  }
  if (type == "whitepapers") {
    return <WhitePaperView whitepaper={data} />
  }
  if (type == "podcasts") {
    return <PodcastView podcast={data} />
  }
  return <p>No View Found</p>
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const sesison = getSession(ctx.req, ctx.res)
    if (sesison?.mandateId && ctx?.params?.id && ctx?.params?.type) {
      return {
        props: {
          id: ctx?.params?.id,
          type: ctx?.params?.type,
        }, // will be passed to the page component as props
      }
    }
    return {
      notFound: true,
    }
  },
})
