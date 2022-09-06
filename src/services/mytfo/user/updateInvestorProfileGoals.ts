import ky from "ky"

import { InvestorProfileGoals } from "~/services/mytfo/types"

const updateInvestorProfileGoals = async (
  httpClient: typeof ky,
  params: InvestorProfileGoals,
) => {
  return httpClient
    .put("user/investment-goals", {
      json: params,
    })
    .json<InvestorProfileGoals>()
}

export default updateInvestorProfileGoals
