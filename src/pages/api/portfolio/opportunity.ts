import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)
  const { query = {} } = req
  const id = query.id as string
  if (req.method === "GET") {
    await getOpportunity(id)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getOpportunity(id: string) {
    try {
      const response = await client.portfolio.getOpportunity({ id })
      res.status(200).json(response)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("403")) {
          res.status(403).json({ message: error.message })
          return
        }
      }
      res.status(500)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
