import ky from "ky"

import { User } from "~/services/mytfo/types"

const getUser = async (httpClient: typeof ky) => {
  return httpClient.get("user/").json<User>()
}

export default getUser
