import ky from "ky"

export interface ParamsType {
  isInterested: boolean
  opportunityId: string
}

const updateDisclaimer = async (httpClient: typeof ky, params: ParamsType) => {
  return httpClient
    .patch("user/preference/opportunity-interest", {
      json: params,
    })
    .json()
}

export default updateDisclaimer
