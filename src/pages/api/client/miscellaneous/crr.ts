import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { errorHandler } from "~/utils/errorHandler"

type CRRType = {
  nonAA: boolean
  finalData: {
    targetAssetAllocation: []
    assetAllocationOverYears: []
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
    additionalHeader: [
      {
        key: "ask",
        value: "crrdata",
      },
    ],
  })

  if (req.method === "GET") {
    await getCrr()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getCrr() {
    try {
      const crrResponse = await client?.clientMiscellaneous?.crrAsset()
      const data = crrResponse as CRRType
      let finalRes = {
        nonAA: true,
        targetAssetAllocation: [],
        assetAllocationOverYears: [],
      }

      if (data?.nonAA) {
        finalRes.nonAA = data.nonAA
        res.status(200).json(finalRes)
      } else {
        finalRes.targetAssetAllocation = data?.finalData.targetAssetAllocation
        finalRes.assetAllocationOverYears =
          data?.finalData.assetAllocationOverYears
        res.status(200).json(finalRes)
      }
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
