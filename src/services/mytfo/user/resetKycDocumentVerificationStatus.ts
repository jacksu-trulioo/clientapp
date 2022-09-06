import ky from "ky"

const resetKycDocumentVerificationStatus = async (httpClient: typeof ky) => {
  return httpClient.delete("user/kyc/document-verification/reset").json()
}

export default resetKycDocumentVerificationStatus
