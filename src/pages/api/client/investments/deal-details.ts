import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { DealDetails } from "~/services/mytfo/clientTypes"
import { Deals } from "~/services/mytfo/types"
import { BasicInfo } from "~/utils/clientUtils/investmentUtilities"
import { errorHandler } from "~/utils/errorHandler"

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

  if (req.method === "GET") {
    await getdealDetails()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getdealDetails() {
    try {
      const deals = (await client.clientDeals.getClientDeals()) as Deals
      const dealId: string = req.query.dealId as string

      const clientDealDetails = new MyTfoClient(req, res, {
        authRequired: true,
        msType: "maverick",
        additionalHeader: [
          {
            key: "dealId",
            value: dealId.toString(),
          },
        ],
      })

      const dealDetails =
        (await clientDealDetails.clientDeals.getDealDetails()) as DealDetails
      res.status(200).json(BasicInfo(dealDetails, deals, dealId))
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
