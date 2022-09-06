import ky from "ky"

import { HighlightsSchema } from "~/services/mytfo/jsonSchemas"

import validateSchema from "../../ajvValidator"

const getHighlights = async (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.get(`miscellaneous/api/v1/highlights`)
      let response = await data.json()
      if (await validateSchema(HighlightsSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getHighlights
