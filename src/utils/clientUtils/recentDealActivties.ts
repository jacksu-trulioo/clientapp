import { addDays, format, sub } from "date-fns"

import {
  AccountSummaries,
  Deals,
  DistributionCapital,
  RecentDealActivities,
} from "~/services/mytfo/types"

async function getRecentActivitiesData(
  distributionCapital: DistributionCapital,
  accountSummary: AccountSummaries,
  deals: Deals,
  month: number,
): Promise<RecentDealActivities> {
  let startDate = await substractMonths(
    accountSummary?.lastValuationDate as string,
    month,
  )

  startDate = format(addDays(new Date(startDate as string), 1), "yyyy-MM-dd")

  let endDate = format(
    new Date(accountSummary?.lastValuationDate as string),
    "yyyy-MM-dd",
  )

  let distributions = await getDistributions(
    distributionCapital,
    startDate,
    endDate,
  )
  let recentDealData = deals?.timePeriods[0]?.deals.filter((a) => {
    let date = format(new Date(a.initialInvestmentDate), "yyyy-MM-dd")
    return date > startDate! && date <= endDate && a.strategy == "illiquid"
  })
  let investedMoney = 0
  let totalDeals = 0
  if (recentDealData.length == 0) {
    totalDeals = 0
    investedMoney = 0
  } else {
    totalDeals = recentDealData.length
    recentDealData.forEach((x: { marketValue: number }) => {
      investedMoney = investedMoney + x.marketValue
    })
  }
  return [
    {
      month,
      recentFunding: totalDeals,
      moneyInvested: investedMoney,
      distribution: {
        capitalGain: distributions.capitalGain,
        incomeDistribution: distributions.incomeDistribution,
      },
    },
  ]
}

async function substractMonths(
  lastValuationDate: string | number | Date,
  months: number,
): Promise<string | undefined> {
  try {
    return format(
      sub(new Date(lastValuationDate), {
        months: months,
      }),
      "yyyy-MM-dd",
    )
  } catch (error) {}
}

async function getDistributions(
  distributionCapital: DistributionCapital,
  startDate: string,
  endDate: string,
) {
  let capitalGain = 0
  let incomeDistribution = 0
  let result = distributionCapital.filter((a) => {
    let date = format(new Date(a.distributionDate), "yyyy-MM-dd")
    return date > startDate && date <= endDate
  })
  await Promise.all(
    result.map((x) => {
      capitalGain = capitalGain + x.capitalGain
      incomeDistribution = incomeDistribution + x.incomeDistribution
    }),
  )
  return {
    capitalGain,
    incomeDistribution,
  }
}

export const getStructuredRecentDealActivityJSON = async (
  distributionCapital: DistributionCapital,
  accountSummary: AccountSummaries,
  deals: Deals,
) => {
  const Last3MonthsData = await getRecentActivitiesData(
    distributionCapital,
    accountSummary,
    deals,
    3,
  )
  const Last6MonthsData = await getRecentActivitiesData(
    distributionCapital,
    accountSummary,
    deals,
    6,
  )
  let recentctivitiesData = Last3MonthsData.concat(Last6MonthsData)

  return recentctivitiesData
}
