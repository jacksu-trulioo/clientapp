import ky from "ky"

import { ProfileCompletionTracker } from "~/services/mytfo/types"

const getRiskAssessment = async (httpClient: typeof ky) => {
  return httpClient.get("user/profile/tracker").json<ProfileCompletionTracker>()
}

export default getRiskAssessment
