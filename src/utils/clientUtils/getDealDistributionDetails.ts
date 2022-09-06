import {
  DealDistributionTypes,
  DistributionPerTimePeriod,
} from "~/services/mytfo/clientTypes"
import { roundCurrencyValue } from "~/utils/clientUtils/globalUtilities"

export const getQuarterDistDetails = (
  distributionDetails: DealDistributionTypes,
  orderBy: string,
) => {
  let yearsList = [] as Array<number>

  let mapDistributionWithoutItd = [] as Array<DistributionPerTimePeriod>

  distributionDetails.distributionPerTimePeriod.forEach((val) => {
    if (String(val.timeperiod.quarter).length === 1) {
      mapDistributionWithoutItd.push(val)
      yearsList.push(val.timeperiod.year)
    }
  })

  return {
    year: Math.max.apply(null, yearsList),

    ytdDistributionProjection: roundCurrencyValue(
      Number(distributionDetails.ytdDistributionProjection),
    ),
    itdDistributionProjection: roundCurrencyValue(
      Number(distributionDetails.itdDistributionProjection),
    ),
    ytdCapitalCallProjection: roundCurrencyValue(
      Number(distributionDetails.ytdCapitalCallProjection),
    ),
    itdCapitalCallProjection: roundCurrencyValue(
      Number(distributionDetails.itdCapitalCallProjection),
    ),
    yearFrom: Math.min.apply(null, yearsList),
    yearTo: Math.max.apply(null, yearsList),
    distributionPerTimePeriod: orderBySorting(
      mapDistributionWithoutItd,
      orderBy,
    ),
  }
}

function orderBySorting(data: Array<DistributionPerTimePeriod>, order: string) {
  return data.sort(function (a, b) {
    if (order === "desc") {
      return (
        b.timeperiod.year - a.timeperiod.year ||
        (b.timeperiod.quarter as number) - (a.timeperiod.quarter as number)
      )
    } else {
      return (
        a.timeperiod.year - b.timeperiod.year ||
        (a.timeperiod.quarter as number) - (b.timeperiod.quarter as number)
      )
    }
  })
}
