import ky from "ky"

import { DealDistributionTypesSchema } from "~/services/mytfo/jsonSchemas"

import validateSchema from "../../ajvValidator"

const dealDistributionDetails = async (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.get(`deal/api/v1/deal-distribution-details`)

      let response = await data.json()

      if (await validateSchema(DealDistributionTypesSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default dealDistributionDetails
