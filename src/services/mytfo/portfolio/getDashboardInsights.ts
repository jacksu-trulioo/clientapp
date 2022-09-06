import ky from "ky"

import { Insight } from "~/services/mytfo/types"

const getDashboardInsights = async (httpClient: typeof ky) => {
  return httpClient.get("portfolio/insight/top").json<Insight[]>()
}

export default getDashboardInsights
