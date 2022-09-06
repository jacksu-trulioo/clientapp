import ky from "ky"

import { Session } from "../types"

const login = async (
  httpClient: typeof ky,
  params: { email: string; password: string },
) => {
  return httpClient
    .post("auth/client/token", {
      json: {
        username: params.email,
        password: params.password,
      },
    })
    .json<Session>()
}

export default login
