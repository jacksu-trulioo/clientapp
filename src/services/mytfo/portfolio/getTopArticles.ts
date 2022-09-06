import ky from "ky"

import { Insight } from "~/services/mytfo/types"

const getTopArticles = async (
  httpClient: typeof ky,
  params: { excludingId: string },
) => {
  if (params.excludingId) {
    return httpClient
      .get(`portfolio/insight/articles/top?excluding=${params.excludingId}`)
      .json<Insight[]>()
  }
  return httpClient.get(`portfolio/insight/articles/top`).json<Insight[]>()
}

export default getTopArticles
