import moment from "moment"

import {
  DealDataType,
  DealsAllocationTypes,
  InvestmentOrPortfolioSummaryExcelArray,
} from "~/services/mytfo/clientTypes"
import { getSummaryPortfolioAllocation } from "~/utils/clientUtils/summaryPortfolioAllocation"

export const portfolioSummaryExcelUtil = async (
  dealsData: DealDataType,
  langCode: string,
) => {
  let portfolioSummaryExcelArray = [] as InvestmentOrPortfolioSummaryExcelArray

  let allocationData = (await getSummaryPortfolioAllocation(
    dealsData,
    langCode,
  )) as unknown as DealsAllocationTypes

  allocationData.assetTableData.forEach((assetTableData) => {
    assetTableData.data?.forEach((data) => {
      portfolioSummaryExcelArray.push({
        "Asset Class": `${assetTableData.type
          .charAt(0)
          .toUpperCase()}${assetTableData.type
          .slice(1)
          .replace(/([a-z0-9])([A-Z])/g, "$1 $2")}`,
        "Deal Name": data?.name,
        SPV: data?.investmentVehicle,
        "Investment Date": moment(data?.initialInvestmentDate).format(
          "DD/MM/YYYY",
        ),
        "Investment Amount": data?.bookValue,
        "Market Value": data?.marketValue,
        "Performance Contribution": data?.performance.percent,
      })
    })
  })

  return portfolioSummaryExcelArray
}
