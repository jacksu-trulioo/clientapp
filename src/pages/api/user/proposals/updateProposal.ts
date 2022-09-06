import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { InvestorProfileGoals } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "PUT") {
    await updateProposal(req.body)
  }

  async function updateProposal(params: InvestorProfileGoals) {
    const profile = await client.user.updateProposal(params)

    res.status(200).json(profile)
  }
}

export default withSentry(withApiAuthRequired(handler))
