import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import Cookies from "cookies"
import jwt_decode from "jwt-decode"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)
  const session = getSession(req, res)
  let phoneNumberVerified = false

  if (req.method === "GET") {
    await getUser()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  function setPhoneNumberVerified() {
    if (session) {
      const { idToken } = session
      if (idToken) {
        const decoded: { phone_number_verified?: boolean } = jwt_decode(idToken)
        if (decoded?.phone_number_verified) {
          phoneNumberVerified = true
        }
      }
    }
    if (!phoneNumberVerified) {
      const cookies = new Cookies(req, res)
      const phoneNumberVerifiedCookie = cookies.get("phoneNumberVerified")
      if (phoneNumberVerifiedCookie == "true") {
        phoneNumberVerified = true
      }
    }
  }

  async function getUser() {
    const response = await client.user.getUser()
    setPhoneNumberVerified()
    response.phoneNumberVerified = phoneNumberVerified
    response.mandateId = session?.mandateId ? session.mandateId : null
    res.status(200).json(response)
  }
}

export default withSentry(withApiAuthRequired(handler))
