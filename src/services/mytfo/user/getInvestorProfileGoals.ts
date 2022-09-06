import ky from "ky"

import { InvestorProfileGoals } from "~/services/mytfo/types"

const getInvestorProfileGoals = async (httpClient: typeof ky) => {
  return httpClient.get("user/investment-goals").json<InvestorProfileGoals>()
}

export default getInvestorProfileGoals
