import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  const lang = (req.query?.langCode as string) || "en"

  if (req.method === "GET") {
    await getPodcastVideos()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getPodcastVideos() {
    try {
      const response = await client.clientInsights.getClientPodcastVideos(lang)
      let dataResponse = req.query.count
        ? (response.stories?.slice(0, Number(req.query.count)) as [])
        : (response.stories as [])
      if (dataResponse) {
        res.status(200).json(dataResponse)
      } else {
        res.status(404).json({ message: "Stories Not Found" })
      }
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}
export default withSentry(withApiAuthRequired(handler))
