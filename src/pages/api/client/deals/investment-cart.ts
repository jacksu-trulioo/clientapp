import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { InvestmentCartDealDetails } from "~/services/mytfo/clientTypes"
import {
  clientOpportunitiesArray,
  InvestmentCart,
} from "~/services/mytfo/types"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })

  const {
    query: { langCode },
  } = req

  let lang = langCode || "en"

  if (req.method === "GET") {
    await getInvestmentCart()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getInvestmentCart() {
    try {
      const session = getSession(req, res)

      const clientOpportunities: clientOpportunitiesArray =
        await client.clientDeals.getClientOpportunities(session?.mandateId)
      const getInvestmentCartDetails: InvestmentCart =
        (await client.clientDeals.getInvestmentCart()) as InvestmentCart

      let filteredArray: InvestmentCartDealDetails[] = []
      getInvestmentCartDetails.investmentCartDeals.forEach((cart) => {
        let opportunities = clientOpportunities.find((deal) => {
          return deal.opportunityId == cart.dealId
        })
        filteredArray.push({
          opportunityId: opportunities?.opportunityId || cart.dealId,
          opportunityName: opportunities?.opportunityName || cart.dealName,
          sponsor: opportunities?.sponsor,
          assetClass: lang.includes("en")
            ? opportunities?.assetClass
            : opportunities?.assetClassAr,
          sector: lang.includes("en")
            ? opportunities?.sector
            : opportunities?.sectorAr,
          expectedExitYear: opportunities?.expectedExitYear,
          expectedReturn: opportunities?.expectedReturn,
          country: lang.includes("en")
            ? opportunities?.country
            : opportunities?.countryAr,
          isInterested: opportunities?.isInterested,
          minimumAmount: opportunities?.minimumAmount || 0,
          maximumAmount: opportunities?.maximumAmount || 0,
          isAddedToCart: opportunities?.isAddedToCart,
          isInvestmentPreferenceShariah: cart.isInvestmentPreferenceShariah,
          isProgram: cart.isProgram,
          associatedConventionalDealId: cart.associatedConventionalDealId,
          isSeen: opportunities?.isSeen,
          isScheduled: opportunities?.isScheduled,
          clientOpportunityId: opportunities?.clientOpportunityId,
          isExpiredDeal: opportunities ? false : true,
          // isExpiredDeal: true,
        })
      })

      res.status(200).json(filteredArray)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
