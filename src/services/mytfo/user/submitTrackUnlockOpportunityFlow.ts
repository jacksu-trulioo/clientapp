import ky from "ky"

import { UnlockOpportunityFlow } from "~/services/mytfo/types"

const submitTrackUnlockOpportunityFlow = async (
  httpClient: typeof ky,
  params: UnlockOpportunityFlow,
) => {
  return httpClient
    .post("user/track-unlock-opportunity-flow", {
      json: params,
    })
    .json<UnlockOpportunityFlow>()
}

export default submitTrackUnlockOpportunityFlow
