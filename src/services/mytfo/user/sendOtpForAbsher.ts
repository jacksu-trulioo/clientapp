import ky from "ky"

const sendOtpForAbsher = async (
  httpClient: typeof ky,
  params: { nationalityId: number },
) => {
  return httpClient
    .post("user/kyc/send-otp", {
      json: params,
    })
    .json()
}

export default sendOtpForAbsher
