import { rest } from "msw"

import siteConfig from "~/config"

const {
  api: { baseUrl },
} = siteConfig

function handler() {
  return rest.get(`${baseUrl}/user/proposals`, (req, res, ctx) => {
    const createProposal = () => [
      {
        type: "LongTerm",
        instanceId: "2369",
        expectedReturn: "0.1",
        expectedYield: "0.05904748261084255",
        forecastedVolatility: "0.1374",
        sharpeRatio: "0.4473651058571979",
        totalCommitted: "1312310",
        strategies: {
          capitalGrowth: {
            percentageAllocation: 0.06858125201933686,
            deploymentYears: [59997, 30000, 0],
          },
          capitalYielding: {
            percentageAllocation: 0.6324715464005511,
            deploymentYears: [553333, 276667, 0],
          },
          opportunistic: {
            percentageAllocation: 0.15,
            deploymentYears: [392312, 0, 0],
          },
          absoluteReturn: {
            percentageAllocation: 0.15,
            deploymentYears: [553333, 276667, 0],
          },
        },
        earnings: [
          {
            year: 2023,
            income: 41522,
            capital: 0,
            total: 41522,
            cumulativeDistribution: 41522,
            percentage: 3,
          },
          {
            year: 2024,
            income: 68497,
            capital: 0,
            total: 68497,
            cumulativeDistribution: 110019,
            percentage: 8,
          },
          {
            year: 2025,
            income: 77489,
            capital: 392312,
            total: 469801,
            cumulativeDistribution: 579820,
            percentage: 44,
          },
          {
            year: 2026,
            income: 53950,
            capital: 0,
            total: 53950,
            cumulativeDistribution: 633770,
            percentage: 48,
          },
          {
            year: 2027,
            income: 53950,
            capital: 663936,
            total: 717886,
            cumulativeDistribution: 1351656,
            percentage: 103,
          },
          {
            year: 2028,
            income: 17983,
            capital: 331968,
            total: 349951,
            cumulativeDistribution: 1701607,
            percentage: 130,
          },
          {
            year: 2029,
            income: 0,
            capital: 0,
            total: 0,
            cumulativeDistribution: 1701607,
            percentage: 130,
          },
          {
            year: 2030,
            income: 313391,
            capital: 1388216,
            total: 1701607,
            cumulativeDistribution: 3403214,
            percentage: 259,
          },
        ],
        graphData: [
          {
            name: "0",
            capitalGrowth: 59997,
            capitalYielding: 553333,
            opportunistic: 392312,
            absoluteReturn: 0,
          },
          {
            name: "1",
            capitalGrowth: 30000,
            capitalYielding: 276667,
            opportunistic: 0,
            absoluteReturn: 0,
          },
          {
            name: "2",
            capitalGrowth: 0,
            capitalYielding: 0,
            opportunistic: 0,
            absoluteReturn: 0,
          },
        ],
        transformedStrategiesData: [
          {
            years: [553333, 276667, 0],
            totalAmount: 830000,
            percentageAllocation: 0.6324715464005511,
            name: "Capital Yielding",
          },
          {
            years: [59997, 30000, 0],
            totalAmount: 89997,
            percentageAllocation: 0.06858125201933686,
            name: "Capital Growth",
          },
          {
            years: [392312, 0, 0],
            totalAmount: 392312,
            percentageAllocation: 0.29894720158011207,
            name: "Opportunistic",
          },
          {
            years: [],
            totalAmount: 0,
            percentageAllocation: 0,
            name: "Absolute return",
          },
          {
            name: "total",
            totalAmount: 1312309,
            percentageAllocation: 1,
            years: [1005642, 306667, 0],
          },
        ],
      },
      {
        type: "ShortTerm",
        instanceId: "2370",
        expectedReturn: "0.2",
        expectedYield: "0.05904748261084255",
        forecastedVolatility: "0.1374",
        sharpeRatio: "0.4473651058571979",
        totalCommitted: "1312310",
        strategies: {
          capitalGrowth: {
            percentageAllocation: 0.24,
            deploymentYears: [59997, 30000, 0],
          },
          capitalYielding: {
            percentageAllocation: 0.6324715464005511,
            deploymentYears: [553333, 276667, 0],
          },
          opportunistic: {
            percentageAllocation: 0.06858125201933686,
            deploymentYears: [392312, 0, 0],
          },
          absoluteReturn: {
            percentageAllocation: 0.05,
            deploymentYears: [],
          },
        },
        earnings: [
          {
            year: 2023,
            income: 41522,
            capital: 0,
            total: 41522,
            cumulativeDistribution: 41522,
            percentage: 3,
          },
          {
            year: 2024,
            income: 68497,
            capital: 0,
            total: 68497,
            cumulativeDistribution: 110019,
            percentage: 8,
          },
          {
            year: 2025,
            income: 77489,
            capital: 392312,
            total: 469801,
            cumulativeDistribution: 579820,
            percentage: 44,
          },
          {
            year: 2026,
            income: 53950,
            capital: 0,
            total: 53950,
            cumulativeDistribution: 633770,
            percentage: 48,
          },
          {
            year: 2027,
            income: 53950,
            capital: 663936,
            total: 717886,
            cumulativeDistribution: 1351656,
            percentage: 103,
          },
          {
            year: 2028,
            income: 17983,
            capital: 331968,
            total: 349951,
            cumulativeDistribution: 1701607,
            percentage: 130,
          },
          {
            year: 2029,
            income: 0,
            capital: 0,
            total: 0,
            cumulativeDistribution: 1701607,
            percentage: 130,
          },
          {
            year: 2030,
            income: 313391,
            capital: 1388216,
            total: 1701607,
            cumulativeDistribution: 3403214,
            percentage: 259,
          },
        ],
        graphData: [
          {
            name: "0",
            capitalGrowth: 59997,
            capitalYielding: 553333,
            opportunistic: 392312,
            absoluteReturn: 0,
          },
          {
            name: "1",
            capitalGrowth: 30000,
            capitalYielding: 276667,
            opportunistic: 0,
            absoluteReturn: 0,
          },
          {
            name: "2",
            capitalGrowth: 0,
            capitalYielding: 0,
            opportunistic: 0,
            absoluteReturn: 0,
          },
        ],
        transformedStrategiesData: [
          {
            years: [553333, 276667, 0],
            totalAmount: 830000,
            percentageAllocation: 0.6324715464005511,
            name: "Capital Yielding",
          },
          {
            years: [59997, 30000, 0],
            totalAmount: 89997,
            percentageAllocation: 0.06858125201933686,
            name: "Capital Growth",
          },
          {
            years: [392312, 0, 0],
            totalAmount: 392312,
            percentageAllocation: 0.29894720158011207,
            name: "Opportunistic",
          },
          {
            years: [],
            totalAmount: 0,
            percentageAllocation: 0,
            name: "Absolute return",
          },
          {
            name: "total",
            totalAmount: 1312309,
            percentageAllocation: 1,
            years: [1005642, 306667, 0],
          },
        ],
      },
    ]

    return res(ctx.json(createProposal()))
  })
}

export default handler()
