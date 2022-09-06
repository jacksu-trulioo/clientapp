import ky from "ky"

import validateSchema from "../../ajvValidator"
import { TotalCommitmentsSchema } from "../../jsonSchemas"
import { TotalCommitments } from "../../types"

const getTotalCommitmentDetails = (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await httpClient
        .get(`commitment/api/v1/commitment-details`)
        .json<TotalCommitments>()
      if (await validateSchema(TotalCommitmentsSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

export default getTotalCommitmentDetails
