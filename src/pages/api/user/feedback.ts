import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import { HTTPError } from "ky"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { UserFeedbackInput } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "POST") {
    await submitFeedback(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function submitFeedback(params: UserFeedbackInput) {
    try {
      const response = await client.user.submitFeedback(params)

      res.status(200).json(response)
    } catch (e) {
      res
        .status((e as HTTPError)?.response?.status || 500)
        .send((e as HTTPError)?.response?.body)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
