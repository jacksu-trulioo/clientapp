import ky from "ky"

import { TopWeeklySchema } from "~/services/mytfo/jsonSchemas"

import validateSchema from "../../ajvValidator"

const getTopWeekly = async (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.get(`miscellaneous/api/v1/top-weekly`)
      let response = await data.json()
      if (await validateSchema(TopWeeklySchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getTopWeekly
