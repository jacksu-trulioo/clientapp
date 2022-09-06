import ky from "ky"

import { KycSubmitDocumentRequest } from "~/services/mytfo/types"

const submitKycDocument = async (
  httpClient: typeof ky,
  params: KycSubmitDocumentRequest,
) => {
  return httpClient
    .post("user/kyc/document-verification/upload", {
      json: params,
    })
    .json()
}

export default submitKycDocument
