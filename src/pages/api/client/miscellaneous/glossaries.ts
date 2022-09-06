import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import {
  GlossaryRes,
  sortGlossaryDataWithSingleAplhabet,
} from "~/services/mytfo/clientTypes"
import { sortDataWithSingleAplhabet } from "~/utils/clientUtils/glossaryData"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })

  const term = (req.query?.term as string) || ""

  if (req.method === "GET" && term) {
    if (term.includes("all")) {
      await getGlossariesData()
    } else if (!term.includes("all")) {
      await getGlossaryFilterData(term)
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getGlossariesData() {
    try {
      const glossariesData = await client?.clientMiscellaneous?.getGlossaries()
      const data = glossariesData as GlossaryRes
      const sortData = sortDataWithSingleAplhabet(data)
      return res.status(200).json(sortData)
    } catch (error) {
      if (error == "Validation Error") {
        res.status(501).json(error)
      }
      res.status(500).json(error)
    }
  }

  async function getGlossaryFilterData(glossTerm: string) {
    try {
      const glossariesData = await client?.clientMiscellaneous?.getGlossaries()
      const data = glossariesData as GlossaryRes
      const filterData = data.filter((item) =>
        item.term.toLocaleLowerCase().includes(glossTerm.toLocaleLowerCase()),
      )
      const sortData = sortDataWithSingleAplhabet(
        filterData,
      ) as sortGlossaryDataWithSingleAplhabet
      return res.status(200).json(sortData)
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
