import {
  crrRoot,
  ProfitLossDetails,
  ProfitLossResults,
} from "~/services/mytfo/types"

export const getProfitLossDetailsJson = (
  profitLossData: ProfitLossDetails,
  crrData: crrRoot,
) => {
  return {
    profitLoss: profitLossData.profitLoss.map((data) => {
      return {
        quarter: data.timeperiod.quarter ? data.timeperiod.quarter : "ITD",
        year: data.timeperiod.year,
        summary: data.summary,
        results: data.results?.sort(GetSortOrderAsc("holdingType")),
      }
    }),
    crrData: crrData.finalData.maximumDrawDown,
    isCRRExists: crrData.finalData.maximumDrawDown ? true : false,
  }
}
export const GetSortOrderAsc = (prop: string) => {
  return function (a: ProfitLossResults, b: ProfitLossResults) {
    if (
      a[prop as keyof ProfitLossResults] > b[prop as keyof ProfitLossResults]
    ) {
      return 1
    } else if (
      a[prop as keyof ProfitLossResults] < b[prop as keyof ProfitLossResults]
    ) {
      return -1
    }
    return 0
  }
}
