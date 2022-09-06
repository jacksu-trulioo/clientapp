import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { DealDistributionTypes } from "~/services/mytfo/clientTypes"
import { getQuarterDistDetails } from "~/utils/clientUtils/getDealDistributionDetails"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })

  if (req.method === "GET") {
    let orderBy = req?.query?.orderBy || "desc"

    try {
      const response =
        (await client.clientDeals.getDistributionDetails()) as DealDistributionTypes

      let dealDistributationDetailsResponse: DealDistributionTypes =
        getQuarterDistDetails(response, orderBy as string)

      res.status(200).json(dealDistributationDetailsResponse)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withSentry(withApiAuthRequired(handler))
