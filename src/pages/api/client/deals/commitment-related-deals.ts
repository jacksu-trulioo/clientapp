import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { CommitmentRelatedDeals } from "~/services/mytfo/types"
import {
  GetSortOrderAsc,
  GetSortOrderDesc,
  groupCommitmentRelatedDeals,
} from "~/utils/clientUtils/commitmentUtilities"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const spvId = req.query.spvId as string

  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
    additionalHeader: [
      {
        key: "spvId",
        value: spvId,
      },
    ],
  })

  if (req.method === "POST") {
    await getCommitmentRelatedDeals()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getCommitmentRelatedDeals() {
    try {
      const { sortBy, orderBy, filterKeys, filterValues } = req.body

      const commitmentRelatedDeals =
        (await client.clientDeals.getCommitmentRelatedDeals()) as CommitmentRelatedDeals

      const dealsResult = await groupCommitmentRelatedDeals(
        commitmentRelatedDeals,
        sortBy,
        orderBy,
        filterKeys,
        filterValues,
      )

      for (const element of dealsResult) {
        for (const element1 of element.deals) {
          element1.investments.sort(
            orderBy == "asc"
              ? GetSortOrderAsc("name")
              : GetSortOrderDesc("name"),
          )
        }
      }

      const finalResponse = {
        groupByDeals: dealsResult,
      }

      res.status(200).json(finalResponse)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
