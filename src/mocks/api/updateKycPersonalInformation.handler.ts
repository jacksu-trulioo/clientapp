import { rest } from "msw"

import siteConfig from "~/config"
import { KycPersonalInformation } from "~/services/mytfo/types"

const {
  api: { baseUrl },
} = siteConfig

function handler() {
  return rest.put<KycPersonalInformation, KycPersonalInformation>(
    `${baseUrl}/user/kyc/personal-information`,
    (req, res, ctx) => {
      const payload = req.body
      return res(ctx.json(payload))
    },
  )
}

export default handler()
