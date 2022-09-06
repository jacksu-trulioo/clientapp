import ky from "ky"

import { RedemptionFundRootSchema } from "~/services/mytfo/jsonSchemas"

import validateSchema from "../../ajvValidator"

const getRedeemFunds = async (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.get(`deal/api/v1/redeem-funds`)
      let response = await data.json()
      if (await validateSchema(RedemptionFundRootSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getRedeemFunds
