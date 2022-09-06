import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "POST") {
    try {
      await sendOtpForAbsher(req.body)
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message })
        return
      }
      res.status(500).json({ error: "Internal Server Error" })
      return
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function sendOtpForAbsher(params: { nationalIdNumber: number }) {
    const payload = { nationalityId: params.nationalIdNumber }
    const response = await client.user.sendOtpForAbsher(payload)
    res.status(200).json(response)
  }
}

export default withSentry(withApiAuthRequired(handler))
