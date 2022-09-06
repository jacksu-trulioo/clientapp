import getT from "next-translate/getT"

import {
  PerformanceDataForPeriods,
  PerformanceDetails,
} from "~/services/mytfo/types"

export const getPerformanceData = async (
  performanceDetailsData: PerformanceDetails,
  langCode: string,
) => {
  try {
    let structuredPerformanceDetailsData = []
    structuredPerformanceDetailsData = await Promise.all(
      performanceDetailsData.dataForPeriods.map(async function (obj) {
        let overallPerformanceChartValues =
          await getOverallPerformanceChartData(obj, langCode)
        return {
          quarter: obj.timeperiod.quarter ? obj.timeperiod.quarter : "ITD",
          year: obj.timeperiod.year,
          detailedPerformance: {
            valueStart: obj.valueStart,
            valueEnd: obj.valueEnd,
            itdAnnualizedPercent: obj.itdAnnualizedPercent,
            itdAnnualizedPercentPerAnnum: obj.itdAnnualizedPercentPerAnnum,
            netChangeValue: obj.netChangeValue,
            netChangePercent: obj.netChangePercent,
            liquidValue: obj.liquidValue,
            liquidValuePerAnnum: obj.liquidValuePerAnnum,
            illiquidValue: obj.illiquidValue,
            illiquidValuePerAnnum: obj.illiquidValuePerAnnum,
            illiquidVintage: obj.illiquidVintage,
            illiquidVintagePerAnnum: obj.illiquidVintagePerAnnum,
            sharpeRatio: obj.sharpeRatio,
            riskVolatility: obj.riskVolatility,
            annualizedPerformance: obj.annualizedPerformance,
            additions: obj.additions,
          },
          monthlyPerformance: obj.periodicPerformance,
          performanceChartData: overallPerformanceChartValues,
        }
      }),
    )

    return structuredPerformanceDetailsData
  } catch (error) {
    return error
  }
}
async function getOverallPerformanceChartData(
  obj: PerformanceDataForPeriods,
  langCode: string,
) {
  const t = await getT(langCode, "common")
  const cumulativeArray: number[] = []
  const periodicArray: number[] = []
  const monthsArray: string[] = []
  Promise.all(
    obj.chartPerformance.cumulativeChanges.map((item, index) => {
      if (obj.timeperiod?.toDate !== undefined) {
        cumulativeArray.push(item.change)
      } else if (index % 2 === 0) {
        cumulativeArray.push(item.change)
      }
    }),
  )
  Promise.all(
    obj.chartPerformance.percentChanges.map((item) => {
      if (obj.timeperiod.toDate !== undefined) {
        periodicArray.push(item.change)
        monthsArray.push(item.timeperiod.year.toString())
      } else {
        periodicArray.push(item.change)
        let month = t(
          `client.monthsLabel.month_${item.timeperiod.month}_short_text`,
        )
        monthsArray.push(month)
      }
    }),
  )

  return {
    cumulativeData: cumulativeArray,
    periodicData: periodicArray,
    months: monthsArray,
    minMaxValue: findMaxMinValue(cumulativeArray, periodicArray),
  }
}

const findMaxMinValue = (cumulativeData: number[], periodicData: number[]) => {
  let yMax = 10
  let yMin = -10

  let cumulativeMax = cumulativeData.reduce(function (a, b) {
    return Math.max(Math.abs(a), Math.abs(b))
  })
  let periodicMax = periodicData.reduce(function (a, b) {
    return Math.max(Math.abs(a), Math.abs(b))
  })

  yMax = cumulativeMax > periodicMax ? cumulativeMax : periodicMax
  yMin = -1 * yMax
  return { max: yMax + 0, min: yMin - 0 } // to +2 & -2display the extended axis point
}
