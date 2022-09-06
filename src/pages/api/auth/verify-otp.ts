import { withSentry } from "@sentry/nextjs"
import Cookies from "cookies"
import { HTTPError } from "ky"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { VerifyOTPInput } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "POST") {
    return verifyOtp(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function verifyOtp(params: VerifyOTPInput) {
    try {
      const status = await client.auth.verifyOtp(params)
      const cookies = new Cookies(req, res)
      cookies.set("phoneNumberVerified", "true", {
        httpOnly: true, // true by default
      })
      res.status(200).json(status)
    } catch (error) {
      res
        .status((error as HTTPError)?.response?.status || 500)
        .send((error as HTTPError)?.response?.body)
    }
  }
}

export default withSentry(handler)
