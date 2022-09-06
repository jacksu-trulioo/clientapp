import ky from "ky"

import { User } from "~/services/mytfo/types"

const getProfile = async (httpClient: typeof ky) => {
  return httpClient.get("user/profile").json<User>()
}

export default getProfile
