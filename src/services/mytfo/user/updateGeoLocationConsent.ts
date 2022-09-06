import ky from "ky"

const updateGeoLocationConsent = async (
  httpClient: typeof ky,
  params: boolean,
) => {
  return httpClient
    .patch("user/preference/location-consent", {
      json: params,
    })
    .json()
}

export default updateGeoLocationConsent
