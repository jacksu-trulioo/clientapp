import ky from "ky"

import validateSchema from "../../ajvValidator"
import { InvestmentCartSchema } from "../../jsonSchemas"

const getInvestmentCart = (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await httpClient.get(`deal/api/v1/investment-cart`)
      const jsonRes = await response.json()
      if (await validateSchema(InvestmentCartSchema, jsonRes)) {
        resolve(jsonRes)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getInvestmentCart
