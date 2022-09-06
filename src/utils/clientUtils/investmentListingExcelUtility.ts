import { InvestmentListingExcelArray } from "~/services/mytfo/clientTypes"
import { Deals } from "~/services/mytfo/types"
import { groupInvestmentListing } from "~/utils/clientUtils/investmentUtilities"

export const investmentListingExcelUtil = async (
  dealsData: Deals,
  filterKeys: Array<string>,
  filterValues: Array<string>,
  quarter: string | number,
  orderBy: string,
) => {
  let investmentListingExcelArray = [] as InvestmentListingExcelArray

  const dealsResult = await groupInvestmentListing(
    dealsData,
    orderBy,
    "asc",
    filterKeys,
    filterValues,
  )

  let quarterDeals = dealsResult.filter(
    (deal) => deal.timeperiod.quarter == quarter,
  )

  quarterDeals.forEach((quarterDeal) => {
    quarterDeal.deals.forEach((deal) => {
      deal.investments.forEach((investmentDeal) => {
        investmentListingExcelArray.push({
          Fund: `${investmentDeal.investmentVehicle} Fund`,
          "Book Value": investmentDeal.bookValue,
          "Market Value": investmentDeal.marketValue,
          Distribution: investmentDeal.distributionAmount,
          Type: investmentDeal.investmentVehicle,
          Region: `${investmentDeal.region
            .charAt(0)
            .toUpperCase()}${investmentDeal.region
            .slice(1)
            .replace(/([a-z0-9])([A-Z])/g, "$1 $2")}`,
          Sector: investmentDeal.industry[0].value,
          "Holding Period": `${investmentDeal.holdingPeriod}-${
            investmentDeal.holdingPeriod >= 2 ? "Years" : "Year"
          }`,
          "As Of Quarter": `Q-${quarterDeal.timeperiod.quarter}-${quarterDeal.timeperiod.year}`,
        })
      })
    })
  })

  return investmentListingExcelArray
}
