import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { getTopDeals } from "~/utils/clientUtils/getQuarterWiseTopDeals"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
    additionalHeader: [
      {
        key: "year",
        value: String(req.query.year),
      },
      {
        key: "quarter",
        value: String(req.query.quarter),
      },
    ],
  })

  if (req.method === "GET") {
    try {
      const response = await client.clientPerformance.getTopDeals()
      const data = response as { deals: []; valuationProgress: {} }
      let utilsService = await getTopDeals(data?.deals)

      res.status(200).json({
        deals: utilsService,
        valuationProgress: data?.valuationProgress,
      })
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withSentry(withApiAuthRequired(handler))
