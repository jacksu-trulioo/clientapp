import ky from "ky"

import { KycPersonalInformation } from "~/services/mytfo/types"

const updateKycPersonalInformation = async (
  httpClient: typeof ky,
  params: KycPersonalInformation,
) => {
  return httpClient
    .put("user/kyc/personal-information", {
      json: params,
    })
    .json<KycPersonalInformation>()
}

export default updateKycPersonalInformation
