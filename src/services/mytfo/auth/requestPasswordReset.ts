import ky from "ky"

const requestPasswordReset = async (
  httpClient: typeof ky,
  params: { emailOrUsername: string },
) => {
  return httpClient.post("auth/client/reset-password", { json: params }).json()
}

export default requestPasswordReset
