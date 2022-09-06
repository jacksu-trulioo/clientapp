import ky from "ky"

import { LogActivity } from "~/services/mytfo/types"

const addLogActivity = async (httpClient: typeof ky, params: LogActivity) => {
  return httpClient.post("user/log-activity", {
    json: params,
  })
}

export default addLogActivity
