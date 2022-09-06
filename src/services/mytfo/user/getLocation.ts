import ky from "ky"

import { Location } from "~/services/mytfo/types"

const getLocation = async (httpClient: typeof ky) => {
  return httpClient.get("user/location").json<Location>()
}

export default getLocation
