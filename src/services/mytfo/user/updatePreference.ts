import ky from "ky"

import { Preference } from "~/services/mytfo/types"

const updatePreference = async (httpClient: typeof ky, params: Preference) => {
  return httpClient
    .put("user/preference", {
      json: params,
    })
    .json<Preference>()
}

export default updatePreference
