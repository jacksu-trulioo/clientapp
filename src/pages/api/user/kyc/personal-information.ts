import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { KycPersonalInformation } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "PUT") {
    await updateKycPersonalInformation(req.body)
  } else if (req.method === "GET") {
    await getKycPersonalInformation()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getKycPersonalInformation() {
    const response = await client.user.getKycPersonalInformation()

    res.status(200).json(response)
  }

  async function updateKycPersonalInformation(params: KycPersonalInformation) {
    const response = await client.user.updateKycPersonalInformation(params)
    res.status(200).json(response)
  }
}

export default withSentry(withApiAuthRequired(handler))
