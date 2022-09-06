import {
  Deal,
  DealDetails,
  DealsType,
  DealsTypeArray,
  GroupByDeal,
  Investment,
  TimePeriods,
} from "~/services/mytfo/clientTypes"
import { Deals } from "~/services/mytfo/types"
import { chartColors } from "~/styles/foundations/colors"
import { filterByKeys } from "~/utils/clientUtils/globalUtilities"

export const getTotalInvestmentChartSeries = async (
  data: Deals,
  langCode: string,
) => {
  let uniqueSector = Array.from(
    new Set(
      data.timePeriods[0].deals.map((result) => result.industry[0].value),
    ),
  )
  return uniqueSector.map((sector, index) => {
    let getAllSameSector = data.timePeriods[0].deals.filter((x) => {
      return x.industry[0].value == sector
    })
    return {
      name: langCode.includes("en")
        ? getAllSameSector[0].industry[0].value
        : getAllSameSector[0].industry[1].value,
      value: (100 * getAllSameSector.length) / data.timePeriods[0].deals.length,
      color: chartColors[index],
    }
  })
}

export const groupByInvestments = async (
  data: Deals,
  sortBy: string,
  orderBy: string,
  filterKeys: string[],
  filterValues: string[],
) => {
  let combineData = data.timePeriods.reduce((a: DealsTypeArray, b) => {
    a.push(...(b.deals as DealsTypeArray))
    return a
  }, [])
  combineData = uniqueArray(combineData)

  let result: DealsTypeArray = await filterByKeys(
    combineData as [],
    filterKeys,
    filterValues,
  )

  let sortArray = [...result]?.sort(
    orderBy == "asc" ? GetSortOrderAsc(sortBy) : GetSortOrderDesc(sortBy),
  )
  return groupInvestments(sortArray as [], sortBy)
}

const uniqueArray = (data: DealsTypeArray) =>
  data.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)

const groupInvestments = (data: [], sortBy: string) => {
  const map = new Map(Array.from(data, (obj) => [obj[sortBy], []]))
  data.forEach((obj) => {
    map.get(obj[sortBy])?.push(obj)
  })
  return Array.from(map.values())
}

export const groupInvestmentListing = async (
  data: Deals,
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
  const finalArray: GroupByDeal[] = []
  data.timePeriods.forEach((item: TimePeriods) => {
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
  for (const item of finalArray) {
    item.deals.sort(
      orderBy == "asc"
        ? GetSortOrderAscForInvtListing(sortBy)
        : GetSortOrderDescForInvtListing(sortBy),
    )
  }
  return finalArray
}

export const GetSortOrderDesc = (prop: string) => {
  return function (a: DealsType, b: DealsType) {
    let value = a[prop as keyof DealsType] as string
    let prevValue = b[prop as keyof DealsType] as string
    if (value.toLowerCase() > prevValue.toLowerCase()) {
      return -1
    } else if (value.toLowerCase() < prevValue.toLowerCase()) {
      return 1
    }
    return 0
  }
}

export const GetSortOrderAsc = (prop: string) => {
  return function (a: DealsType, b: DealsType) {
    let value = a[prop as keyof DealsType] as string
    let prevValue = b[prop as keyof DealsType] as string
    if (value.toLowerCase() > prevValue.toLowerCase()) {
      return 1
    } else if (value.toLowerCase() < prevValue.toLowerCase()) {
      return -1
    }
    return 0
  }
}

export const GetSortOrderAscForInvtListing = (prop: string) => {
  return function (a: Deal, b: Deal) {
    let value = a[prop as keyof Deal] as string
    let prevValue = b[prop as keyof Deal] as string
    if (value.toLowerCase() > prevValue.toLowerCase()) {
      return 1
    } else if (value.toLowerCase() < prevValue.toLowerCase()) {
      return -1
    }
    return 0
  }
}

export const GetSortOrderDescForInvtListing = (prop: string) => {
  return function (a: Deal, b: Deal) {
    let value = a[prop as keyof Deal] as string
    let prevValue = b[prop as keyof Deal] as string
    if (value.toLocaleLowerCase() > prevValue.toLocaleLowerCase()) {
      return -1
    } else if (value.toLocaleLowerCase() < prevValue.toLocaleLowerCase()) {
      return 1
    }
    return 0
  }
}

export const BasicInfo = (
  dealDetails: DealDetails,
  deals: Deals,
  dealId: string,
) => {
  let dealName: string = "",
    initialInvestmentDate: string = "",
    priceDate: string = "",
    sponsorOrPartner: string = "",
    strategy: string = ""
  let brochure = {
    address: "",
    description: "",
    largeImageURL: "",
    smallImage1URL: "",
    smallImage2URL: "",
  }
  for (const element of dealDetails.periods) {
    let result = deals.timePeriods.filter(
      (item) =>
        item.timeperiod.quarter == element.timeperiod.quarter &&
        item.timeperiod.year == element.timeperiod.year,
    )
    let deal = result[0].deals.filter(
      (item: { id: string | number }) => item.id == dealId,
    )
    console.log(deal, "DEAL")
    if (deal.length > 0) {
      element.holdingPeriod = deal[0].holdingPeriod
      dealName = deal[0].name
      initialInvestmentDate = deal[0].initialInvestmentDate
      priceDate = deal[0].priceDate
      sponsorOrPartner = deal[0].sponsorOrPartner
      strategy = deal[0].strategy
      brochure = deal[0].brochure
    } else {
      element.holdingPeriod = 0
    }
  }
  for (const element of dealDetails.periods) {
    element.name = dealName
    element.initialInvestmentDate = initialInvestmentDate
    element.priceDate = priceDate
    element.sponsorOrPartner = sponsorOrPartner
    element.strategy = strategy
    element.brochure = brochure
  }
  return dealDetails
}

export const TranformJson = (dealsResult: GroupByDeal[], orderBy: string) => {
  for (const element of dealsResult) {
    for (const element1 of element.deals) {
      element1.investments.sort(
        orderBy == "asc" ? GetSortOrderAsc("name") : GetSortOrderDesc("name"),
      )
    }
  }
  return dealsResult[0].deals.map(({ investmentVehicle }) => {
    return investmentVehicle
  })
}

export const sortByNameAndTransformJson = (
  dealsResult: DealsType[][],
  orderBy: string,
  sortBy: string,
) => {
  for (const element of dealsResult) {
    element.sort(
      orderBy == "asc" ? GetSortOrderAsc("name") : GetSortOrderDesc("name"),
    )
  }
  let filteredDeals: Investment[] = []
  let sliceResult: DealsType[] = []
  let investmentVehicleList: string[] = []
  for (const element of dealsResult) {
    if (element.length > 3) {
      sliceResult = element.slice(0, 3)
    } else {
      sliceResult = element
    }
    if (sortBy == "investmentVehicle") {
      let obj = {
        investmentVehicle: sliceResult[0].investmentVehicle,
        region: "",
        deals: sliceResult,
      }
      filteredDeals.push(obj)
      investmentVehicleList.push(obj.investmentVehicle)
    } else {
      let objRegion = {
        investmentVehicle: "",
        region: sliceResult[0].region,
        deals: sliceResult,
      }
      filteredDeals.push(objRegion)
    }
  }
  return {
    filteredDeals: filteredDeals,
    investmentVehicleList: investmentVehicleList,
  }
}
