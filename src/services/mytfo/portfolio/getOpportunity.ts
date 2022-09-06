import ky from "ky"

import { Opportunity } from "~/services/mytfo/types"

const getOpportunity = async (
  httpClient: typeof ky,
  params: { id: string },
) => {
  return httpClient
    .get(`portfolio/opportunities/${params.id}`)
    .json<Opportunity>()
}

export default getOpportunity
