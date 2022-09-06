import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import {
  AllocationCategory,
  SimulatePortfolioInput,
} from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "POST") {
    await calculateSimulatedPortfolio(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  // Returns the simulated portfolio data along with sample deals for each allocation.
  async function calculateSimulatedPortfolio(params: SimulatePortfolioInput) {
    const simulatedPortfolioData = await client.portfolio.simulatePortfolio(
      params,
    )
    const sampleDealsData = await client.portfolio.getSampleDeals()

    // Filter sample deals.
    const filteredSampleDealsData = Object.keys(sampleDealsData).map((key) => {
      switch (key) {
        case "capitalYielding": {
          return {
            categorization: AllocationCategory.CapitalYielding,
            deals: sampleDealsData["capitalYielding"],
          }
        }
        case "capitalGrowth": {
          return {
            categorization: AllocationCategory.CapitalGrowth,
            deals: sampleDealsData["capitalGrowth"],
          }
        }
        case "opportunistic": {
          return {
            categorization: AllocationCategory.Opportunistic,
            deals: sampleDealsData["opportunistic"],
          }
        }
        case "absoluteReturn": {
          return {
            categorization: AllocationCategory.AbsoluteReturn,
            deals: sampleDealsData["absoluteReturn"],
          }
        }
      }
    })

    function getDealsForAllocation(category: AllocationCategory) {
      let deals =
        filteredSampleDealsData.find((item) => {
          if (item?.categorization === category) {
            return item
          }
        })?.deals || []

      // Filter Sharia'h compliant deals.
      deals = deals.filter(
        (deal) => deal.isShariahCompliant === params.isShariaCompliant,
      )

      return deals
    }

    // Update allocations with sample deals.
    simulatedPortfolioData.allocations.forEach((allocation) => {
      switch (allocation.categorization) {
        case AllocationCategory.CapitalYielding:
          allocation.sampleDeals = getDealsForAllocation(
            AllocationCategory.CapitalYielding,
          )
          return
        case AllocationCategory.CapitalGrowth:
          allocation.sampleDeals = getDealsForAllocation(
            AllocationCategory.CapitalGrowth,
          )
          return
        case AllocationCategory.Opportunistic:
          allocation.sampleDeals = getDealsForAllocation(
            AllocationCategory.Opportunistic,
          )
          return
        case AllocationCategory.AbsoluteReturn:
          allocation.sampleDeals = getDealsForAllocation(
            AllocationCategory.AbsoluteReturn,
          )
          return
      }
    })

    res.status(200).json(simulatedPortfolioData)
  }
}

export default withSentry(withApiAuthRequired(handler))
