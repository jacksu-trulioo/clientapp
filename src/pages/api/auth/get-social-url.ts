import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"
function getSocialSignupFields(connection: string) {
  switch (connection) {
    case "google-oauth2":
      return "Google"
    case "linkedin":
      return "LinkedIn"
    case "twitter":
      return "Twitter"
    case "apple":
      return "Apple"
    default:
      return ""
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { query = {} } = req

    const connection = query?.connection as string
    const lan = query?.lang as string
    const returnTo = query?.returnTo as string
    const originUrl = query?.originUrl as string
    const socialSignUp = getSocialSignupFields(connection)
    const state = `${socialSignUp}||${originUrl}`
    let url = `${process.env.AUTH0_ISSUER_BASE_URL}/authorize?response_type=code&client_id=${process.env.AUTH0_CLIENT_ID}&scope=openid email&audience=${process.env.AUTH0_AUDIENCE}&connection=${connection}`
    if (lan === "ar") {
      url = `${url}&state=${state}&redirect_uri=${process.env.AUTH0_BASE_URL}/api/auth/callback-ar?returnTo=${returnTo}`
    } else {
      url = `${url}&state=${state}&redirect_uri=${process.env.AUTH0_BASE_URL}/api/auth/callback-en?returnTo=${returnTo}`
    }
    res.status(200).json({ url: url })
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withSentry(handler)
