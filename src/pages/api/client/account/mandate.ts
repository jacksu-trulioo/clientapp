import { getSession } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { errorHandler } from "~/utils/errorHandler"

type MandateProps = {
  mandateIds: string[]
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "POST") {
    try {
      const session = getSession(req, res)
      if (session) {
        session.mandateId = req.body.mandateId
      }
      res.status(200).json({ message: "Changed Successfully" })
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  } else if (req.method == "GET") {
    try {
      const client = new MyTfoClient(req, res, {
        authRequired: true,
        msType: "maverick",
      })
      const mandates = await client.clientAccount.mandateAuthenticator()

      mandates.sort((a, b) => {
        return Number(a?.mandateId) - Number(b?.mandateId)
      })

      let mandateIds: MandateProps["mandateIds"] = []
      mandates.forEach((val) => {
        return mandateIds.push(val.mandateId)
      })

      let uniqueMandateIds

      if (mandateIds != undefined) {
        uniqueMandateIds = mandateIds.filter(
          (a, i) => mandateIds.findIndex((s) => a === s) === i,
        )
      }
      res.status(200).json({ uniqueMandateIds })
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withSentry(handler)
