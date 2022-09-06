import ky from "ky"

import { UpcomingWebinar } from "~/services/mytfo/types"

const getUpcomingWebinars = async (httpClient: typeof ky) => {
  return httpClient.get("portfolio/webinars/upcomings").json<UpcomingWebinar>()
}

export default getUpcomingWebinars
