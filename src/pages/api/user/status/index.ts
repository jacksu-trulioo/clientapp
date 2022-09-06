import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "GET") {
    await getStatus()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getStatus() {
    const statuses = await client.user.getStatus()

    res.status(200).json(statuses)
  }
}

export default withSentry(withApiAuthRequired(handler))
