import ky from "ky"

import { CashflowsSchema } from "~/services/mytfo/jsonSchemas"

import validateSchema from "../../ajvValidator"

const getCashflowDetails = async (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.get(`cashflow/api/v1/cashflow-details`)
      let response = await data.json()

      if (await validateSchema(CashflowsSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getCashflowDetails
