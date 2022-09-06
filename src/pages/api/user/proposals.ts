import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { StrategiesTabularData, StrategiesType } from "~/services/mytfo/types"

import { MyTfoClient } from "../../../services/mytfo"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  if (req.method === "GET") {
    await getProposals()
  } else if (req.method === "POST") {
    await postProposal()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getProposals() {
    const response = await client.user.getProposals()

    let transformedStrategiesData: StrategiesTabularData[] = []

    const strategiesType = [
      "capitalGrowth",
      "capitalYielding",
      "opportunistic",
      "absoluteReturn",
    ] as StrategiesType[]

    const getYearsSum = () => {
      let result: number[] = []
      transformedStrategiesData.forEach((item) => {
        item?.years?.forEach((year: number, index: number) => {
          result[index] =
            result[index] === undefined ? year : result[index] + year
        })
      })
      return result
    }

    response?.forEach((item) => {
      transformedStrategiesData = strategiesType.map((key: StrategiesType) => {
        return {
          years: item?.strategies[key]?.deploymentYears,
          totalAmount: item?.strategies[key]?.deploymentYears?.reduce(
            (a, b) => a + b,
            0,
          ),
          percentageAllocation: item?.strategies[key]?.percentageAllocation,
          name: key,
        }
      })

      const totalData = {
        name: "total",
        totalAmount: transformedStrategiesData?.reduce(
          (a, b) => a + b?.totalAmount,
          0,
        ),
        percentageAllocation: transformedStrategiesData?.reduce(
          (a, b) => a + b?.percentageAllocation,
          0,
        ),
        years: getYearsSum(),
      }
      const strategiesData = [...transformedStrategiesData, totalData]
      item.transformedStrategiesData = strategiesData
    })

    if (
      response.length > 1 &&
      (response[0].type === "Growth" || response[0].type === "LongTerm")
    ) {
      response.unshift(response[1])
      response.splice(2, 1)
    }

    res.status(200).json(response)
  }

  async function postProposal() {
    const proposal = await client.user.postProposal()

    res.status(201).json(proposal)
  }
}

export default withSentry(withApiAuthRequired(handler))
