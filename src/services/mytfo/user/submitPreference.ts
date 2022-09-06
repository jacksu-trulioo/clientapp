import ky from "ky"

import { Preference } from "../types"

const submitPreference = async (httpClient: typeof ky, params: Preference) => {
  return httpClient
    .post("user/preference", {
      json: params,
    })
    .json()
}

export default submitPreference
