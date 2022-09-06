import faker from "faker"
import { DefaultRequestBody, rest } from "msw"

import siteConfig from "~/config"
import { QualificationStatus } from "~/services/mytfo/types"

const {
  api: { baseUrl },
} = siteConfig

function handler() {
  return rest.get<DefaultRequestBody, QualificationStatus>(
    `${baseUrl}/user/qualifications/status`,
    (req, res, ctx) => {
      const qualificationsStatus = {
        investorProfile: true,
        investmentGoals: faker.datatype.boolean(),
        riskAssessment: false,
      }

      return res(ctx.json(qualificationsStatus))
    },
  )
}

export default handler()
