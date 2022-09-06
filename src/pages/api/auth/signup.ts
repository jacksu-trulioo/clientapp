import { withSentry } from "@sentry/nextjs"
import { NextApiRequest, NextApiResponse } from "next"
import { TokenSet } from "openid-client"

import { MyTfoClient } from "~/services/mytfo"
import { SessionCache } from "~/services/mytfo/helpers/sessionCache"
import { decryptBody } from "~/utils/encryption"
import getClientIp from "~/utils/getClientIp"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = new MyTfoClient(req, res, { authRequired: false })
    const ipAddress = getClientIp(req)
    const body = decryptBody(req)
    if (!body) {
      res.status(401).end()
      return
    }
    const params = {
      ...body,
      termsOfService: {
        userAgent: req.headers["user-agent"],
        agreedAt: new Date(),
        ipAddress,
      },
    }
    const {
      accessToken: access_token,
      expiresIn: expires_at,
      idToken: id_token,
      tokenType: token_type,
      isSocial: is_social,
      roles: roles,
    } = await client.auth.signup(params)

    // TokenSet requires the token props in snake_case.
    const tokenSet = new TokenSet({
      access_token,
      expires_at,
      id_token,
      token_type,
      roles: roles,
      is_social: !!is_social,
    })

    const sessionCache = SessionCache.getInstance().cache
    const session = sessionCache.fromTokenSet(tokenSet)

    sessionCache.create(req, res, session)
    let result = {
      message: "Signup success",
      success: true,
    }
    res.status(200).end(JSON.stringify(result))
  } catch (error) {
    console.log("Error signing up:")
    console.error(JSON.stringify(error))
    res.status(500)
  }
}
export default withSentry(handler)
