import ky from "ky"

import { KycHybridFlowFlag } from "~/services/mytfo/types"

const getKycHybridFlowFlag = async (httpClient: typeof ky) => {
  return httpClient.get("user/kyc/hybrid-flow").json<KycHybridFlowFlag>()
}

export default getKycHybridFlowFlag
