import ky from "ky"

import { Article } from "~/services/mytfo/types"

const getWebinar = async (httpClient: typeof ky, params: { id: string }) => {
  return httpClient
    .get(`portfolio/insight/webinars/${params.id}`)
    .json<Article>()
}

export default getWebinar
