import ky from "ky"

const sendOtp = async (
  httpClient: typeof ky,
  params: { phoneNumber: string },
) => {
  return httpClient
    .post("auth/send-otp", {
      json: params.phoneNumber,
    })
    .json()
}

export default sendOtp
