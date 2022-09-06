import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { SubscriptionPrograms } from "~/services/mytfo/clientTypes"
import {
  ProgramDeals,
  ProgramsDetailsPayload,
  ProgramsPayload,
} from "~/services/mytfo/types"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })
  const {
    body: { programs },
  } = req
  if (req.method === "POST") {
    try {
      const getProgramDealsResponse = (await client.clientDeals.getProgramDeals(
        programs,
      )) as ProgramDeals
      const response = await getProgramDeals(getProgramDealsResponse, programs)
      res.status(200).json(response)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
async function getProgramDeals(
  getProgramDealsResponse: ProgramDeals,
  programs: ProgramsDetailsPayload,
) {
  try {
    const result = (await Promise.all(
      programs.map(function (programsList: ProgramsPayload) {
        const obj = getProgramDealsResponse.find(
          (o) => o.programId === programsList.programId,
        )
        return { ...programsList, ...obj }
      }),
    )) as SubscriptionPrograms
    // await Promise.all(
    //   result.map(function (programDealsList: ProgramsDetails) {
    //     let amount =
    //       Number(programDealsList.subscriptionAmount) /
    //         programDealsList.concentration ==
    //       20
    //         ? 5
    //         : programDealsList.concentration == 10
    //         ? 10
    //         : 20
    //     programDealsList.deals.forEach((element) => {
    //       if (element.unplacedAmount > amount) {
    //         element.commitedAmount = amount
    //       } else if (element.unplacedAmount < amount) {
    //         element.commitedAmount = element.unplacedAmount
    //       }
    //     })
    //   }),
    // )
    return result
  } catch (error) {
    return error
  }
}
export default withSentry(withApiAuthRequired(handler))
