import ky from "ky"

const getAbsherCitizenInfo = async (
  httpClient: typeof ky,
  params: { token: string; dob: string },
) => {
  return httpClient
    .post("user/kyc/citizen-info", {
      json: params,
    })
    .json()
}

export default getAbsherCitizenInfo
