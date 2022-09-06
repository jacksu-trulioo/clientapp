import { withSentry } from "@sentry/nextjs"
import { HTTPError } from "ky"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "POST") {
    return sendOtp(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function sendOtp(params: { phoneNumber: string }) {
    try {
      const status = await client.auth.sendOtp(params)
      res.status(200).json(status)
    } catch (error) {
      res
        .status((error as HTTPError)?.response?.status || 500)
        .send((error as HTTPError)?.response?.body)
    }
  }
}

export default withSentry(handler)
