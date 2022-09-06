import { handleLogout } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import Cookies from "cookies"
import { NextApiRequest, NextApiResponse } from "next"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const lang = (req.query?.lang as string) || ""
    const path = lang && lang == "ar" ? "/ar" : ""
    const cookies = new Cookies(req, res)
    cookies.set("phoneNumberVerified")
    await handleLogout(req, res, { returnTo: path + "/login" })
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}
export default withSentry(handler)
