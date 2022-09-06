import faker from "faker"
import { DefaultRequestBody, rest } from "msw"

import siteConfig from "~/config"
import { SampleDeals } from "~/services/mytfo/types"

const {
  api: { baseUrl },
} = siteConfig

function handler() {
  return rest.get<DefaultRequestBody, SampleDeals>(
    `${baseUrl}/portfolio/simulator/sample-deals`,
    (req, res, ctx) => {
      const sampleDeals = {} as SampleDeals

      const allocationCategories = [
        "capitalYielding",
        "opportunistic",
        "capitalGrowth",
        "absoluteReturn",
      ] as const

      const createSampleDeal = () => ({
        title: faker.company.companyName(),
        country: faker.address.countryCode(),
        sector: faker.random.word(),
        component: faker.random.word(),
        assetClass: faker.random.word(),
        // Not using faker for images because it uses placeimg.com, which has
        // inconsistent images, regardless of setting an image type.
        image: "https://via.placeholder.com/70/81/1A1A1A99",
        isShariahCompliant: faker.datatype.boolean(),
      })

      allocationCategories.forEach((category) => {
        sampleDeals[category] = faker.datatype.array(4).map(createSampleDeal)
      })

      return res(ctx.json(sampleDeals))
    },
  )
}

export default handler()
