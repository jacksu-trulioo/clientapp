import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { PhoneNumberInput } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)
  if (req.method === "PATCH") {
    await updatePhoneNumber(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function updatePhoneNumber(params: PhoneNumberInput) {
    const response = await client.user.updatePhoneNumber(params)
    res.status(200).json(response)
  }
}

export default withSentry(withApiAuthRequired(handler))
