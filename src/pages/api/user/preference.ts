import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { Preference } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "GET") {
    await getPreferences()
  } else if (req.method === "PUT") {
    await updatePreferences(req.body)
  } else if (req.method === "POST") {
    await submitPreferences(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getPreferences() {
    const preferences = await client.user.getPreference()

    res.status(200).json(preferences)
  }

  async function updatePreferences(params: Preference) {
    const preferences = await client.user.updatePreference(params)

    res.status(200).json(preferences)
  }

  async function submitPreferences(params: Preference) {
    const preferences = await client.user.submitPreference(params)

    res.status(200).json(preferences)
  }
}

export default withSentry(withApiAuthRequired(handler))
