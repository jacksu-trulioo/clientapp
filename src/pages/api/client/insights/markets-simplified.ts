import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { CardCategories, Highlights, Watchlist } from "~/services/mytfo/types"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })
  if (req.method === "GET") {
    await getMarketSimplifiedData()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  async function getMarketSimplifiedData() {
    try {
      const watchlistResponse =
        (await client.clientInsights.getWatchlist()) as Watchlist
      const cardCategoriesResponse =
        (await client.clientInsights.getCardCategories()) as CardCategories
      const highlightsResponse =
        (await client.clientInsights.getHighlights()) as Highlights
      const topWeeklyResponse = await client.clientInsights.getTopWeekly()
      res.status(200).json({
        watchlistResponse: watchlistResponse,
        cardCategoriesResponse: cardCategoriesResponse,
        highlightsResponse: highlightsResponse,
        topWeeklyResponse: topWeeklyResponse,
      })
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
