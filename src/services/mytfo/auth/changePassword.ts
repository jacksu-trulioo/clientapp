import ky from "ky"

const changePassword = async (
  httpClient: typeof ky,
  params: {
    email: string
    password: string
    data: string
    expirydate: string
  },
) => {
  return httpClient.post("auth/client/update-password", { json: params }).json()
}

export default changePassword
