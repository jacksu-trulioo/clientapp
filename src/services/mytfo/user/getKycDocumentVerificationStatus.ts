import ky from "ky"

import { KycDocumentVerificationStatus } from "~/services/mytfo/types"

const getKycDocumentVerificationStatus = async (httpClient: typeof ky) => {
  return httpClient
    .get("user/kyc/document-verification")
    .json<KycDocumentVerificationStatus>()
}

export default getKycDocumentVerificationStatus
