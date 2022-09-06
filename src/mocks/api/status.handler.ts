import { DefaultRequestBody, rest } from "msw"

import siteConfig from "~/config"
import { UserQualificationStatus, UserStatuses } from "~/services/mytfo/types"

const {
  api: { baseUrl },
} = siteConfig

function handler() {
  return rest.get<DefaultRequestBody, UserStatuses>(
    `${baseUrl}/user/status`,
    (req, res, ctx) => {
      const statuses = {
        status: UserQualificationStatus.Verified,
      }

      return res(ctx.json(statuses))
    },
  )
}

export default handler()
