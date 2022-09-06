import faker from "faker"
import { rest } from "msw"

import siteConfig from "~/config"
import {
  SimulatedPortfolio,
  SimulatePortfolioInput,
} from "~/services/mytfo/types"

const {
  api: { baseUrl },
} = siteConfig

function handler() {
  return rest.post<SimulatePortfolioInput, SimulatedPortfolio>(
    `${baseUrl}/portfolio/simulator`,
    (req, res, ctx) => {
      const { timeHorizonInYears } = req.body

      return res(
        ctx.json({
          roi: faker.datatype.float({ max: 0.99, precision: 0.000001 }),
          averageIncome: faker.datatype.number({ min: 184000, max: 220000 }),
          allocations: [
            {
              categorization: "Capital Yielding",
              percentage: 0.55,
              spv: "Capital Yielding",
            },
            {
              categorization: "Capital Growth",
              percentage: 0.2,
              spv: "Capital Growth",
            },
            {
              categorization: "Opportunistic",
              percentage: 0.25,
              spv: "Sh. Global Credit Fund",
            },
          ],
          expectedReturn: faker.datatype.float({
            max: 0.09,
            precision: 0.000001,
          }),
          expectedYield: faker.datatype.float({
            max: 0.09,
            precision: 0.000001,
          }),
          // Add 1 year for initial 0th year returned by API.
          graphData: new Array(timeHorizonInYears + 1)
            .fill(0)
            .map((_, index) => ({
              initialInvestment: faker.datatype.number({
                min: 300000,
                max: 3000000,
              }),
              name: `Year ${index}`,
              portfolioValue: faker.datatype.number({
                min: 300000,
                max: 3000000,
              }),
              relativeReturn: faker.datatype.float({
                max: 0.9,
                precision: 0.01,
              }),
              totalValue: 500000,
              cumulativeYieldPaidOut: faker.datatype.number({
                min: 100000,
                max: 1000000,
              }),
            })),
          projectedValue: faker.datatype.number({
            min: 500000,
            max: 3000000,
          }),
          quarterlyLiquidity: faker.datatype.float({
            max: 0.9,
            precision: 0.01,
          }),
        }),
      )
    },
  )
}

export default handler()
