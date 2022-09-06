import ky from "ky"

import { Article } from "~/services/mytfo/types"

const getWhitepaper = async (httpClient: typeof ky, params: { id: string }) => {
  return httpClient
    .get(`portfolio/insight/whitepapers/${params.id}`)
    .json<Article>()
}

export default getWhitepaper
