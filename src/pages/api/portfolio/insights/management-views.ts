import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {
  const httpWrapperClient = new MyTfoClient(req, res)
  const { query } = req
  const id = query?.currentPage as string
  if (req.method === "GET") {
    await getManagementViews(id)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getManagementViews(id: string) {
    const response = await httpWrapperClient.portfolio.getManagementViews(id)
    res.status(200).json(response)
  }
}

export default withSentry(withApiAuthRequired(requestHandler))
