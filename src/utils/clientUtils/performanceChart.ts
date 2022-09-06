import moment from "moment"
import getT from "next-translate/getT"

import {
  PerformanceCumulativeChange,
  PerformanceDataForPeriods,
  PerformancePercentChange,
} from "~/services/mytfo/types"

export type QtrArrayType = {
  timePeriod: {
    year: number
    quarter: number
  }
}

type PeroformanceChartType = {
  netChangePercent?: {
    percent?: string
    direction?: string
  }
  timeperiod: {
    quarter?: string
    year?: string
    toDate?: string
  }
  chartPerformance: {
    cumulativeChanges?: []
    percentChanges?: []
  }
}

function isYearNotUndefined(element: PerformanceDataForPeriods) {
  return element.timeperiod?.year !== undefined
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

export const getPerformanceChartJson = async (
  response: { dataForPeriods: [] },
  langCode: string,
) => {
  const t = await getT(langCode, "common")
  let qtrArray = response?.dataForPeriods.filter(isYearNotUndefined)

  let qtrDataIndex = qtrArray.findIndex(
    (item: QtrArrayType) =>
      item.timePeriod?.quarter === moment().quarter() &&
      item.timePeriod?.year === moment().year(),
  )

  if (qtrDataIndex === -1) {
    qtrDataIndex = qtrArray.length - 1
  }

  let itemData: PeroformanceChartType = qtrArray[qtrDataIndex]

  let netChangePercent = {
    percent: itemData.netChangePercent?.percent,
    direction: itemData.netChangePercent?.direction,
  }

  let timeperiod = {
    quarter: itemData.timeperiod?.quarter,
    year: itemData.timeperiod?.year,
  }

  let cumulativeArray = itemData.chartPerformance?.cumulativeChanges
  let periodicArray = itemData.chartPerformance?.percentChanges
  let ITDtimeline = itemData?.timeperiod

  let tempCumulativeArray: number[] = []
  let tempPeriodicArray: number[] = []
  let MonthArray: string[] = []

  cumulativeArray?.map((item: PerformanceCumulativeChange, index: number) => {
    if (ITDtimeline?.toDate !== undefined) {
      tempCumulativeArray.push(item.change)
    } else if (index % 2 === 0) {
      tempCumulativeArray.push(item.change)
    }
  })
  periodicArray?.map(async (item: PerformancePercentChange) => {
    if (ITDtimeline.toDate !== undefined) {
      tempPeriodicArray.push(item.change)
      MonthArray.push(item.timeperiod.year.toString())
    } else {
      tempPeriodicArray.push(item.change)
      let month = t(
        `client.monthsLabel.month_${item.timeperiod.month}_short_text`,
      )
      MonthArray.push(month)
    }
  })

  let minMax = findMaxMinValue(tempCumulativeArray, tempPeriodicArray)

  return {
    netChangePercent: netChangePercent,
    timeperiod: timeperiod,
    cumulativeData: tempCumulativeArray,
    periodicData: tempPeriodicArray,
    timeLine: MonthArray,
    minMax: minMax,
  }
}
