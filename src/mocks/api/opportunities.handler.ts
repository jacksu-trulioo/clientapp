import faker from "faker"
import { DefaultRequestBody, rest } from "msw"

import siteConfig from "~/config"
import {
  OpportunitiesResponse,
  UserQualificationStatus,
} from "~/services/mytfo/types"

const {
  api: { baseUrl },
} = siteConfig

function handler() {
  return rest.get<DefaultRequestBody, OpportunitiesResponse>(
    `${baseUrl}/portfolio/opportunities`,
    (req, res, ctx) => {
      const opportunities = {} as OpportunitiesResponse

      const createOpportunity = () => ({
        title: faker.company.companyName(),
        country: faker.address.countryCode(),
        sector: faker.random.word(),
        component: faker.random.word(),
        assetClass: faker.random.word(),
        document: faker.image.imageUrl(),
        // Not using faker for images because it uses placeimg.com, which has
        // inconsistent images, regardless of setting an image type.
        image: "https://via.placeholder.com/200/1A1A1A99",
        isShariahCompliant: faker.datatype.boolean(),
        description: faker.lorem.words(100),
        sponsor: faker.company.companyName(),
        expectedExit: faker.date.future().getFullYear().toString(),
        expectedReturn: faker.lorem.word(20),
        id: faker.datatype.uuid(),
        isOpportunityClosed: faker.datatype.boolean(),
      })

      opportunities.status = faker.random.arrayElement(
        Object.values(UserQualificationStatus),
      )

      opportunities.opportunities = faker.datatype
        .array(6)
        .map(createOpportunity)

      return res(ctx.json(opportunities))
    },
  )
}

export default handler()
