import ky from "ky"

import { Insight } from "~/services/mytfo/types"

const getTopManagementViews = async (
  httpClient: typeof ky,
  params: { excludingId: string },
) => {
  if (params.excludingId) {
    return httpClient
      .get(
        `portfolio/insight/management-views/top?excluding=${params.excludingId}`,
      )
      .json<Insight[]>()
  }
  return httpClient
    .get(`portfolio/insight/management-views/top`)
    .json<Insight[]>()
}

export default getTopManagementViews
