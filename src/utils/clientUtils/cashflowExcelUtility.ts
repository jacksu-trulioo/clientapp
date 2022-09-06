import moment from "moment"

import {
  CashflowExcelArray,
  DealDistributionTypes,
} from "~/services/mytfo/clientTypes"
import { getQuarterDistDetails } from "~/utils/clientUtils/getDealDistributionDetails"

export const cashflowExcelUtil = async (
  dealDistributionData: DealDistributionTypes,
) => {
  let cashflowExcelArray = [] as CashflowExcelArray

  let dealDistributationDetailsResponse: DealDistributionTypes =
    getQuarterDistDetails(dealDistributionData, "asc")

  dealDistributationDetailsResponse.distributionPerTimePeriod.forEach(
    (distributionData) => {
      distributionData.spvList.forEach((spvData) => {
        spvData.dealsData.forEach((spvsDeals) => {
          cashflowExcelArray.push({
            Deal: spvsDeals.dealName,
            SPV: spvData.spvName,
            "Distribution Date": moment(spvsDeals.distributionDate).format(
              "DD/MM/YYYY",
            ),
            Type: spvsDeals.type,
            Amount: spvsDeals.amount,
            Quarter: distributionData.timeperiod.quarter,
          })
        })
      })
    },
  )

  return cashflowExcelArray
}
