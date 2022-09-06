import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import {
  finalPortfolioActivityRes,
  PAMicroServiceType,
} from "~/services/mytfo/clientTypes"
import { getPortfolioAcitivities } from "~/utils/clientUtils/getPortfolioActivities"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })

  if (req.method === "GET") {
    try {
      const session = getSession(req, res)
      const response = (await client.clientMiscellaneous.getPortfolioAcitivity(
        session?.mandateId,
      )) as PAMicroServiceType

      let PortfolioActivityResponse: finalPortfolioActivityRes =
        getPortfolioAcitivities(response)

      res.status(200).json(PortfolioActivityResponse)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withSentry(withApiAuthRequired(handler))
