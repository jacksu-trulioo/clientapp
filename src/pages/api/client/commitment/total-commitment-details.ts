import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { Commitment, TotalCommitments } from "~/services/mytfo/types"
import { errorHandler } from "~/utils/errorHandler"
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })
  if (req.method === "POST") {
    await getTotalCommitmentDetails()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  async function getTotalCommitmentDetails() {
    try {
      const { filterValues, sortBy, orderBy } = req.body
      const response =
        (await client.clientCommitment.getTotalCommitmentDetails()) as TotalCommitments
      let lastValuationDate = response.timeperiod.toDate
      let totalCommitted = response.totalCommitted
      let totalUncalled = response.totalUncalled
      let commitments: Commitment[] = response.commitments
      let filteredCommitments = await filterByDeployedPercCommitment(
        commitments,
        filterValues,
      )
      let sortedCommitments: Commitment[] = []
      if (orderBy == "asc") {
        sortedCommitments = [...filteredCommitments].sort(
          (a: Commitment, b: Commitment) => {
            if (a[sortBy as keyof Commitment] > b[sortBy as keyof Commitment])
              return 1
            else if (
              b[sortBy as keyof Commitment] > a[sortBy as keyof Commitment]
            )
              return -1
            else return 0
          },
        )
      } else {
        sortedCommitments = [...filteredCommitments].sort((a, b) => {
          if (a[sortBy as keyof Commitment] < b[sortBy as keyof Commitment])
            return 1
          else if (
            b[sortBy as keyof Commitment] < a[sortBy as keyof Commitment]
          )
            return -1
          else return 0
        })
      }

      const commitmentDetailsResponse = {
        lastValuationDate: lastValuationDate,
        totalCommitted: totalCommitted,
        totalUncalled: totalUncalled,
        commitments: sortedCommitments,
      }
      res.status(200).json(commitmentDetailsResponse)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
  async function filterByDeployedPercCommitment(
    data: Commitment[],
    filterValues: string[],
  ) {
    let min = 0
    let max = 100
    let filteredData: Commitment[] = []
    filterValues.forEach((item) => {
      if (item.includes("-")) {
        min = parseInt(item.split("-")[0])
        max = parseInt(item.split("-")[1])
      } else {
        min = max = parseInt(item)
      }
      const result = data.filter(function (e: Commitment) {
        return e.deployed >= min && e.deployed <= max
      })
      result.forEach(function (elem) {
        filteredData.push(elem)
      })
    })
    return filteredData
  }
}
export default withSentry(withApiAuthRequired(handler))
