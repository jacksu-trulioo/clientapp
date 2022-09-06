import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { PerformanceDetails } from "~/services/mytfo/types"
import { getPerformanceData } from "~/utils/clientUtils/detailedPerformance"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })

  if (req.method === "GET") {
    let lang = req?.query?.langCode || "en"

    try {
      const data = await client.clientPerformance.getPerformanceDetails()
      const filteredDetailedPerformanceJSON = await getPerformanceData(
        data as PerformanceDetails,
        lang as string,
      )
      res.status(200).json(filteredDetailedPerformanceJSON)
    } catch (error) {
      if (error == "Validation Error") {
        res.status(501).json(error)
      }
      res.status(500).json(error)
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withSentry(withApiAuthRequired(handler))
