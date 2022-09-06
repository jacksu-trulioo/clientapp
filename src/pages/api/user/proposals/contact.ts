import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { InvestorProfileGoals } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)
  const { query = {} } = req
  const contactId = query.id as string

  if (req.method === "GET") {
    await getContactProposal(contactId)
  } else if (req.method === "PUT") {
    await updateContactProposal(contactId, req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  async function getContactProposal(id: string) {
    const response = await client.user.getContactProposal({ id })
    res.status(200).json(response)
  }

  async function updateContactProposal(id: string, data: InvestorProfileGoals) {
    const response = await client.user.updateContactProposal({ id, data })
    res.status(200).json(response)
  }
}
export default withSentry(withApiAuthRequired(handler))
