import ky from "ky"

import { KycPersonalInformation } from "~/services/mytfo/types"

const getKycPersonalInformation = async (httpClient: typeof ky) => {
  return httpClient
    .get("user/kyc/personal-information")
    .json<KycPersonalInformation>()
}

export default getKycPersonalInformation
