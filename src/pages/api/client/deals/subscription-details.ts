import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { SubscriptionSavedClientAppDb } from "~/services/mytfo/types"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })

  const {
    body: { subscriptionDetailsList },
  } = req

  if (req.method === "POST") {
    await getSubscriptionDetails()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getSubscriptionDetails() {
    try {
      const response = (await client.clientDeals.getSubscriptionDetails(
        subscriptionDetailsList,
      )) as SubscriptionSavedClientAppDb
      const finalData = { ...response, ...subscriptionDetailsList }

      res.status(200).json(finalData)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
