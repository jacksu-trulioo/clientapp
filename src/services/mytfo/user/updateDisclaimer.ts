import ky from "ky"

import { DisclaimerResponse } from "~/services/mytfo/types"

const updateDisclaimer = async (httpClient: typeof ky) => {
  return httpClient
    .patch("user/preference/disclaimer", {
      json: true,
    })
    .json<DisclaimerResponse>()
}

export default updateDisclaimer
