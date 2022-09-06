import ky from "ky"

import { RedeemDetailsRootSchema } from "~/services/mytfo/jsonSchemas"
import { RedeemDetailsPayload } from "~/services/mytfo/types"

import validateSchema from "../../ajvValidator"

const getRedeemDetails = async (
  httpClient: typeof ky,
  params: RedeemDetailsPayload,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.post(`deal/api/v1/redeem-details`, {
        json: params,
      })
      let response = await data.json()
      if (await validateSchema(RedeemDetailsRootSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getRedeemDetails
