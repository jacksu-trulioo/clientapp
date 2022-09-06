import ky from "ky"

const getLastValuationDate = async (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await httpClient.get(`account/api/v1/account-summaries`)
      let response = await data.json()
      resolve({
        accountCreated: response.accountCreationDate,
        lastValuationDate: response.lastValuationDate,
      })
    } catch (error) {
      reject(error)
    }
  })
}

export default getLastValuationDate
