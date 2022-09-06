import ky from "ky"

import { Session } from "../types"

const getToken = async (
  httpClient: typeof ky,
  params: {
    authCode: string
    redirectUrl: string
    termsOfService: {
      userAgent: string
      agreedAt: Date
      ipAddress: string
    }
    socialSignUp?: string
    socialSignUpUtm?: string
  },
) => {
  return httpClient
    .post("auth/client/token/code", { json: params })
    .json<Session>()
}

export default getToken
