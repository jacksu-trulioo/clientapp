import ky from "ky"

import { FAQ } from "~/services/mytfo/types"

const getFAQs = async (httpClient: typeof ky) => {
  return httpClient.get("portfolio/faqs").json<FAQ[]>()
}

export default getFAQs
