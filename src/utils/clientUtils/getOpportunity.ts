import { opportunityDetails } from "../../services/mytfo/clientTypes"
import {
  clientOpportunities,
  clientOpportunitiesArray,
} from "../../services/mytfo/types"
import DealImages from "./DealImages"

export const getOpportunitybyId = async (
  data: clientOpportunitiesArray,
  opportunityId: number,
  lang: string,
) => {
  try {
    let structuredData: opportunityDetails = []
    await Promise.all(
      data.filter(async function (obj) {
        if (obj.opportunityId === Number(opportunityId)) {
          let opportunityVideoUrl = await getVideoUrl(obj)
          structuredData.push({
            opportunityId: obj.opportunityId,
            clientOpportunityId: obj.clientOpportunityId,
            opportunityName: obj.opportunityName,
            about:
              lang === "en" ? obj.nativeDeal?.about : obj.nativeDeal?.aboutAr,
            expectedReturn: obj?.expectedReturn,
            expectedExitYear: obj?.expectedExitYear,
            assetClass: lang === "en" ? obj?.assetClass : obj?.assetClassAr,
            country: lang == "en" ? obj?.country : obj?.countryAr,
            sector: lang == "en" ? obj?.sector : obj?.sectorAr,
            sponsor: obj?.sponsor,
            opportunityImageUrl:
              (DealImages.find(
                (element: { opportunityId: number }) =>
                  element.opportunityId == obj.opportunityId,
              )?.oppImageLarge as string) ||
              "/images/opportunities/1800/pending_11800x544.jpg",
            countryImageUrl: obj?.countryImageUrl,
            isShariah: obj?.isShariah,
            isProgram: obj?.isProgram,
            info: await getInfo(obj, lang),
            message:
              lang == "en"
                ? obj?.nativeDeal?.message
                : obj?.nativeDeal?.messageAr,
            disclaimer:
              lang == "en"
                ? obj?.nativeDeal?.disclaimer
                : obj?.nativeDeal?.disclaimerAr,
            opportunityVideoUrl:
              lang == "en"
                ? opportunityVideoUrl?.url
                : opportunityVideoUrl?.url_ar,
            isInterested: obj.isInterested,
            isScheduled: obj.isScheduled,
            isSeen: obj.isSeen,
            isAddedToCart: obj.isAddedToCart,
            isInvested: obj.isInvested,
          })
        }
      }),
    )
    return structuredData[0]
  } catch (error) {
    return error
  }
}

const getInfo = async (obj: clientOpportunities, lang: string) => {
  return obj?.nativeDeal?.info?.map(function (item) {
    return {
      title: lang == "en" ? item.title : item.titleAr,
      text: item.text?.map(function (text) {
        return {
          value: lang == "en" ? text.value : text.valueAr,
        }
      }),
    }
  })
}
const getVideoUrl = async (obj: clientOpportunities) => {
  return obj?.media?.filter((media) => media.type == "VIDEO")[0]
}
