import ky from "ky"

import { KycInvestmentExperience } from "~/services/mytfo/types"

const updateKycInvestmentExperience = async (
  httpClient: typeof ky,
  params: KycInvestmentExperience,
) => {
  return httpClient
    .put("user/kyc/investment-experience", {
      json: params,
    })
    .json<KycInvestmentExperience>()
}

export default updateKycInvestmentExperience
