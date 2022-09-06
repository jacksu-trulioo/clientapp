import {
  PerformanceQuarterDealsRoot,
  QuarterDeals,
} from "~/services/mytfo/types"

export const getTopDeals = async (
  data: PerformanceQuarterDealsRoot["deals"],
) => {
  let finalData = await Promise.all(
    data.map((item) => ({
      id: item.id,
      name: item.name,
      performanceObj: item.performance,
    })),
  )
  const sortedData = await sortData(finalData)
  return sortedData as QuarterDeals["deals"]
}
export const sortData = async (data: QuarterDeals["deals"]) => {
  return data.sort((a, b) => {
    return (
      Math.abs(b.performanceObj.percent) - Math.abs(a.performanceObj.percent)
    )
  })
}
