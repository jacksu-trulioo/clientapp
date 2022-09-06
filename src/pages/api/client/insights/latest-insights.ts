import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "GET") {
    let lang = req?.query?.langCode || "en"
    await getLatestInsights(lang as string)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getLatestInsights(_lang: string) {
    const response = await client.clientInsights.getLatestInsights(_lang)

    if (response.stories) {
      res.status(200).json(response.stories)
    } else {
      res.status(404).json({ message: "Stories Not Found" })
    }
  }
}
export default withSentry(withApiAuthRequired(handler))
