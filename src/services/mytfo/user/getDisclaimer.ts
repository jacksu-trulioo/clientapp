import ky from "ky"

import { Disclaimer } from "~/services/mytfo/types"

const getDisclaimer = async (httpClient: typeof ky) => {
  return httpClient.get("user/preference/disclaimer").json<Disclaimer>()
}

export default getDisclaimer
