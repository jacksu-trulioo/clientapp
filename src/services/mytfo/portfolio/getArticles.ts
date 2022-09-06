import ky from "ky"

import { InsightsWithPagination } from "~/services/mytfo/types"

const getArticles = async (httpClient: typeof ky, page: string) => {
  // dynamic params will be provided while implementing pagination
  return httpClient
    .get(`portfolio/insight/articles?page=${page}&count=10`)
    .json<InsightsWithPagination>()
}

export default getArticles
