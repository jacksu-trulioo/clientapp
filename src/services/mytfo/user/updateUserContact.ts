import ky from "ky"

import { UserContactInput } from "~/services/mytfo/types"

const updateUserContact = async (
  httpClient: typeof ky,
  params: UserContactInput,
) => {
  return httpClient
    .patch("user/contact", {
      json: params,
    })
    .json()
}

export default updateUserContact
