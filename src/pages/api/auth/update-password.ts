import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { decryptBody } from "~/utils/encryption"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = new MyTfoClient(req, res)
    const body = decryptBody(req)
    if (!body) {
      res.status(401).end()
      return
    }
    const response = await client.auth.updatePassword(body)

    res.status(200).end(JSON.stringify(response))
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

export default withSentry(withApiAuthRequired(handler))
