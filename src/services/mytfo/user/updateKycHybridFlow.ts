import ky from "ky"

import { KycHybridFlowFlag } from "~/services/mytfo/types"

const updateKycHybridFlow = async (
  httpClient: typeof ky,
  params: KycHybridFlowFlag,
) => {
  return httpClient
    .put("user/kyc/hybrid-flow", {
      json: params,
    })
    .json<KycHybridFlowFlag>()
}

export default updateKycHybridFlow
