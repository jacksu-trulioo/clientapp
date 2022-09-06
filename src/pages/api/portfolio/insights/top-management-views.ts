import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {
  const httpWrapperClient = new MyTfoClient(req, res)
  const { query = {} } = req
  const excludingId = query.excludingId as string
  if (req.method === "GET") {
    await getTopManagementViews(excludingId)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  /**
   * @name getTopManagementViews
   * @param excludingId<string>
   * @desc used to get the top management view data from server
   * @rerun props<ManagementView>
   */
  async function getTopManagementViews(excludingId: string) {
    const response = await httpWrapperClient.portfolio.getTopManagementViews({
      excludingId,
    })
    res.status(200).json(response)
  }
}

export default withSentry(withApiAuthRequired(requestHandler))
