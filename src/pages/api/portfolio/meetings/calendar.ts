import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { MeetingCalendarInput } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "POST") {
    await getMeetingCalendar(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getMeetingCalendar(params: MeetingCalendarInput) {
    const meetingCalendar = await client.portfolio.getMeetingCalendar(params)

    res.status(200).json(meetingCalendar)
  }
}

export default withSentry(withApiAuthRequired(handler))
