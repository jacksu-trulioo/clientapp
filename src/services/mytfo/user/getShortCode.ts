import ky from "ky"

const getShortCode = async (httpClient: typeof ky) => {
  return httpClient.get("user/promotion/short-code").json<string>()
}

export default getShortCode
