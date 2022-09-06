import ky from "ky"

import { AccountSummariesSchema } from "~/services/mytfo/jsonSchemas"
import { AccountSummaries } from "~/services/mytfo/types"

import validateSchema from "../../ajvValidator"

const accountSummaries = async (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await httpClient.get(`account/api/v1/account-summaries`)

      let response: AccountSummaries = await data.json()
      if (await validateSchema(AccountSummariesSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default accountSummaries
