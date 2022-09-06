import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { clientOpportunitiesArray } from "~/services/mytfo/types"
import {
  getUniqueFilterValues,
  sortandFilterData,
} from "~/utils/clientUtils/getAllDeals"
import { getOpportunitybyId } from "~/utils/clientUtils/getOpportunity"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })

  const {
    query: { opportunityId, langCode },
    body: { orderBy, sortBy, filterKeys, filterValues },
  } = req

  let lang = langCode || "en"
  const session = getSession(req, res)
  if (req.method === "GET") {
    try {
      const response: clientOpportunitiesArray =
        await client.clientDeals.getClientOpportunities(session?.mandateId)
      const structuredData = await getOpportunitybyId(
        response,
        Number(opportunityId),
        lang as string,
      )
      res.status(200).json(structuredData)
    } catch (error) {
      if (error == "Validation Error") {
        res.status(501).json(error)
      }
      res.status(500).json(error)
    }
  } else if (req.method === "POST") {
    try {
      const data: clientOpportunitiesArray =
        await client.clientDeals.getClientOpportunities(session?.mandateId)
      const filteredDetailedPerformanceJSON = (await sortandFilterData(
        data as [],
        filterKeys,
        filterValues,
        orderBy,
        sortBy,
        lang as string,
      )) as clientOpportunitiesArray
      const uniqueFilterValues = await getUniqueFilterValues(data)
      res.status(200).json({
        data: filteredDetailedPerformanceJSON,
        filterValues: uniqueFilterValues,
      })
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withSentry(withApiAuthRequired(handler))
