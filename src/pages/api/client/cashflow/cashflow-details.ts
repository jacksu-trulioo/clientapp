import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import moment from "moment"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { Cashflows } from "~/services/mytfo/types"
import {
  orderByService,
  roundCurrencyValue,
} from "~/utils/clientUtils/globalUtilities"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })

  if (req.method === "GET") {
    let orderBy = req?.query?.orderBy || "desc"

    try {
      const cashflowDetails = await client.clientCashFlows.getCashFlowDetails()

      let cashFlowDetailsResponse: object = getCashflowJson(
        cashflowDetails as Cashflows,
        orderBy as string,
      )

      res.status(200).json(cashFlowDetailsResponse)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export const getCashflowJson = (
  cashflowDetails: Cashflows,
  orderBy: string,
) => {
  return {
    year: moment(
      cashflowDetails.distributionPerTimePeriod[0].timeperiod.toDate,
    ).format("YYYY"),

    ytdDistributionProjection: roundCurrencyValue(
      cashflowDetails.ytdDistributionProjection,
    ),
    itdDistributionProjection: roundCurrencyValue(
      cashflowDetails.itdDistributionProjection,
    ),
    ytdCapitalCallProjection: roundCurrencyValue(
      cashflowDetails.ytdCapitalCallProjection,
    ),
    itdCapitalCallProjection: roundCurrencyValue(
      cashflowDetails.itdCapitalCallProjection,
    ),
    yearFrom:
      cashflowDetails.distributionPerTimePeriod[
        cashflowDetails.distributionPerTimePeriod.length - 1
      ].timeperiod.year,
    yearTo: cashflowDetails.distributionPerTimePeriod[1].timeperiod.year,
    distributionPerTimePeriod: orderByService(
      cashflowDetails.distributionPerTimePeriod,
      orderBy,
    ),
  }
}

export default withSentry(withApiAuthRequired(handler))
