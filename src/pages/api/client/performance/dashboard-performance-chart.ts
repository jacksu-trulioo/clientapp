import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { getPerformanceChartJson } from "~/utils/clientUtils/performanceChart"
import { errorHandler } from "~/utils/errorHandler"

type PerformanceChartJSONType = { dataForPeriods: [] }

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })

  if (req.method === "GET") {
    let lang = req?.query?.langCode || "en"

    try {
      const data = await client.clientPerformance.getPerformanceDetails()
      let performanceChartData = await getPerformanceChartJson(
        data as PerformanceChartJSONType,
        lang as string,
      )
      res.status(200).json(performanceChartData)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withSentry(withApiAuthRequired(handler))
