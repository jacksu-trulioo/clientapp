import ky from "ky"

const updatePassword = async (
  httpClient: typeof ky,
  params: { oldPassword: string; newPassword: string; confirmPassword: string },
) => {
  return httpClient.post("auth/update-password", { json: params }).json()
}

export default updatePassword
