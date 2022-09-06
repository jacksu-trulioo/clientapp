import ky from "ky"

import { Profile } from "~/services/mytfo/types"

const createProfile = async (httpClient: typeof ky, params: Profile) => {
  return httpClient
    .post("user/profile", {
      json: params,
    })
    .json<Profile>()
}

export default createProfile
