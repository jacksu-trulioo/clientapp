import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { UnlockOpportunityFlow } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)
  if (req.method === "POST") {
    await submitOpportunityTrackingData(req.body)
  } else if (req.method === "GET") {
    await getOpportunityTrackingData()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  async function submitOpportunityTrackingData(params: UnlockOpportunityFlow) {
    const response = await client.user.submitTrackUnlockOpportunityFlow(params)
    res.status(200).json(response)
  }

  async function getOpportunityTrackingData() {
    const response = await client.user.getTrackUnlockOpportunityFlow()
    res.status(200).json(response)
  }
}
export default withSentry(handler)
