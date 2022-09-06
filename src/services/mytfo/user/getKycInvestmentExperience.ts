import ky from "ky"

import { KycInvestmentExperience } from "~/services/mytfo/types"

const getKycInvestmentExperience = async (httpClient: typeof ky) => {
  return httpClient
    .get("user/kyc/investment-experience")
    .json<KycInvestmentExperience>()
}

export default getKycInvestmentExperience
