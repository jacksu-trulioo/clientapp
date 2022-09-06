import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { ScheduleMeetingInput } from "~/services/mytfo/types"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)
  if (req.method === "POST") {
    await scheduleMeeting(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function scheduleMeeting(params: ScheduleMeetingInput) {
    try {
      const response = await client.clientDeals.scheduleMeeting(params)
      res.status(200).json(response)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
