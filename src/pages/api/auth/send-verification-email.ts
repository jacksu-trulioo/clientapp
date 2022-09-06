import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = new MyTfoClient(req, res)
    const data = await client.auth.resendEmailVerification()

    res.status(200).end(JSON.stringify(data))
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

export default withSentry(withApiAuthRequired(handler))
