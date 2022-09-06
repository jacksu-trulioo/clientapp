import ky from "ky"

import { Prospects } from "../types"

const getProspects = async (httpClient: typeof ky) => {
  return httpClient.get(`user/prospects`).json<Prospects>()
}
export default getProspects
