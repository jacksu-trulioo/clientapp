import ky from "ky"

import validateSchema from "../../ajvValidator"
import { PopupDetailRootSchema } from "../../jsonSchemas"

const getPopupData = (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.get(`deal/api/v1/popup-details`)
      let response = await data.json()

      if (await validateSchema(PopupDetailRootSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getPopupData
