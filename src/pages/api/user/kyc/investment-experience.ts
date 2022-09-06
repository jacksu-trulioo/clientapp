import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { KycInvestmentExperience } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  async function getKycInvestmentExperience() {
    const response = await client.user.getKycInvestmentExperience()

    res.status(200).json(response)
  }

  async function updateKycInvestmentExperience(
    params: KycInvestmentExperience,
  ) {
    const response = await client.user.updateKycInvestmentExperience(params)
    res.status(200).json(response)
  }

  if (req.method === "PUT") {
    await updateKycInvestmentExperience(req.body)
  } else if (req.method === "GET") {
    await getKycInvestmentExperience()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withSentry(withApiAuthRequired(handler))
