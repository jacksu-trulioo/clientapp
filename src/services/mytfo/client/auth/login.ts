import ky from "ky"

import { ClientSession } from "../../types"

const login = async (
  httpClient: typeof ky,
  params: { email: string; password: string },
) => {
  return httpClient
    .post(`login`, {
      prefixUrl: `${process.env.NEXT_CLIENT_AUTH0_BE_SERVICE_ENDPOINT}/`,
      json: {
        username: params.email,
        password: params.password,
      },
    })
    .json<ClientSession>()
}

export default login
