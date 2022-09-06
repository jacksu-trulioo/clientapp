import ky from "ky"

import { KycStatus } from "~/services/mytfo/types"

const getKycStatus = async (httpClient: typeof ky) => {
  return httpClient.get("user/kyc/status").json<KycStatus>()
}

export default getKycStatus
