import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"

export interface ParamsType {
  isInterested: boolean
  opportunityId: string
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "GET") {
    await getInteresetedOpportunities()
  } else if (req.method === "PATCH") {
    await updateInterestedOpportunity(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getInteresetedOpportunities() {
    const response = await client.user.getInteresetedOpportunities()

    res.status(200).json(response)
  }

  async function updateInterestedOpportunity(params: ParamsType) {
    const response = await client.user.updateInterestedOpportunity(params)

    res.status(200).json(response)
  }
}

export default withSentry(withApiAuthRequired(handler))
