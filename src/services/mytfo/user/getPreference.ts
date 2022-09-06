import ky from "ky"

import { Preference } from "~/services/mytfo/types"

const getPreference = async (httpClient: typeof ky) => {
  return httpClient.get("user/preference").json<Preference>()
}

export default getPreference
