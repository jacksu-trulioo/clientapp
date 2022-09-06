import {
  PerformanceExcelArray,
  structuredPerformanceDetailsData,
} from "~/services/mytfo/clientTypes"
import { PerformanceDetails } from "~/services/mytfo/types"
import { getShortMonth } from "~/utils/clientUtils/dateUtility"
import { getPerformanceData } from "~/utils/clientUtils/detailedPerformance"

export const performanceExcelUtil = async (
  performanceData: PerformanceDetails,
  langCode: string,
  quarter: string | number,
) => {
  let performanceExcelArray = [] as PerformanceExcelArray

  let filteredPerformanceData = (await getPerformanceData(
    performanceData,
    langCode,
  )) as structuredPerformanceDetailsData

  let filteredQuarterPerformance = filteredPerformanceData.filter(
    (filterPerformanceData) => filterPerformanceData.quarter === quarter,
  )

  filteredQuarterPerformance.forEach((quarterPerformanceData) => {
    quarterPerformanceData.monthlyPerformance.forEach((monthlyPerformance) => {
      performanceExcelArray.push({
        "Period Performance": monthlyPerformance?.period?.month
          ? `${getShortMonth(monthlyPerformance?.period?.month)}-${
              monthlyPerformance.period.year
            }`
          : monthlyPerformance.period.year,
        "Net Change": monthlyPerformance.netChange,
        "Additions Or Withdrawels": monthlyPerformance.additionsOrWithdrawels,
        Performance: monthlyPerformance.performance,
        "Cumulative Performance Percent (%)":
          monthlyPerformance.cumulativePerformancePercent,
        "Cumulative Performance Value":
          monthlyPerformance.cumulativePerformanceValue,
      })
    })
  })

  return performanceExcelArray
}
