import getT from "next-translate/getT"

import { SummaryAllocationType } from "~/services/mytfo/types"

export const getSummaryPortfolioAllocation = async (
  response: {
    timePeriods: [
      {
        deals: []
        holdings: { percentages: [{ percent: number; type: string }] }
      },
    ]
  },
  langCode: string,
) => {
  const t = await getT(langCode, "common")

  const pieChartColorArry = [
    "#B4985F",
    "#AED1DA",
    "#738995",
    "#624D70",
    "#6FA485",
    "#E2F1F5",
    "#9DCE62",
    "#4B5473",
    "#554712",
  ]
  const pieChartSeq = [
    "privateEquity",
    "cash",
    "otherIlliquid",
    "yielding",
    "alt",
    "realEstate",
    "fixedIncome",
    "equities",
    "others",
  ]

  let allocationChartData = pieChartSeq.map((legend, index) => {
    let data = response?.timePeriods[0].holdings.percentages.filter(
      ({ type }) => {
        return type == legend
      },
    )

    if (data.length > 0) {
      return {
        name: t(`client.assetClasses.${legend}`),
        value: data[0].percent,
        color: pieChartColorArry[index],
      }
    } else {
      return {
        name: t(`client.assetClasses.${legend}`),
        value: 0,
        color: pieChartColorArry[index],
      }
    }
  })

  let assetTableData = response.timePeriods[0].deals

  let result: SummaryAllocationType[] = []

  if (assetTableData.length > 0) {
    result = [
      ...assetTableData
        .reduce((acc, { type, ...rest }: { type: string }) => {
          const group = acc.get(type)
          group
            ? group.data.push(rest)
            : acc.set(type, {
                type,
                data: [rest],
                color:
                  pieChartColorArry[
                    pieChartSeq.findIndex((x) => {
                      return type == x
                    })
                  ],
              })
          return acc
        }, new Map())
        .values(),
    ]
  }

  return {
    allocationChartData: allocationChartData,
    assetTableData: result,
  }
}
