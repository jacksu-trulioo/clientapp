import ky from "ky"

import { MandateAuthenticator } from "../../types"

const getMandateAuthenticator = async (
  httpClient: typeof ky,
  accessToken: string,
) => {
  if (accessToken) {
    return httpClient
      .get(`account/api/v2/mandate-authentications`, {
        prefixUrl: `${process.env.NEXT_CLIENT_AZURE_MS_BASE_URL}/`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          identifier: "auth0",
          countrycode: "BH",
        },
      })
      .json<MandateAuthenticator>()
  } else {
    return httpClient
      .get(`account/api/v2/mandate-authentications`, {
        prefixUrl: `${process.env.NEXT_CLIENT_AZURE_MS_BASE_URL}/`,
      })
      .json<MandateAuthenticator>()
  }
}

export default getMandateAuthenticator
