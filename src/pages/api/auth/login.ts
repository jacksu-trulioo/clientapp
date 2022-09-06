import { withSentry } from "@sentry/nextjs"
import { NextApiRequest, NextApiResponse } from "next"
import { TokenSet } from "openid-client"

import { MyTfoClient } from "~/services/mytfo"
import { SessionCache } from "~/services/mytfo/helpers/sessionCache"
import {
  REDIRECT_CLIENT_TO,
  REDIRECT_ROLE,
} from "~/utils/constants/redirectPath"
import { decryptBody } from "~/utils/encryption"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = new MyTfoClient(req, res, { authRequired: false })
    const body = decryptBody(req)
    if (!body) {
      res.status(401).end()
      return
    }

    const {
      accessToken: access_token,
      expiresIn: expires_at,
      idToken: id_token,
      tokenType: token_type,
      isSocial: is_social,
      roles: roles,
    } = await client.auth.login(body)

    var mandate = null
    if (roles.includes(REDIRECT_ROLE)) {
      const mandates = await client.clientAccount.mandateAuthenticator(
        access_token,
      )
      if (mandates.length) {
        mandates.sort((a, b) => {
          return Number(a?.mandateId) - Number(b?.mandateId)
        })
        mandate = mandates[0].mandateId
      }
    }

    // TokenSet requires the token props in snake_case.
    const tokenSet = new TokenSet({
      access_token,
      expires_at,
      id_token,
      token_type,
      is_social: !!is_social,
      roles: roles,
      mandateId: mandate, // Setting Mandate Id in the Session only for client
    })

    const sessionCache = SessionCache.getInstance().cache
    const session = sessionCache.fromTokenSet(tokenSet)

    sessionCache.create(req, res, session)
    if (roles.includes(REDIRECT_ROLE)) {
      res.status(200).json({ redirectTo: REDIRECT_CLIENT_TO })
    } else {
      res.status(200).json({ message: "Login Successfully" })
    }
  } catch (error) {
    res.status(500).end()
  }
}

export default withSentry(handler)
