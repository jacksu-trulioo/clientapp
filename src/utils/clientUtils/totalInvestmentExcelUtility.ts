import moment from "moment"

import {
  DealsType,
  InvestmentOrPortfolioSummaryExcelArray,
} from "~/services/mytfo/clientTypes"
import { Deals } from "~/services/mytfo/types"
import {
  groupByInvestments,
  sortByNameAndTransformJson,
} from "~/utils/clientUtils/investmentUtilities"

export const totalInvestmentExcelUtil = async (
  dealsData: Deals,
  filterKeys: Array<string>,
  filterValues: Array<string>,
  orderBy: string,
) => {
  let investmentExcelArray = [] as InvestmentOrPortfolioSummaryExcelArray

  const dealsResult = (await groupByInvestments(
    dealsData,
    orderBy,
    "asc",
    filterKeys,
    filterValues,
  )) as DealsType[][]

  const investmentRes = sortByNameAndTransformJson(dealsResult, "asc", orderBy)

  investmentRes.filteredDeals.forEach((investmentFilterItem) => {
    investmentFilterItem.deals.forEach((deal) => {
      investmentExcelArray.push({
        "Investment Name": deal.investmentVehicle,
        "Deal Name": deal.name,
        SPV: deal.investmentVehicle,
        "Investment Date": moment(deal.initialInvestmentDate).format(
          "DD/MM/YYYY",
        ),
        "Investment Amount": deal.bookValue,
        "Market Value": deal.marketValue,
        "Performance Contribution": deal.performance.percent,
      })
    })
  })

  return investmentExcelArray
}
