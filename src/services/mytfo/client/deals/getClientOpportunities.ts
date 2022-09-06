import ky from "ky"

import { clientOpportunitiesArray } from "~/services/mytfo/types"

import validateSchema from "../../ajvValidator"
import { clientOpportunitiesArraySchema } from "../../jsonSchemas"

const getClientOpportunities = (httpClient: typeof ky, mandateId: string) => {
  return new Promise<clientOpportunitiesArray>(async (resolve, reject) => {
    try {
      const response = await httpClient.get(
        `deal/api/v2/${mandateId}/client-opportunities`,
      )
      const jsonRes = await response.json()
      if (await validateSchema(clientOpportunitiesArraySchema, jsonRes)) {
        resolve(jsonRes)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getClientOpportunities
