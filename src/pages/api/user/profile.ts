import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { Profile } from "~/services/mytfo/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "GET") {
    await getProfile()
  } else if (req.method === "POST") {
    await createProfile(req.body)
  } else if (req.method === "PUT") {
    await updateProfile(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getProfile() {
    const profile = await client.user.getProfile()

    res.status(200).json(profile)
  }

  async function createProfile(params: Profile) {
    const profile = await client.user.createProfile(params)

    res.status(201).json(profile)
  }

  async function updateProfile(params: Profile) {
    const profile = await client.user.updateProfile(params)

    res.status(200).json(profile)
  }
}

export default withSentry(withApiAuthRequired(handler))
