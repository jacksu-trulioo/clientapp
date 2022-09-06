import ky from "ky"

import { Insight } from "~/services/mytfo/types"

const getTopMarketUpdates = async (
  httpClient: typeof ky,
  params: { excludingId: string },
) => {
  if (params.excludingId) {
    return httpClient
      .get(
        `portfolio/insight/market-updates/top?excluding=${params.excludingId}`,
      )
      .json<Insight[]>()
  }
  return httpClient
    .get(`portfolio/insight/market-updates/top`)
    .json<Insight[]>()
}

export default getTopMarketUpdates
