import ky from "ky"

import { PortfolioSummary } from "~/services/mytfo/types"

const getSummary = async (httpClient: typeof ky) => {
  return httpClient.get("user/summary").json<PortfolioSummary>()
}

export default getSummary
