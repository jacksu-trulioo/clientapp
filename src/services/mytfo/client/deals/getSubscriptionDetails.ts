import ky from "ky"

import { SubscriptionSavedClientAppDbPayload } from "~/services/mytfo/types"

import validateSchema from "../../ajvValidator"
import { SubscriptionSavedClientAppDbSchema } from "../../jsonSchemas"

const getSubscriptionDetails = (
  httpClient: typeof ky,
  params: SubscriptionSavedClientAppDbPayload,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await httpClient.post(
        `deal/api/v1/subscription-details`,
        {
          json: params,
        },
      )
      const jsonRes = await response.json()
      if (await validateSchema(SubscriptionSavedClientAppDbSchema, jsonRes)) {
        resolve(jsonRes)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getSubscriptionDetails
