import ky from "ky"
import { NextApiRequest, NextApiResponse } from "next"
import { TokenSet } from "openid-client"

import siteConfig from "~/config"
import { MyTfoClient } from "~/services/mytfo"
import { SessionCache } from "~/services/mytfo/helpers/sessionCache"
import { Preference, User } from "~/services/mytfo/types"
import getClientIp from "~/utils/getClientIp"
import { isMinimumProfileCompleted } from "~/utils/isMinimumProfileCompleted"

import { REDIRECT_CLIENT_TO, REDIRECT_ROLE } from "./constants/redirectPath"

export default async function callBackHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  lang: string,
) {
  const returnTo = req.query.returnTo as string
  const pathToRedirect = lang === "ar" ? "/ar" : "/"
  const [socialSignUp, socialSignUpUtm] =
    (req.query.state as string).split("||") || []
  try {
    const client = new MyTfoClient(req, res, {
      authRequired: false,
      overrideLanguage: lang,
    })

    const ipAddress = getClientIp(req) || ""
    const params = {
      redirectUrl:
        `${process.env.AUTH0_BASE_URL}/api/auth/callback-${lang}` || "",
      authCode: (req.query?.code as string) || "",
      termsOfService: {
        userAgent: req.headers["user-agent"] || "",
        agreedAt: new Date(),
        ipAddress,
      },
      language: lang,
      socialSignUp: socialSignUp || "",
      socialSignUpUtm: socialSignUpUtm || "",
    }
    const {
      accessToken: access_token,
      expiresIn: expires_at,
      idToken: id_token,
      tokenType: token_type,
      isSocial: is_social,
      roles: roles,
    } = await client.auth.getToken(params)

    // TokenSet requires the token props in snake_case.
    const tokenSet = new TokenSet({
      access_token,
      expires_at,
      id_token,
      token_type,
      is_social: !!is_social,
      roles: roles,
    })

    const sessionCache = SessionCache.getInstance().cache
    const session = sessionCache.fromTokenSet(tokenSet)

    sessionCache.create(req, res, session)

    const user = await ky
      .get(`${siteConfig.api.baseUrl}/user`, {
        headers: {
          Authorization: `Bearer ${tokenSet.access_token}`,
        },
      })
      .json<User>()

    let profileCompleted = true
    if (
      !user.profile ||
      (user?.profile && !isMinimumProfileCompleted(user.profile))
    ) {
      profileCompleted = false
    }

    //Social login user might have a different language than website language, by requirements' user must be redirected to preference language
    const userLanguage = await ky
      .get(`${siteConfig.api.baseUrl}/user/preference`, {
        headers: {
          Authorization: `Bearer ${tokenSet.access_token}`,
        },
      })
      .json<Preference>()

    const protoMatch = /^(https?|http|ftp|sftp):\/\//
    let returnToPath = profileCompleted
      ? returnTo
        ? returnTo
            .replace(protoMatch, "")
            .replace("www.", "")
            .replace("/ar/", "/")
        : ""
      : "/onboarding/profile"

    const prefPathToRedirect =
      userLanguage?.language?.toLocaleLowerCase() === "ar"
        ? "/ar" + returnToPath
        : "/" + returnToPath

    if (!is_social && roles.includes(REDIRECT_ROLE)) {
      res.status(200).redirect(REDIRECT_CLIENT_TO)
      return
    } else {
      res.status(200).redirect(prefPathToRedirect.replace(/\/+/, "/"))
    }
  } catch (error) {
    console.log("Error signing up with social logins:")
    console.error(JSON.stringify(error))
    if (pathToRedirect === "/ar") {
      res.status(500).redirect("/ar/login")
    } else {
      res.status(500).redirect("/login")
    }
  }
}
