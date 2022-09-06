import ky from "ky"

import { PastWebinar } from "~/services/mytfo/types"

const getPastWebinars = async (httpClient: typeof ky) => {
  return httpClient.get("portfolio/insight/webinars/recent").json<PastWebinar>()
}

export default getPastWebinars
