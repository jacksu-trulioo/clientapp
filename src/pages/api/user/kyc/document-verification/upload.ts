import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { KycSubmitDocumentRequest } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "POST") {
    await submitKycDocument(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function submitKycDocument(params: KycSubmitDocumentRequest) {
    const response = await client.user.submitKycDocument(params)
    res.status(200).json(response)
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "6mb",
    },
  },
}

export default withSentry(withApiAuthRequired(handler))
