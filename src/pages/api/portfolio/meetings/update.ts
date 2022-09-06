import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { ScheduleMeetingInput } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "PUT") {
    await updateScheduledMeeting(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function updateScheduledMeeting(params: ScheduleMeetingInput) {
    const response = await client.portfolio.updateScheduledMeeting(params)
    res.status(200).json(response)
  }
}

export default withSentry(withApiAuthRequired(handler))
