import { withSentry } from "@sentry/nextjs"
import { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { decryptBody } from "~/utils/encryption"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = new MyTfoClient(req, res, { authRequired: false })
    const body = decryptBody(req)
    if (!body) {
      res.status(401).end()
      return
    }
    const emailOrUsername = { emailOrUsername: body.email }
    const data = await client.auth.requestPasswordReset(emailOrUsername)

    res.status(200).end(JSON.stringify(data))
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

export default withSentry(handler)
