import ky from "ky"

import { ProgramsDetailsPayload } from "~/services/mytfo/types"

import validateSchema from "../../ajvValidator"
import { ProgramDealsSchema } from "../../jsonSchemas"

const getProgramDeals = (
  httpClient: typeof ky,
  params: ProgramsDetailsPayload,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await httpClient.post(`deal/api/v1/program-deals`, {
        json: params,
      })
      const jsonRes = await response.json()
      if (await validateSchema(ProgramDealsSchema, jsonRes)) {
        resolve(jsonRes)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getProgramDeals
