import ky from "ky"

import validateSchema from "../../ajvValidator"
import { PortfolioActivityResSchema } from "../../jsonSchemas"

const getPortfolioActivity = (httpClient: typeof ky, mandateId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await httpClient.get(
        `client-get-activity/v1/client-activities/${mandateId}`,
      )

      const res = await response.json()

      if (await validateSchema(PortfolioActivityResSchema, res)) {
        resolve(res)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getPortfolioActivity
