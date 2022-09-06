import ky from "ky"

const submitEmailEnquiry = async (
  httpClient: typeof ky,
  params: { message: string },
) => {
  return httpClient
    .post("user/support", {
      json: params,
    })
    .json()
}

export default submitEmailEnquiry
