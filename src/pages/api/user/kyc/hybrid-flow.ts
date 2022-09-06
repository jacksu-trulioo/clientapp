import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { KycHybridFlowFlag } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "GET") {
    await getKycHybridFlow()
  } else if (req.method === "PUT") {
    await updateKycHybridFlow(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getKycHybridFlow() {
    const response = await client.user.getKycHybridFlowFlag()

    res.status(200).json(response)
  }

  async function updateKycHybridFlow(params: KycHybridFlowFlag) {
    const meetingCalendar = await client.user.updateKycHybridFlowFlag(params)

    res.status(200).json(meetingCalendar)
  }
}

export default withSentry(withApiAuthRequired(handler))
