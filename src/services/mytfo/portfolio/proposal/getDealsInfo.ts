import ky from "ky"

import { ProposalDealsGridObj } from "../../types"

const getDeals = async (httpClient: typeof ky, params: { id: string }) => {
  return httpClient
    .get(`portfolio/opportunities/${params.id}`)
    .json<ProposalDealsGridObj>()
}
export default getDeals
