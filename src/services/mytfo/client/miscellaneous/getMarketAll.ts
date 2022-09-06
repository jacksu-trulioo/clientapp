import ky from "ky"

import { MarketIndicator } from "~/services/mytfo/types"

import validateSchema from "../../ajvValidator"
import { MarketIndicatorSchema } from "../../jsonSchemas"

const getMarketAll = (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await httpClient
        .get(`miscellaneous/api/v1/market-all`)
        .json<MarketIndicator>()
      if (await validateSchema(MarketIndicatorSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getMarketAll
