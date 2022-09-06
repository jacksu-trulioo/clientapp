import ky from "ky"

const validateOtpForAbsher = async (
  httpClient: typeof ky,
  params: { nationalityId: number; otp: string },
) => {
  return httpClient
    .post("user/kyc/validate-otp", {
      json: params,
    })
    .json()
}

export default validateOtpForAbsher
