import ky from "ky"

import { OpportunitiesResponse } from "~/services/mytfo/types"

const getOpportunities = async (httpClient: typeof ky) => {
  return httpClient.get("portfolio/opportunities").json<OpportunitiesResponse>()
}

export default getOpportunities
