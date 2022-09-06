import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)
  const { query = {} } = req
  const id = query.id as string
  if (req.method === "GET") {
    await getMarketUpdate(id)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getMarketUpdate(id: string) {
    const response = await client.portfolio.getMarketUpdate({ id })

    res.status(200).json(response)
  }
}

export default withSentry(withApiAuthRequired(handler))
