import ky from "ky"

import { dealSchema } from "~/services/mytfo/jsonSchemas"

import validateSchema from "../../ajvValidator"

const getClientDeals = async (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.get(`deal/api/v1/deals`)

      let response = await data.json()

      if (await validateSchema(dealSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getClientDeals
