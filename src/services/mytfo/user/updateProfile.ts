import ky from "ky"

import { Profile } from "~/services/mytfo/types"

const updateProfile = async (httpClient: typeof ky, params: Profile) => {
  return httpClient
    .put("user/profile", {
      json: params,
    })
    .json<Profile>()
}

export default updateProfile
