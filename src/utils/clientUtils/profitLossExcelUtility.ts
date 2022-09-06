import { ProfitLossExcelArray } from "~/services/mytfo/clientTypes"
import {
  ProfitLossDetails,
  ProfitLossResults,
  Summary,
} from "~/services/mytfo/types"
import { GetSortOrderAsc } from "~/utils/clientUtils/profitLossDetails"

type QuarterProfitLossType = Array<{
  quarter: string | number
  year: number | undefined
  summary: Summary
  results: ProfitLossResults[]
}>

export const profitLossExcelUtil = async (
  profitLossData: ProfitLossDetails,
  quarter: string | number,
) => {
  let profitLossExcelArray = [] as ProfitLossExcelArray

  let profitLossResponse = profitLossData.profitLoss.map((data) => {
    return {
      quarter: data.timeperiod.quarter ? data.timeperiod.quarter : "ITD",
      year: data.timeperiod.year,
      summary: data.summary,
      results: data.results?.sort(GetSortOrderAsc("holdingType")),
    }
  })

  let getQuarterProfitLossData = profitLossResponse.filter(
    (data) => data.quarter == quarter,
  )

  createProfitLossExcelArray(getQuarterProfitLossData, profitLossExcelArray)

  return profitLossExcelArray
}

const createProfitLossExcelArray = (
  getQuarterProfitLossData: QuarterProfitLossType,
  profitLossExcelArray: ProfitLossExcelArray,
) => {
  return getQuarterProfitLossData.forEach((profitLossQuarterData) => {
    profitLossQuarterData.results.forEach((profitLossResultData, i) => {
      profitLossExcelArray.push({
        "Asset Class": `${profitLossResultData.holdingType
          .charAt(0)
          .toUpperCase()}${profitLossResultData.holdingType
          .slice(1)
          .replace(/([a-z0-9])([A-Z])/g, "$1 $2")}`,
        "Total Commision Expenses": "",
        "Total Forex Income": "",
        "Total Income": "",
        "Total Capital Appreciation": "",
        "Relative Commision Expenses": "",
        "Relative Forex Results": "",
        "Relative Income": "",
        "Relative Capital Appreciation": "",
      })
      profitLossResultData.results.forEach((investmentData) => {
        if (investmentData.result === "commissionExpenses") {
          profitLossExcelArray[i]["Total Commision Expenses"] =
            investmentData.value?.money
          profitLossExcelArray[i]["Relative Commision Expenses"] =
            investmentData?.percentChange?.percent
        }
        if (investmentData.result === "forexResults") {
          profitLossExcelArray[i]["Total Forex Income"] =
            investmentData?.value?.money
          profitLossExcelArray[i]["Relative Forex Results"] =
            investmentData?.percentChange?.percent
        }
        if (investmentData.result === "incomeDistribution") {
          profitLossExcelArray[i]["Total Income"] = investmentData?.value?.money
          profitLossExcelArray[i]["Relative Income"] =
            investmentData?.percentChange?.percent
        }
        if (investmentData.result === "marketResults") {
          profitLossExcelArray[i]["Total Capital Appreciation"] =
            investmentData?.value?.money

          profitLossExcelArray[i]["Relative Capital Appreciation"] =
            investmentData?.percentChange?.percent
        }
      })
    })
  })
}
