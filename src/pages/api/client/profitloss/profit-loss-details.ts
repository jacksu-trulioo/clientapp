import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { crrRoot, ProfitLossDetails } from "~/services/mytfo/types"
import { getProfitLossDetailsJson } from "~/utils/clientUtils/profitLossDetails"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })

  const crrClient = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
    additionalHeader: [
      {
        key: "ask",
        value: "crrdata",
      },
    ],
  })

  if (req.method === "GET") {
    try {
      const profitLossData =
        await client.clientProfitLoss.getProfitLossDetails()

      const crrResponse = await crrClient?.clientMiscellaneous?.crrAsset()

      let profitLossResponse = getProfitLossDetailsJson(
        profitLossData as ProfitLossDetails,
        crrResponse as crrRoot,
      )
      res.status(200).json(profitLossResponse)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withSentry(withApiAuthRequired(handler))
