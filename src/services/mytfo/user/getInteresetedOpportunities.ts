import ky from "ky"

const getInteresetedOpportunities = async (httpClient: typeof ky) => {
  return httpClient.get("user/preference/opportunity-interest").json()
}

export default getInteresetedOpportunities
