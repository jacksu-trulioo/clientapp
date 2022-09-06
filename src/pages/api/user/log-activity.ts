import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { LogActivity } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "POST") {
    await addLogActivity(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function addLogActivity(params: LogActivity) {
    const profile = await client.user.addLogActivity(params)

    res.status(200).json(profile)
  }
}

export default withSentry(withApiAuthRequired(handler))
