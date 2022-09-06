import ky from "ky"

import validateSchema from "../../ajvValidator"
import { GlossaryResSchema } from "../../jsonSchemas"

const getGlossaries = (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.get("miscellaneous/api/v1/glossaries")
      const response = await data.json()

      if (await validateSchema(GlossaryResSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getGlossaries
