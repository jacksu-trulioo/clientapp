import ky from "ky"

import validateSchema from "../../ajvValidator"
import { PopupDetailRootSchema } from "../../jsonSchemas"

type PopUpPostParams = {
  updatePopupDetailsList: [
    {
      popupId: number
      flag: boolean
    },
  ]
}

const updatePopupData = (httpClient: typeof ky, params: PopUpPostParams) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.post(`deal/api/v1/popup-details`, {
        json: params,
      })
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

export default updatePopupData
