import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { AccountSummaries } from "~/services/mytfo/types"
import {
  getLastFourQuarters,
  getTotalCommitmentsStartAndEndDate,
} from "~/utils/clientUtils/portfolioOverviewUtilities"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      let lang = req?.query?.langCode || "en"
      const client = new MyTfoClient(req, res, {
        authRequired: true,
        msType: "maverick",
      })

      const accountSummarydata =
        await client.clientAccount.getAccountSummaries()

      const {
        lastValuationDate,
        cashFlowProjections,
        cashflowChartValuesCapitalCall,
        cashflowChartValues,
        itdGrowth,
        ytdGrowth,
        annualizedGrowth,
        profitLoss,
        profitLossChartValues,
        deals,
        commitments,
        commitmentChartValues,
        marketSpectrumData,
        performanceChartValues,
      } = accountSummarydata as AccountSummaries
      const lastFourQuarters = await getLastFourQuarters(
        lastValuationDate as string,
        lang as string,
      )
      const totalCommitmentsStartAndEndDate =
        getTotalCommitmentsStartAndEndDate(lastValuationDate as string)
      const portfolioOverviewDetails = {
        cashFlowProjections: cashFlowProjections,
        cashflowChartValuesCapitalCall: cashflowChartValuesCapitalCall,
        cashflowChartValues: cashflowChartValues,
        itdGrowth: itdGrowth,
        ytdGrowth: ytdGrowth,
        annualizedGrowth: annualizedGrowth,
        profitLoss: profitLoss,
        profitLossChartValues: profitLossChartValues,
        deals: deals,
        commitments: commitments,
        commitmentChartValues: commitmentChartValues,
        totalCommitmentsStartAndEndDate: totalCommitmentsStartAndEndDate,
        marketSpectrumData: marketSpectrumData,
        performanceChartValues: performanceChartValues,
        lastFourQuarters: lastFourQuarters,
      }
      res.status(200).json(portfolioOverviewDetails)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
export default withSentry(withApiAuthRequired(handler))
