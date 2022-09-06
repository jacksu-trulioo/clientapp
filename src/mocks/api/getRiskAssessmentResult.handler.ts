import faker from "faker"
import { DefaultRequestBody, rest } from "msw"

import siteConfig from "~/config"
import {
  RiskAssessmentScore,
  RiskScoreDescription,
  RiskScoreDescriptionId,
} from "~/services/mytfo/types"

const {
  api: { baseUrl },
} = siteConfig

function handler() {
  return rest.get<DefaultRequestBody, RiskAssessmentScore>(
    `${baseUrl}/user/risk-assessment/result`,
    (req, res, ctx) => {
      const riskAssessmentScore = {
        data: {
          rawRiskScore: faker.datatype.number(),
          rawResponsivenessScore: faker.datatype.number(),
          adjustedScore: faker.datatype.number(),
          scoreDescription: faker.random.arrayElement(
            Object.values(RiskScoreDescription),
          ),
          scoreDescriptionId: faker.random.arrayElement(
            Object.values(RiskScoreDescriptionId),
          ),
          riskScore: faker.datatype.number(),
        },
        message: faker.random.word(),
        status: faker.random.word(),
      }

      return res(ctx.json(riskAssessmentScore))
    },
  )
}

export default handler()
