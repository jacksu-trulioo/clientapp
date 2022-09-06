import {
  clientOpportunities,
  clientOpportunitiesArray,
} from "../../services/mytfo/types"
import { filterByKeys } from "../../utils/clientUtils/globalUtilities"
import DealImages from "./DealImages"

export const sortandFilterData = async (
  data: [],
  filterKeys: [],
  filterValues: [],
  orderBy: string,
  sortBy: string,
  lang: string,
) => {
  try {
    let filteredData: clientOpportunitiesArray = await filterByKeys(
      data,
      filterKeys,
      filterValues,
    )
    let structuredData = (await getStructuredData(filteredData, lang)) as []

    return await sortData(orderBy, sortBy, structuredData)
  } catch (error) {
    return error
  }
}

const GetSortOrderAsc = (prop: string) => {
  return function (a: clientOpportunities, b: clientOpportunities) {
    if (
      a[prop as keyof clientOpportunities] >
      b[prop as keyof clientOpportunities]
    ) {
      return 1
    } else if (
      a[prop as keyof clientOpportunities] <
      b[prop as keyof clientOpportunities]
    ) {
      return -1
    }
    return 0
  }
}

const GetSortOrderDesc = (prop: string) => {
  return function (a: clientOpportunities, b: clientOpportunities) {
    if (
      a[prop as keyof clientOpportunities] >
      b[prop as keyof clientOpportunities]
    ) {
      return -1
    } else if (
      a[prop as keyof clientOpportunities] <
      b[prop as keyof clientOpportunities]
    ) {
      return 1
    }
    return 0
  }
}

const getStructuredData = async (
  data: clientOpportunitiesArray,
  lang: string,
) => {
  let structuredData = []
  structuredData = await Promise.all(
    data.map(function (item) {
      return {
        opportunityId: item.opportunityId,
        opportunityName: item.opportunityName,
        about:
          lang === "en" ? item.nativeDeal?.about : item.nativeDeal?.aboutAr,
        expectedReturn: item?.expectedReturn,
        expectedExitYear: item?.expectedExitYear,
        assetClass: lang === "en" ? item?.assetClass : item?.assetClassAr,
        country: lang == "en" ? item?.country : item?.countryAr,
        sector: lang == "en" ? item?.sector : item?.sectorAr,
        sponsor: item?.sponsor,
        opportunityImageUrl:
          DealImages.find(
            (element: { opportunityId: number }) =>
              element.opportunityId == item.opportunityId,
          )?.oppImageSmall || "/images/opportunities/890/pending1800x520.jpg",
        countryImageUrl: item?.countryImageUrl,
        isShariah: item?.isShariah,
        isProgram: item?.isProgram,
        isInvested: item?.isInvested,
      }
    }),
  )
  return structuredData
}

const sortData = async (
  orderBy: string,
  sortBy: string,
  structuredData: [],
) => {
  if (sortBy == "recency" && orderBy == "asc") {
    return structuredData
  } else if (sortBy == "recency" && orderBy == "desc") {
    return structuredData.reverse()
  } else if (sortBy == "alphabetically") {
    return structuredData?.sort(
      orderBy == "asc"
        ? GetSortOrderAsc("opportunityName")
        : GetSortOrderDesc("opportunityName"),
    )
  }
}
export const getUniqueFilterValues = async (data: clientOpportunitiesArray) => {
  try {
    return {
      sponsor: [
        ...new Map(data.map((item) => [item["sponsor"], item])).values(),
      ].map((element) => {
        return { sponsor: element.sponsor }
      }),
      assetClass: [
        ...new Map(data.map((item) => [item["assetClass"], item])).values(),
      ].map((element) => {
        return {
          assetClass: element.assetClass,
          assetClassAr: element.assetClassAr,
        }
      }),
      sector: [
        ...new Map(data.map((item) => [item["sector"], item])).values(),
      ].map((element) => {
        return { sector: element.sector, sectorAr: element.sectorAr }
      }),
    }
  } catch (error) {
    return error
  }
}
