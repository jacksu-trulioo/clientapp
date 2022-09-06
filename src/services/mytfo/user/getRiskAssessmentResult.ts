import ky from "ky"

import { RiskAssessmentScore } from "~/services/mytfo/types"

const getRiskAssessmentResult = async (httpClient: typeof ky) => {
  return httpClient
    .get("user/risk-assessment/result")
    .json<RiskAssessmentScore>()
}

export default getRiskAssessmentResult
