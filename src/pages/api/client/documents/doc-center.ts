import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import moment from "moment"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import {
  DocCenterList,
  DocCenterParams,
  DownloadDealSheetRes,
  DownloadDocs,
  MultipleDocsDownloadParams,
  ReportAndVideoList,
} from "~/services/mytfo/types"
import { getDocsWithPagination } from "~/utils/clientUtils/getDocsWithPagination"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res, {
    authRequired: true,
    msType: "maverick",
  })

  const max = req.query.max as string
  const offset = req.query.offset as string

  if (req.method === "POST") {
    await getDocumentDetails()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getDocumentDetails() {
    try {
      const params = req.body as DocCenterParams | MultipleDocsDownloadParams
      const docDetails = (await client.clientDocumentCenter.getDocumentDetails(
        params,
      )) as
        | DocCenterList
        | ReportAndVideoList
        | DownloadDealSheetRes
        | DownloadDocs

      if (params.action === "list of files") {
        let data = docDetails
        let reportDocs = data as ReportAndVideoList

        let paginationData = (await getDocsWithPagination(
          reportDocs,
          max,
          offset,
        )) as ReportAndVideoList

        paginationData.data.forEach((docsData) => {
          let splitStr = docsData.size.split(" ")

          let removeDecimal = Math.trunc(parseInt(splitStr[0]))

          let fileSize = String(removeDecimal).concat(splitStr[1].toLowerCase())

          docsData.size = fileSize

          if (docsData.contentType === "video/mp4") {
            docsData.length = moment(`${docsData.length}`, "mm:ss").format(
              "mm:ss",
            )
          }
        })
        res.status(200).json(paginationData)
      } else {
        res.status(200).json(docDetails)
      }
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
