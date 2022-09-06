import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { getInterestedOpp } from "~/utils/clientUtils/getClientInterestedOpportunities"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })

  if (req.method === "GET") {
    await getClientInterestedOpportunities()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getClientInterestedOpportunities() {
    try {
      const { langCode } = req.query

      const session = getSession(req, res)

      const response = await client.clientDeals.getClientOpportunities(
        session?.mandateId,
      )

      const data = response

      let lang = langCode as string

      const finalRes = getInterestedOpp(data, lang)

      res.status(200).json(finalRes)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
