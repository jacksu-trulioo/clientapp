import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { errorHandler } from "~/utils/errorHandler"

type AccountSummaryType = {
  totalValue: number
  ytdGrowth: number
  itdGrowth: number
  annualizedGrowth: number
  irrGrowth: number
}

type DataForPeriods = { dataForPeriods: [{ netChangeValue: number }] }

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const client = new MyTfoClient(req, res, {
        authRequired: true,
        msType: "maverick",
      })

      const accountSummarydata =
        await client.clientAccount.getAccountSummaries()
      const performanceDetailsData =
        await client.clientPerformance.getPerformanceDetails()

      let performanceData = performanceDetailsData as DataForPeriods

      const accountSummaryResponse = accountSummarydata as AccountSummaryType
      const performanceDetailsResponse = performanceData?.dataForPeriods[0]

      let metricsData = {
        totalAumValue: accountSummaryResponse.totalValue,
        ytdGrowth: accountSummaryResponse.ytdGrowth,
        itdGrowth: accountSummaryResponse.itdGrowth,
        annualizedGrowth: accountSummaryResponse.annualizedGrowth,
        irrGrowth: accountSummaryResponse.irrGrowth,
        netChangeValue: performanceDetailsResponse?.netChangeValue,
      }

      res.status(200).json(metricsData)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
export default withSentry(withApiAuthRequired(handler))
