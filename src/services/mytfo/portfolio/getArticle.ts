import ky from "ky"

import { Article } from "~/services/mytfo/types"

const getArticle = async (httpClient: typeof ky, params: { id: string }) => {
  return httpClient
    .get(`portfolio/insight/articles/${params.id}`)
    .json<Article>()
}

export default getArticle
