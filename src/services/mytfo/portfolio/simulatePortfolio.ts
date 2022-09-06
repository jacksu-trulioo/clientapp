import ky from "ky"

import {
  SimulatedPortfolio,
  SimulatePortfolioInput,
} from "~/services/mytfo/types"

const simulatePortfolio = async (
  httpClient: typeof ky,
  params: SimulatePortfolioInput,
) => {
  return httpClient
    .post("portfolio/simulator", {
      json: params,
    })
    .json<SimulatedPortfolio>()
}

export default simulatePortfolio
