import { DefaultRequestBody, rest } from "msw"

import siteConfig from "~/config"
import { ProposalsStatus } from "~/services/mytfo/types"

const {
  api: { baseUrl },
} = siteConfig

function handler() {
  return rest.get<DefaultRequestBody, ProposalsStatus>(
    `${baseUrl}/user/proposals/status`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          status: "Accepted",
          modifiedByRm: true,
        }),
      )
    },
  )
}

export default handler()
