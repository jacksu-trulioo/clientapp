import faker from "faker"
import { DefaultRequestBody, rest } from "msw"

import siteConfig from "~/config"
import { RelationshipManager } from "~/services/mytfo/types"

const {
  api: { baseUrl },
} = siteConfig

function handler() {
  return rest.get<DefaultRequestBody, RelationshipManager>(
    `${baseUrl}/user/relationship-manager`,
    (req, res, ctx) => {
      const relationshipManager = {
        assigned: faker.datatype.boolean(),
        manager: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
        },
      }

      return res(ctx.json(relationshipManager))
    },
  )
}

export default handler()
