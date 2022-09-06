import ky from "ky"

import { DealDetailsSchema } from "~/services/mytfo/jsonSchemas"

import validateSchema from "../../ajvValidator"

const getdealDetails = async (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.get(`deal/api/v1/deal-details`)
      let response = await data.json()
      resolve(response)
      if (await validateSchema(DealDetailsSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getdealDetails
