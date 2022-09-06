import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { ErrorType, SummaryAllocationType } from "~/services/mytfo/types"
import { getSummaryPortfolioAllocation } from "~/utils/clientUtils/summaryPortfolioAllocation"
import { errorHandler } from "~/utils/errorHandler"

type DealDataType = {
  timePeriods: [
    {
      deals: []
      holdings: { percentages: [{ percent: number; type: string }] }
    },
  ]
}

type InvestmentDealType = {
  timePeriods: [
    {
      deals: [
        {
          type: string
          data: []
        },
      ]
    },
  ]
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
    additionalHeader: [
      {
        key: "dealType",
        value: (req?.query?.type as string) || "HOLDING",
      },
    ],
  })

  if (req.method === "GET") {
    try {
      let lang = req?.query?.langCode || "en"
      const dealsData = await client.clientDeals.getClientDeals()
      let allocationData = await getSummaryPortfolioAllocation(
        dealsData as DealDataType,
        lang as string,
      )
      client = new MyTfoClient(req, res, {
        authRequired: true,
        msType: "maverick",
        additionalHeader: [
          {
            key: "dealType",
            value: "INVESTMENT",
          },
        ],
      })
      const investmentDealData = await client.clientDeals.getClientDeals()
      let response = {
        allocationChartData: allocationData.allocationChartData,
        assetTableData: allocationData.assetTableData,
        isShowMoreData:
          req?.query?.type == "HOLDING"
            ? checkDealData(
                investmentDealData as InvestmentDealType,
                allocationData.assetTableData,
              )
            : false,
      }
      res.status(200).json(response)
    } catch (error) {
      let errorrResponse = await errorHandler(error as ErrorType)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

const checkDealData = (
  investmentDealData: InvestmentDealType,
  allocationData: SummaryAllocationType[],
) => {
  let isShow = false
  allocationData.every(({ type, data }) => {
    if (data?.length) {
      let count = investmentDealData.timePeriods[0].deals.filter((deal) => {
        return type == deal?.type
      })?.length
      if (count > data.length) {
        isShow = true
        return false
      }
    }
    return true
  })
  return isShow
}

export default withSentry(withApiAuthRequired(handler))
