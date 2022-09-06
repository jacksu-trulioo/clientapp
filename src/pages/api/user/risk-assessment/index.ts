import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { InvestorRiskAssessment } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "GET") {
    await getRiskAssessment()
  } else if (req.method === "PUT") {
    await updateRiskAssessment(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getRiskAssessment() {
    const response = await client.user.getRiskAssessment()

    res.status(200).json(response)
  }

  async function updateRiskAssessment(params: InvestorRiskAssessment) {
    const response = await client.user.updateRiskAssessment(params)

    res.status(200).json(response)
  }
}

export default withSentry(withApiAuthRequired(handler))
