import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { decryptBody } from "~/utils/encryption"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, { authRequired: false })
  const body = decryptBody(req)
  if (!body) {
    res.status(401).end()
    return
  }

  if (req.method === "POST") {
    return getStatus(body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getStatus(params: {
    email: string
    data: string
    ttl: string
  }) {
    const status = await client.auth.onBoardProfile(params)
    res.status(200).json(status)
  }
}

export default withSentry(handler)
