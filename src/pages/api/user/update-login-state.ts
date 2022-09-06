import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)
  if (req.method === "PUT") {
    await updateLoginState()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  async function updateLoginState() {
    const response = await client.user.updateLoginState()
    res.status(200).json(response)
  }
}
export default withSentry(handler)
