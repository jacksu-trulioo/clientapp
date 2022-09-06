import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import {
  AccountSummaries,
  Deals,
  PerformanceDetails,
} from "~/services/mytfo/types"
import { getTotalInvestmentChartSeries } from "~/utils/clientUtils/investmentUtilities"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
    additionalHeader: [
      {
        key: "dealType",
        value: "INVESTMENT",
      },
    ],
  })

  if (req.method === "GET") {
    await getTotalInvestments()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getTotalInvestments() {
    try {
      let lang = req?.query?.langCode || "en"
      const deals = (await client.clientDeals.getClientDeals()) as Deals

      const accountSummaries =
        (await client.clientAccount.getAccountSummaries()) as AccountSummaries

      const responsePieChartData = await getTotalInvestmentChartSeries(
        deals,
        lang as string,
      )

      const regionPercentage = deals.timePeriods[0].regionPercentage

      const performanceDetails =
        (await client.clientPerformance.getPerformanceDetails()) as PerformanceDetails

      const finalResponse = {
        lastValuationDate: accountSummaries.lastValuationDate,
        pieChartData: responsePieChartData,
        regionPercentage: regionPercentage,
        deals: accountSummaries.deals,
        avgHoldingPeriod: performanceDetails.dataForPeriods[0].avgHoldingPeriod,
        cashInTransit: {
          cash: deals.timePeriods[0].holdings.cash,
          liquid: deals.timePeriods[0].holdings.liquid,
          illiquid: deals.timePeriods[0].holdings.illiquid,
          cashInTransit: deals.timePeriods[0].holdings.cashInTransit,
          totalAum: accountSummaries?.totalValue,
        },
      }
      res.status(200).json(finalResponse)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withApiAuthRequired(handler)
