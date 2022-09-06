import Ajv from "ajv"
import ky from "ky"

import { distributionCapitalSchema } from "../../jsonSchemas"

const getDistributionCapital = async (httpClient: typeof ky) => {
  const response = await httpClient.get(`account/api/v1/distribution-capital`)
  const responseJson = await response.json()
  const ajv = new Ajv()
  const validate = ajv.compile(distributionCapitalSchema)
  const valid = validate(responseJson)
  if (!valid) return validate.errors
  return responseJson
}

export default getDistributionCapital
