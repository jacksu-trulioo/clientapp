import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { DealsType, Investment } from "~/services/mytfo/clientTypes"
import { Deals } from "~/services/mytfo/types"
import {
  groupByInvestments,
  sortByNameAndTransformJson,
} from "~/utils/clientUtils/investmentUtilities"
import { errorHandler } from "~/utils/errorHandler"

type finalResponseType = {
  investment?: Array<Investment>
  investmentVehicleList: Array<string>
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
    additionalHeader: [
      {
        key: "dealType",
        value: "INVESTMENT",
      },
    ],
  })

  if (req.method === "POST") {
    await getTotalInvestments()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getTotalInvestments() {
    try {
      const { filterKeys, filterValues, sortBy, orderBy } = req.body

      const deals = (await client.clientDeals.getClientDeals()) as Deals

      const dealsResult = (await groupByInvestments(
        deals,
        sortBy,
        orderBy,
        filterKeys,
        filterValues,
      )) as DealsType[][]

      const investmentRes = sortByNameAndTransformJson(
        dealsResult,
        orderBy,
        sortBy,
      )

      const finalResponse = {
        investments: investmentRes?.filteredDeals,
        investmentVehicleList: investmentRes.investmentVehicleList,
      } as finalResponseType

      res.status(200).json(finalResponse)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
