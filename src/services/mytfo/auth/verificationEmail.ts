import ky from "ky"

const verificationEmail = async (
  httpClient: typeof ky,
  params: { email: string },
) => {
  return httpClient
    .post("auth/client/send-verification-email", {
      json: params,
    })
    .json()
}

export default verificationEmail
