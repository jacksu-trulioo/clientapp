import ky from "ky"

const updateClientOpportunities = (
  httpClient: typeof ky,
  params: {
    dealId: number
    dealName: string
  },
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await httpClient.delete(`deal/api/v1/investment-cart`, {
        json: params,
      })
      resolve(response.status)
    } catch (error) {
      reject(error)
    }
  })
}

export default updateClientOpportunities
