import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { KycUploadDocumentsRequest } from "~/services/mytfo/types"
import { uploadKycFiles } from "~/utils/kycBlobStorageService"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await uploadDocument(req.body)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function uploadDocument(params: KycUploadDocumentsRequest) {
    try {
      const response = await uploadKycFiles(
        params.userIdentity,
        params.documents,
      )
      res.status(200).json(response)
    } catch (error) {
      console.log(error)
      res.status(500)
    }
  }
}

export default withSentry(withApiAuthRequired(handler))
