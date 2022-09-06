import ky from "ky"

import { SimulatePortfolioInput } from "~/services/mytfo/types"

const updateSimulatorInfo = async (
  httpClient: typeof ky,
  params: SimulatePortfolioInput,
) => {
  return httpClient
    .post("user/update-simulator-info", {
      json: params,
    })
    .json<SimulatePortfolioInput>()
}

export default updateSimulatorInfo
