import ky from "ky"

import { InvestorRiskAssessment } from "~/services/mytfo/types"

const getRiskAssessment = async (httpClient: typeof ky) => {
  return httpClient
    .get("user/risk-assessment/retake")
    .json<InvestorRiskAssessment>()
}

export default getRiskAssessment
