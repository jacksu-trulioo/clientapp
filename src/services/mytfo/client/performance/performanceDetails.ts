import ky from "ky"

import { PerformanceDetailsSchema } from "~/services/mytfo/jsonSchemas"

import validateSchema from "../../ajvValidator"

const performanceDetails = async (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.get(`performance/api/v1/performance-details`)
      let response = await data.json()
      if (await validateSchema(PerformanceDetailsSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default performanceDetails
