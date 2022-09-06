import { withSentry } from "@sentry/nextjs"
import { NextApiRequest, NextApiResponse } from "next"

import callBackHandler from "~/utils/callBackHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await callBackHandler(req, res, "en")
}
export default withSentry(handler)
