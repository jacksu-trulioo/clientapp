import ky from "ky"

import { Insight } from "~/services/mytfo/types"

const getTopWhitepapers = async (
  httpClient: typeof ky,
  params: { excludingId: string },
) => {
  if (params.excludingId) {
    return httpClient
      .get(`portfolio/insight/whitepapers/top?excluding=${params.excludingId}`)
      .json<Insight[]>()
  }
  return httpClient.get(`portfolio/insight/whitepapers/top`).json<Insight[]>()
}

export default getTopWhitepapers
