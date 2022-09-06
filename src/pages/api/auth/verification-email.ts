import { withSentry } from "@sentry/nextjs"
import { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { decryptBody } from "~/utils/encryption"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const client = new MyTfoClient(req, res, { authRequired: false })
      const body = decryptBody(req)
      if (!body) {
        res.status(401).end()
        return
      }
      const data = await client.auth.verificationEmail({ email: body })

      res.status(200).end(JSON.stringify(data))
    } else {
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

export default withSentry(handler)
