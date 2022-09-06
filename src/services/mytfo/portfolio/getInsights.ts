import ky from "ky"

import { Insights } from "~/services/mytfo/types"

const getInsights = async (httpClient: typeof ky) => {
  return httpClient.get("portfolio/insight/top-collection").json<Insights[]>()
}

export default getInsights
