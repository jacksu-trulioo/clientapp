import ky from "ky"

import { SampleDeals } from "~/services/mytfo/types"

const getSampleDeals = async (httpClient: typeof ky) => {
  return httpClient.get("portfolio/simulator/sample-deals").json<SampleDeals>()
}

export default getSampleDeals
