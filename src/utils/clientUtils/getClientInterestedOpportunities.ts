import {
  InterestedOpportunitiesProps,
  OpportunitiesProps,
} from "~/services/mytfo/clientTypes"
import {
  clientOpportunities,
  clientOpportunitiesArray,
} from "~/services/mytfo/types"

import DealImages from "./DealImages"

type itemObj = {
  item: clientOpportunities
  obj?: {
    opportunityId: number
    oppImageSmall: string
    oppImageLarge: string
  }
}

export const getInterestedOpp = (
  data: clientOpportunitiesArray,
  langCode: string,
) => {
  let finalData = data.filter((obj) => obj.isInterested === "Y")

  let res = finalData.map((item) => {
    const obj = DealImages.find((o) => o.opportunityId === item.opportunityId)
    return { item, obj }
  })

  let finalResArray: InterestedOpportunitiesProps["opportunities"] = []

  for (const element of res) {
    let finalObj: OpportunitiesProps = {
      opportunityId: element.item.opportunityId,
      opportunityName: element.item.opportunityName,
      about: "",
      expectedReturn: element.item.expectedReturn,
      expectedExitYear: element.item.expectedExitYear,
      assetClass: "",
      country: "",
      sector: element.item.sector,
      sponsor: element.item.sponsor,
      opportunityImageUrl:
        element.obj?.oppImageSmall ||
        "/images/opportunities/890/pending1800x520.jpg",
      countryImageUrl: element.item.countryImageUrl,
      isShariah: element.item.isShariah,
      isProgram: element.item.isProgram,
      isInvested: element.item.isInvested,
    }

    conditionalChecking(langCode, element, finalObj)

    finalResArray.push(finalObj)
  }

  return finalResArray
}

function conditionalChecking(
  lang: string,
  ele: itemObj,
  obj: OpportunitiesProps,
) {
  if (lang === "ar") {
    if (ele.item.countryAr) {
      obj.country = ele.item.countryAr
    } else {
      obj.country = ele.item.country
    }

    if (ele.item.assetClassAr) {
      obj.assetClass = ele.item.assetClassAr
    } else {
      obj.assetClass = ele.item.assetClass
    }

    if (ele.item.nativeDeal) {
      obj.about = ele.item.nativeDeal.aboutAr
    }
  } else {
    if (ele.item.nativeDeal) {
      obj.about = ele.item.nativeDeal.about
    }

    if (ele.item.country) {
      obj.country = ele.item.country
    }

    if (ele.item.assetClass) {
      obj.assetClass = ele.item.assetClass
    }
  }
}
