import ky from "ky"

import validateSchema from "../../ajvValidator"
import { CommitmentRelatedDealSchema } from "../../jsonSchemas"

const getCommitmentRelatedDeals = (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await httpClient.get(`deal/api/v1/commitment-deals`)
      const jsonRes = await response.json()

      if (await validateSchema(CommitmentRelatedDealSchema, jsonRes)) {
        resolve(jsonRes)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getCommitmentRelatedDeals
