import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { AccountSummaries, Deals } from "~/services/mytfo/types"
import {
  groupInvestmentListing,
  TranformJson,
} from "~/utils/clientUtils/investmentUtilities"
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

  if (req.method === "POST") {
    await getInvestmentListing()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getInvestmentListing() {
    try {
      const { sortBy, orderBy, filterKeys, filterValues } = req.body
      const accountSummaries =
        (await client.clientAccount.getAccountSummaries()) as AccountSummaries

      const deals = (await client.clientDeals.getClientDeals()) as Deals

      const dealsResult = await groupInvestmentListing(
        deals,
        sortBy,
        orderBy,
        filterKeys,
        filterValues,
      )
      let investmentVehicleList = TranformJson(dealsResult, orderBy)
      const finalResponse = {
        lastValuationDate: accountSummaries.lastValuationDate,
        accountCreationDate: accountSummaries.accountCreationDate,
        groupByDeals: dealsResult,
        investmentVehicleList,
      }
      res.status(200).json(finalResponse)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
