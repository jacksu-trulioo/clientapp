import ky from "ky"

import validateSchema from "../../ajvValidator"
import { profileDataSchema } from "../../jsonSchemas"

const getProfile = (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await httpClient.get("account/api/v1/profile-data")
      const responseJSON = await response.json()
      if (await validateSchema(profileDataSchema, responseJSON)) {
        resolve(responseJSON)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getProfile
