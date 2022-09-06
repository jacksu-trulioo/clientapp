import ky from "ky"

import { InvestorRiskAssessment } from "~/services/mytfo/types"

const updateRiskAssessment = async (
  httpClient: typeof ky,
  params: InvestorRiskAssessment,
) => {
  return httpClient
    .put("user/risk-assessment/retake", {
      json: params,
    })
    .json<InvestorRiskAssessment>()
}

export default updateRiskAssessment
