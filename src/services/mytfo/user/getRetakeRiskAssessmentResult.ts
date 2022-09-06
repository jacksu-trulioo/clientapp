import ky from "ky"

import { RiskAssessmentScore } from "~/services/mytfo/types"

const getRiskAssessmentResult = async (httpClient: typeof ky) => {
  return httpClient
    .get("user/risk-assessment/retake/result")
    .json<RiskAssessmentScore>()
}

export default getRiskAssessmentResult
