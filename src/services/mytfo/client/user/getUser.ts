import ky from "ky"

const getUser = async (httpClient: typeof ky, params: {}) => {
  let response: [{}] = await httpClient
    .post(`getUser`, {
      prefixUrl: `${process.env.NEXT_CLIENT_AUTH0_BE_SERVICE_ENDPOINT}/`,
      json: params,
    })
    .json()
  if (response.length) {
    return response[0]
  }
}

export default getUser
