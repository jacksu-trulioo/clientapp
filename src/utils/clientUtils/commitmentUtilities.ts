import { Deal, DealsType, GroupByDeal } from "~/services/mytfo/clientTypes"
import {
  CommitmentDeal,
  CommitmentDealsTimePeriod,
  CommitmentRelatedDeals,
} from "~/services/mytfo/types"

import { filterByKeys } from "./globalUtilities"

export const GetSortOrderDesc = (prop: string) => {
  return function (a: CommitmentDeal, b: CommitmentDeal) {
    if (a[prop as keyof CommitmentDeal] > b[prop as keyof CommitmentDeal]) {
      return -1
    } else if (
      a[prop as keyof CommitmentDeal] < b[prop as keyof CommitmentDeal]
    ) {
      return 1
    }
    return 0
  }
}

export const GetSortOrderAsc = (prop: string) => {
  return function (a: CommitmentDeal, b: CommitmentDeal) {
    if (a[prop as keyof CommitmentDeal] > b[prop as keyof CommitmentDeal]) {
      return 1
    } else if (
      a[prop as keyof CommitmentDeal] < b[prop as keyof CommitmentDeal]
    ) {
      return -1
    }
    return 0
  }
}

const groupInvestments = (data: [], sortBy: string) => {
  const map = new Map(Array.from(data, (obj) => [obj[sortBy], []]))
  data.forEach((obj) => {
    map.get(obj[sortBy])?.push(obj)
  })
  return Array.from(map.values())
}

export const groupCommitmentRelatedDeals = async (
  data: CommitmentRelatedDeals,
  sortBy: string,
  orderBy: string,
  filterKeys: string[],
  filterValues: string[],
) => {
  for (const element of data.timePeriods) {
    element.deals = await filterByKeys(
      element.deals as [],
      filterKeys,
      filterValues,
    )
  }

  data.timePeriods.forEach((item: CommitmentDealsTimePeriod) => {
    item.deals?.sort(
      orderBy == "asc" ? GetSortOrderAsc(sortBy) : GetSortOrderDesc(sortBy),
    )
  })

  const finalArray: GroupByDeal[] = []

  data.timePeriods.forEach((item: CommitmentDealsTimePeriod) => {
    let groupByDeals = groupInvestments(
      item.deals as [],
      sortBy,
    ) as DealsType[][]
    let filteredData: Deal[] = []
    for (const element of groupByDeals) {
      if (sortBy == "investmentVehicle") {
        let objGroup = {
          investmentVehicle: element[0].investmentVehicle,
          region: "",
          investments: element,
        }
        filteredData.push(objGroup)
      } else {
        let objGroup1 = {
          investmentVehicle: "",
          region: element[0].region,
          investments: element,
        }
        filteredData.push(objGroup1)
      }
    }
    let obj = {
      timeperiod: item.timeperiod,
      deals: filteredData,
    }
    finalArray.push(obj)
  })
  return finalArray
}
