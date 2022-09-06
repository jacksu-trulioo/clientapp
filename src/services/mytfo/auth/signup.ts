import ky from "ky"

import { Session } from "../types"

const signup = async (
  httpClient: typeof ky,
  params: {
    email: string
    password: string
    termsOfService: {
      userAgent: string
      agreedAt: Date
      ipAddress: string
    }
  },
) => {
  return httpClient
    .post("auth/client/sign-up", { json: params })
    .json<Session>()
}

export default signup
