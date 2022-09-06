import ky from "ky"

const resendEmailVerification = async (httpClient: typeof ky) => {
  return httpClient.post("auth/send-verification-email").json()
}

export default resendEmailVerification
