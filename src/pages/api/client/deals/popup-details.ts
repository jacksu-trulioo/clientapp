import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { PopupDetailRoot } from "~/services/mytfo/types"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })

  if (req.method === "GET") {
    await getPopupDetails()
  } else if (req.method === "POST") {
    await postPopUpDetails()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getPopupDetails() {
    try {
      let popupData = await client?.clientDeals.getPopupData()
      const data = popupData as PopupDetailRoot
      res.status(200).json(data)
    } catch (error) {
      if (error == "Validation Error") {
        res.status(501).json(error)
      } else {
        res.status(500).json(error)
      }
    }
  }

  async function postPopUpDetails() {
    try {
      let popupData = await client?.clientDeals.postPopUpDetails(req.body)
      const data = popupData as PopupDetailRoot
      res.status(200).json(data)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
