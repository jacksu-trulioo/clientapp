import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "PATCH") {
    await updateGeoLocationConsent(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function updateGeoLocationConsent({ concent }: { concent: boolean }) {
    const disclaimer = await client.user.updateGeoLocationConsent(concent)

    res.status(200).json(disclaimer)
  }
}

export default withSentry(withApiAuthRequired(handler))
