import ky from "ky"

import { clientOpportunitiesPayload } from "../../types"

const updateClientOpportunities = (
  httpClient: typeof ky,
  params: {
    mandateId: string
    requestObj: clientOpportunitiesPayload
  },
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await httpClient.patch(
        `deal/api/v1/${params.mandateId}/client-opportunities`,
        {
          json: params.requestObj,
        },
      )
      resolve(response.status)
    } catch (error) {
      reject(error)
    }
  })
}

export default updateClientOpportunities
