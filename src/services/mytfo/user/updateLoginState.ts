import ky from "ky"
const updateLoginState = async (httpClient: typeof ky) => {
  return httpClient.put("user/update-login-state")
}
export default updateLoginState
