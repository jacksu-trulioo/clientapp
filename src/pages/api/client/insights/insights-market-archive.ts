import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import {
  InsightsClient,
  MatketArchiveClient,
} from "~/services/mytfo/clientTypes"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "POST") {
    await getMarketArchive()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getMarketArchive() {
    const { lang, count, type, category, currentPage } = req.body
    let perPage = 9

    let marketArchiveObj: MatketArchiveClient[] = []

    try {
      if (category == "podcasts" || type == "all") {
        const podcastVideos: InsightsClient =
          (await client.clientInsights.getClientPodcastVideos(
            lang,
          )) as InsightsClient

        marketArchiveObj.push({
          type: "Podcast",
          insights:
            count > 0
              ? podcastVideos.stories?.slice(0, Number(count))
              : podcastVideos.stories?.slice(
                  currentPage * perPage - 1 - (perPage - 1),
                  currentPage * perPage,
                ),
          pageCount: Math.ceil(podcastVideos.stories.length / perPage),
          totalCount: podcastVideos.stories.length,
        })
      }
      if (category == "articles" || type == "all") {
        const articles: InsightsClient =
          (await client.clientInsights.getClientArticles(
            lang,
          )) as InsightsClient

        marketArchiveObj.push({
          type: "Article",
          insights:
            count > 0
              ? articles.stories?.slice(0, Number(count))
              : articles.stories?.slice(
                  currentPage * perPage - 1 - (perPage - 1),
                  currentPage * perPage,
                ),
          pageCount: Math.ceil(articles.stories.length / perPage),
          totalCount: articles.stories.length,
        })
      }
      if (category == "webinars" || type == "all") {
        const webinars: InsightsClient =
          (await client.clientInsights.getClientWebinars(
            lang,
          )) as InsightsClient
        marketArchiveObj.push({
          type: "Webinar",
          insights:
            count > 0
              ? webinars.stories?.slice(0, Number(count))
              : webinars.stories?.slice(
                  currentPage * perPage - 1 - (perPage - 1),
                  currentPage * perPage,
                ),
          pageCount: Math.ceil(webinars.stories.length / perPage),
          totalCount: webinars.stories.length,
        })
      }
      if (category == "whitepapers" || type == "all") {
        const whitePapers: InsightsClient =
          (await client.clientInsights.getClientWhitePapers(
            lang,
          )) as InsightsClient
        marketArchiveObj.push({
          type: "Whitepaper",
          insights:
            count > 0
              ? whitePapers.stories?.slice(0, Number(count))
              : whitePapers.stories?.slice(
                  currentPage * perPage - 1 - (perPage - 1),
                  currentPage * perPage,
                ),
          pageCount: Math.ceil(whitePapers.stories.length / perPage),
          totalCount: whitePapers.stories.length,
        })
      }
      if (category == "managementviews" || type == "all") {
        const managementViews: InsightsClient =
          (await client.clientInsights.getClientManagementViews(
            lang,
          )) as InsightsClient
        marketArchiveObj.push({
          type: "ManagementView",
          insights:
            count > 0
              ? managementViews.stories?.slice(0, Number(count))
              : managementViews.stories?.slice(
                  currentPage * perPage - 1 - (perPage - 1),
                  currentPage * perPage,
                ),
          pageCount: Math.ceil(managementViews.stories.length / perPage),
          totalCount: managementViews.stories.length,
        })
      }
      if (category == "marketupdates" || type == "all") {
        const monthlyMarketUpdates: InsightsClient =
          (await client.clientInsights.getClientMonthlyMarketUpdates(
            lang,
          )) as InsightsClient
        marketArchiveObj.push({
          type: "MarketUpdate",
          insights:
            count > 0
              ? monthlyMarketUpdates.stories?.slice(0, Number(count))
              : monthlyMarketUpdates.stories?.slice(
                  currentPage * perPage - 1 - (perPage - 1),
                  currentPage * perPage,
                ),
          pageCount: Math.ceil(monthlyMarketUpdates.stories.length / perPage),
          totalCount: monthlyMarketUpdates.stories.length,
        })
      }

      res.status(200).json(marketArchiveObj)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}
export default withSentry(withApiAuthRequired(handler))
