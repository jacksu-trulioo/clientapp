import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { TransformJson } from "~/utils/clientUtils/clientOpportunitiesUtilities"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })

  const {
    query: { count, langCode, id },
  } = req

  if (req.method === "GET") {
    await getClientOpportunities()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getClientOpportunities() {
    try {
      const session = getSession(req, res)
      const lang = langCode || "en"
      const response = await client.clientDeals.getClientOpportunities(
        session?.mandateId,
      )
      const data = response
      res.status(200).json(TransformJson(data, count, lang, id))
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
