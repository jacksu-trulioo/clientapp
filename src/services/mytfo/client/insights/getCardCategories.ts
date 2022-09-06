import ky from "ky"

import { CardCategoriesSchema } from "~/services/mytfo/jsonSchemas"

import validateSchema from "../../ajvValidator"

const getCardCategories = async (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.get(`miscellaneous/api/v1/card-categories`)
      let response = await data.json()
      if (await validateSchema(CardCategoriesSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getCardCategories
