import { getSession } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "GET") {
    let session = getSession(req, res)
    await getUser(session?.user.nickname)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getUser(username: string) {
    const response = await client.clientUser.getUser({ username })
    res.status(200).json(response)
  }
}

export default withSentry(handler)
