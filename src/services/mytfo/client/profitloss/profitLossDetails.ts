import ky from "ky"

import { ProfitLossDetailsSchema } from "~/services/mytfo/jsonSchemas"

import validateSchema from "../../ajvValidator"

const profitLossDetails = async (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.get(`profitloss/api/v1/profit-loss-details`)
      let response = await data.json()
      if (await validateSchema(ProfitLossDetailsSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default profitLossDetails
