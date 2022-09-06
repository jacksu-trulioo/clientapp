import ky from "ky"

import { VerifyOTPInput } from "~/services/mytfo/types"

const verifyOtp = async (httpClient: typeof ky, params: VerifyOTPInput) => {
  return httpClient
    .post("auth/verify-otp", {
      json: params,
    })
    .json()
}

export default verifyOtp
