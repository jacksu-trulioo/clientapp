import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })

  if (req.method === "DELETE") {
    await removeExpiredDealFromCart()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function removeExpiredDealFromCart() {
    try {
      await client.clientDeals.removeExpiredDealFromInvCart(req.body)
      res.status(200).json({
        msg: "Deal removed from cart",
      })
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
