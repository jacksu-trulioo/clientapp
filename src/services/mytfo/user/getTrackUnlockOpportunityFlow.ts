import ky from "ky"

import { UnlockOpportunityFlow } from "~/services/mytfo/types"

const getTrackUnlockOpportunityFlow = async (httpClient: typeof ky) => {
  return httpClient
    .get("user/track-unlock-opportunity-flow")
    .json<UnlockOpportunityFlow>()
}

export default getTrackUnlockOpportunityFlow
