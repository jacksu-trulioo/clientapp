import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import {
  AccountSummaries,
  Deals,
  DistributionCapital,
  ErrorType,
} from "~/services/mytfo/types"
import { getStructuredRecentDealActivityJSON } from "~/utils/clientUtils/recentDealActivties"
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
    await getRecentActivities()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  async function getRecentActivities() {
    try {
      const distributionCapital =
        await client.clientDeals.getDistributionCapital()
      const accountSummary = await client.clientAccount.getAccountSummaries()
      const deals = await client.clientDeals.getClientDeals()
      let structuredJSON = await getStructuredRecentDealActivityJSON(
        distributionCapital as DistributionCapital,
        accountSummary as AccountSummaries,
        deals as Deals,
      )
      res.status(200).json(structuredJSON)
    } catch (error) {
      let errorrResponse = await errorHandler(error as ErrorType)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
