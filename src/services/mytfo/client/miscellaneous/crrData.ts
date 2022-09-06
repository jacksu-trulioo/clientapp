import ky from "ky"

import validateSchema from "../../ajvValidator"
import { crrRootSchema } from "../../jsonSchemas"

const crrData = (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await httpClient.get("miscellaneous/api/v1/crr")
      const responseJSON = await response.json()

      if (await validateSchema(crrRootSchema, responseJSON)) {
        resolve(responseJSON)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default crrData
