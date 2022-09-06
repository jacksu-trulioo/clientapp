import ky from "ky"

import { KycOnboardingId } from "~/services/mytfo/types"

const getOnboardingId = async (httpClient: typeof ky) => {
  return httpClient.get("user/kyc/onboarding-id").json<KycOnboardingId>()
}

export default getOnboardingId
