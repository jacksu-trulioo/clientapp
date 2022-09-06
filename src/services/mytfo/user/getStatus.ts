import ky from "ky"

import { UserStatuses } from "~/services/mytfo/types"

const getStatus = async (httpClient: typeof ky) => {
  return httpClient.get("user/status").json<UserStatuses>()
}

export default getStatus
