import ky from "ky"

import { PerformanceQuarterDealsRootSchema } from "~/services/mytfo/jsonSchemas"

import validateSchema from "../../ajvValidator"

const getTopDeals = async (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.get(`deal/api/v1/quarter-deals`)
      let response = await data.json()

      if (await validateSchema(PerformanceQuarterDealsRootSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getTopDeals
