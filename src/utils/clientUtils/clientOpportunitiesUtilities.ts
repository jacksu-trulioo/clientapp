import { OpportunitiesProps } from "~/services/mytfo/clientTypes"
import {
  clientOpportunities,
  clientOpportunitiesArray,
} from "~/services/mytfo/types"
import DealImages from "~/utils/clientUtils/DealImages"

export const TransformJson = (
  data: clientOpportunitiesArray,
  count: string | string[],
  lang: string | string[],
  id: string | string[],
) => {
  let opportunityArr: OpportunitiesProps[] = []
  for (const element of data) {
    let imageUrl: string = getImageUrl(element)
    let objOpp = setObject(element, lang, imageUrl)
    if (id) {
      if (element.opportunityId != Number(id)) {
        opportunityArr.push(objOpp)
      }
    } else {
      opportunityArr.push(objOpp)
    }
  }
  return count
    ? (opportunityArr?.slice(0, Number(count)) as [])
    : (opportunityArr as [])
}

const getImageUrl = (element: clientOpportunities) => {
  const obj = DealImages.find((o) => o.opportunityId === element.opportunityId)
  if (obj) {
    return obj?.oppImageSmall
  } else {
    return "/images/opportunities/890/pending1800x520.jpg"
  }
}

const setObject = (
  element: clientOpportunities,
  lang: string | string[],
  imageUrl: string,
) => {
  return {
    opportunityId: element.opportunityId,
    opportunityName: element.opportunityName,
    about: lang == "en" ? element.nativeDeal.about : element.nativeDeal.aboutAr,
    expectedReturn: element.expectedReturn,
    expectedExitYear: element.expectedExitYear,
    assetClass: lang == "en" ? element.assetClass : element.assetClassAr,
    country: lang == "en" ? element.country : element.countryAr,
    sector: lang == "en" ? element.sector : element.sectorAr,
    sponsor: element.sponsor,
    opportunityImageUrl: imageUrl,
    countryImageUrl: element.countryImageUrl,
    isShariah: element.isShariah,
    isProgram: element.isProgram,
    isInvested: element.isInvested,
  }
}
