import ky from "ky"

import { Insight } from "~/services/mytfo/types"

const getTopWebinars = async (
  httpClient: typeof ky,
  params: { excludingId: string },
) => {
  if (params.excludingId) {
    return httpClient
      .get(`portfolio/insight/webinars/top?excluding=${params.excludingId}`)
      .json<Insight[]>()
  }
  return httpClient.get(`portfolio/insight/webinars/top`).json<Insight[]>()
}

export default getTopWebinars
