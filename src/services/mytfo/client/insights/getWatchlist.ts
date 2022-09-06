import ky from "ky"

import { WatchlistSchema } from "~/services/mytfo/jsonSchemas"

import validateSchema from "../../ajvValidator"

const getWatchlist = async (httpClient: typeof ky) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.get(`miscellaneous/api/v1/watchlist`)
      let response = await data.json()
      if (await validateSchema(WatchlistSchema, response)) {
        resolve(response)
      }
      reject("Validation Error")
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

export default getWatchlist
