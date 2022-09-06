import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { CancelMeetingInput } from "~/services/mytfo/types"
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)
  if (req.method === "POST") {
    await cancelMeeting(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function cancelMeeting(params: CancelMeetingInput) {
    const cancelStatus = await client.portfolio.cancelMeeting(params)
    res.status(200).json(cancelStatus)
  }
}
export default withSentry(withApiAuthRequired(handler))
