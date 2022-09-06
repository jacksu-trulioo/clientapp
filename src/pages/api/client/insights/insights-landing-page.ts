import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { TopBonds, TopIndices, TopStocks } from "~/services/mytfo/clientTypes"
import { Highlights, TopWeekly } from "~/services/mytfo/types"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })

  if (req.method === "GET") {
    await getInsightsLandingPage()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getInsightsLandingPage() {
    try {
      const resHighlights =
        (await client.clientInsights.getHighlights()) as Highlights
      const resTopWeekly =
        (await client.clientInsights.getTopWeekly()) as TopWeekly

      let topIndices: TopIndices[] = []
      let topStocks: TopStocks[] = []
      let topBonds: TopBonds[] = []

      if (resTopWeekly.topIndices.length) {
        resTopWeekly.topIndices.slice(0, 9).forEach((item) => {
          let objTopIndices: TopIndices = {
            indexName: item.indexName,
            indexCode: item.indexCode,
            indexLevel: item.indexLevel,
            indexWeekChange: {
              percent: item.indexWeekChange.percent,
              direction: item.indexWeekChange.direction,
              unit: item.indexWeekChange.unit,
            },
          }
          topIndices.push(objTopIndices)
        })
      }
      if (resTopWeekly.topStocks.length) {
        resTopWeekly.topStocks.slice(0, 4).forEach((item) => {
          let objTopStocks: TopStocks = {
            stockCompany: item.stockCompany,
            stockCode: item.stockCode,
            stockPrice: item.stockPrice,
            stockWeekChange: {
              percent: item.stockWeekChange.percent,
              direction: item.stockWeekChange.direction,
            },
          }
          topStocks.push(objTopStocks)
        })
      }
      if (resTopWeekly.topBonds.length) {
        resTopWeekly.topBonds.slice(0, 5).forEach((item) => {
          let objTopBonds: TopBonds = {
            bondYields: item.bondYields,
            bondMaturity: item.bondMaturity,
            bondStockWeekChange: {
              percent: item.bondStockWeekChange.percent,
              direction: item.bondStockWeekChange.direction,
              unit: item.bondStockWeekChange.unit,
            },
            bondWeekChange: {
              percent: item.bondWeekChange.percent,
              direction: item.bondWeekChange.direction,
              unit: item.bondWeekChange.unit,
            },
          }
          topBonds.push(objTopBonds)
        })
      }

      let finalResponse = {
        highlights: resHighlights.highlights,
        marketSimplified: {
          message: resTopWeekly.message,
          messageAr: resTopWeekly.messageAr,
          week: resTopWeekly.week,
          sectionTitle: resTopWeekly.sectionTitle,
          timestamp: resTopWeekly.timestamp,
          topIndices: topIndices,
          topStocks: topStocks,
          topBonds: topBonds,
        },
      }

      res.status(200).json(finalResponse)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}
export default withSentry(withApiAuthRequired(handler))
