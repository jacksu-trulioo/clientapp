import ky from "ky"

import { PhoneNumberInput } from "~/services/mytfo/types"

const updatePhoneNumber = async (
  httpClient: typeof ky,
  params: PhoneNumberInput,
) => {
  return httpClient
    .patch("user/profile/phone-number", {
      json: params,
    })
    .json()
}

export default updatePhoneNumber
