import ky from "ky"

import { InvestorProfileGoals } from "~/services/mytfo/types"

const updateProposal = async (
  httpClient: typeof ky,
  params: InvestorProfileGoals,
) => {
  return httpClient
    .put("user/proposals", {
      json: params,
    })
    .json<InvestorProfileGoals>()
}

export default updateProposal
