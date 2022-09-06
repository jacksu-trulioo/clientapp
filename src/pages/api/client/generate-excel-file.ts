import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import fs from "fs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import {
  DealDataType,
  DealDistributionTypes,
} from "~/services/mytfo/clientTypes"
import {
  Deals,
  PerformanceDetails,
  ProfitLossDetails,
  TotalCommitments,
} from "~/services/mytfo/types"
import { cashflowExcelUtil } from "~/utils/clientUtils/cashflowExcelUtility"
import { commitmentExcelUtil } from "~/utils/clientUtils/commitmentExcelUtility"
import { generateExcelWithJsonData } from "~/utils/clientUtils/generateExcel"
import { investmentListingExcelUtil } from "~/utils/clientUtils/investmentListingExcelUtility"
import { performanceExcelUtil } from "~/utils/clientUtils/performanceExcelUtility"
import { portfolioSummaryExcelUtil } from "~/utils/clientUtils/portfolioSummaryExcelUtility"
import { profitLossExcelUtil } from "~/utils/clientUtils/profitLossExcelUtility"
import { totalInvestmentExcelUtil } from "~/utils/clientUtils/totalInvestmentExcelUtility"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let additionalHeaders = [] as Array<{ key: string; value: string }>

  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
    additionalHeader: additionalHeaders,
  })

  if (req.method === "POST") {
    const session = getSession(req, res)

    const {
      type,
      langCode,
      quarter,
      headerType,
      filterKeys,
      filterValues,
      orderBy,
    } = req?.body

    await getDataInExcel(
      type,
      langCode,
      quarter,
      session?.mandateId,
      headerType,
      filterKeys,
      filterValues,
      orderBy,
    )
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getDataInExcel(
    type:
      | "totalInvestment"
      | "investmentListing"
      | "cashflow"
      | "totalCommitment"
      | "profitAndLoss"
      | "portfolioSummary"
      | "performance",
    langCode: string,
    quarter: string | number,
    mandateId: string,
    headerType: string,
    filterKeys: Array<string>,
    filterValues: Array<string>,
    orderBy: string,
  ) {
    try {
      let tempFileName = `${mandateId}-${type}`

      if (type === "cashflow") {
        const response =
          (await client.clientDeals.getDistributionDetails()) as DealDistributionTypes

        let cashflowExcelRes = await cashflowExcelUtil(response)

        generateExcelWithJsonData(cashflowExcelRes, tempFileName)
      } else if (type === "totalInvestment" || type === "investmentListing") {
        additionalHeaders.push({
          key: "dealType",
          value: "INVESTMENT",
        })

        let deals = (await client.clientDeals.getClientDeals()) as Deals

        if (type === "totalInvestment") {
          let investmentExcelRes = await totalInvestmentExcelUtil(
            deals,
            filterKeys,
            filterValues,
            orderBy,
          )

          generateExcelWithJsonData(investmentExcelRes, tempFileName)
        } else {
          let listingInvestmentExcelRes = await investmentListingExcelUtil(
            deals,
            filterKeys,
            filterValues,
            quarter,
            orderBy,
          )

          generateExcelWithJsonData(listingInvestmentExcelRes, tempFileName)
        }
      } else if (type === "totalCommitment") {
        const response =
          (await client.clientCommitment.getTotalCommitmentDetails()) as TotalCommitments

        let commitmentExcelRes = await commitmentExcelUtil(
          response,
          filterValues,
          orderBy,
          "asc",
        )

        generateExcelWithJsonData(commitmentExcelRes, tempFileName)
      } else if (type === "profitAndLoss") {
        const profitLossData =
          (await client.clientProfitLoss.getProfitLossDetails()) as ProfitLossDetails

        let profitLossExcelRes = await profitLossExcelUtil(
          profitLossData,
          quarter,
        )

        generateExcelWithJsonData(profitLossExcelRes, tempFileName)
      } else if (type === "portfolioSummary") {
        additionalHeaders.push({
          key: "dealType",
          value: headerType || "HOLDING",
        })

        let dealsData = await client.clientDeals.getClientDeals()

        let portfolioSummaryExcelRes = await portfolioSummaryExcelUtil(
          dealsData as DealDataType,
          langCode,
        )

        generateExcelWithJsonData(portfolioSummaryExcelRes, tempFileName)
      } else if (type === "performance") {
        const performanceData =
          await client.clientPerformance.getPerformanceDetails()

        let performanceExcelRes = await performanceExcelUtil(
          performanceData as PerformanceDetails,
          langCode,
          quarter,
        )

        generateExcelWithJsonData(performanceExcelRes, tempFileName)
      }

      const fileBuffer = fs.readFileSync(`${tempFileName}.xlsx`)
      fs.unlink(`${tempFileName}.xlsx`, async (error) => {
        if (error) {
          let errorrResponse = await errorHandler(error)
          return res
            .status(errorrResponse?.statusCode || 500)
            .json(errorrResponse)
        } else {
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          )
          res.send(fileBuffer)
        }
      })
    } catch (error) {
      console.log(error, "error")

      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
