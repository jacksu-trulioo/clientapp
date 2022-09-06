import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { InvestorRiskAssessment } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "GET") {
    await getRetakeRiskAssessment()
  } else if (req.method === "PUT") {
    await updateRiskAssessmentRetake(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getRetakeRiskAssessment() {
    const response = await client.user.getRetakeRiskAssessment()

    res.status(200).json(response)
  }

  async function updateRiskAssessmentRetake(params: InvestorRiskAssessment) {
    const response = await client.user.updateRiskAssessmentRetake(params)

    res.status(200).json(response)
  }
}

export default withSentry(handler)
