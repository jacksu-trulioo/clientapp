import moment from "moment"

import {
  finalPortfolioActivity,
  finalPortfolioActivityRes,
  PAMicroServiceDataType,
  PAMicroServiceType,
  PortfolioActivityDealList,
  PortfolioActivityGroupByType,
} from "~/services/mytfo/clientTypes"

export const getPortfolioAcitivities = (data: PAMicroServiceType | []) => {
  let result = groupByWithKey(data as [], "activityDate") as Array<
    Array<PAMicroServiceDataType>
  >

  let finalArr: finalPortfolioActivityRes = []
  for (const element of result) {
    let obj: finalPortfolioActivity = {}
    let currentMonth = moment().month()
    let previousMonth = moment().month() - 1
    let portfolioActivityMonth = moment(element[0].activityDate).month()
    if ([currentMonth, previousMonth].includes(portfolioActivityMonth)) {
      obj.date = moment(element[0].activityDate).format("YYYY-MM-DD")

      let res = element.filter((item) => item.acitivityType == "Distribution")
      let dist = mappingDataWithType(res)
      obj.distributions = dist

      let res1 = element.filter((item) => item.acitivityType == "Capital Call")
      let capCall = mappingDataWithType(res1)
      obj.capitalCalls = capCall

      let res2 = element.filter((item) => item.acitivityType == "Exit")
      let exit = mappingDataWithType(res2)
      obj.exits = exit

      obj.numberOfEvents = dist.length + capCall.length + exit.length

      if (obj.numberOfEvents !== 0) {
        finalArr.push(obj)
      }
    }
  }

  finalArr.sort((a, b) => {
    let date1 = new Date(a.date as string)
    let date2 = new Date(b.date as string)
    return date1.getTime() - date2.getTime()
  })

  return finalArr
}

export const groupByWithKey = (data: [], groupByKey: string) => {
  const map = new Map(Array.from(data, (obj) => [obj[groupByKey], []]))
  data.forEach((obj) => map.get(obj[groupByKey])?.push(obj))
  let groupByKeyFinalArr: PortfolioActivityGroupByType = Array.from(
    map.values(),
  )
  return groupByKeyFinalArr
}

export const mappingDataWithType = (_res: PAMicroServiceDataType[]) => {
  return _res.map((item) => {
    let innerObj: PortfolioActivityDealList = {}
    innerObj.dealName = item.dealName
    innerObj.amount = item.amount
    return innerObj
  })
}
