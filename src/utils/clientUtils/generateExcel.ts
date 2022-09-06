import XLSX from "xlsx"

import {
  CashflowExcelArray,
  CommitmentExcelArray,
  InvestmentListingExcelArray,
  InvestmentOrPortfolioSummaryExcelArray,
  PerformanceExcelArray,
  ProfitLossExcelArray,
} from "~/services/mytfo/clientTypes"

export const generateExcelWithJsonData = (
  data:
    | PerformanceExcelArray
    | InvestmentOrPortfolioSummaryExcelArray
    | InvestmentListingExcelArray
    | ProfitLossExcelArray
    | CommitmentExcelArray
    | CashflowExcelArray,
  fileName: string,
) => {
  const worksheet = XLSX.utils.json_to_sheet(data)

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")

  worksheet["!cols"] = [
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
  ]

  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}
