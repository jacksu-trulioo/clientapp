import faker from "faker"
import { DefaultRequestBody, rest } from "msw"

import siteConfig from "~/config"
import { Insight, InsightType } from "~/services/mytfo/types"

const {
  api: { baseUrl },
} = siteConfig

function handler() {
  return rest.get<DefaultRequestBody, Insight[]>(
    `${baseUrl}/portfolio/insight/top`,
    (req, res, ctx) => {
      let insights = [] as Insight[]

      const createInsight = () => ({
        // Not using faker for images because it uses placeimg.com, which has
        // inconsistent images, regardless of setting an image type.
        bannerImage: "https://via.placeholder.com/200/1A1A1A99",
        cardImage: "https://via.placeholder.com/200/1A1A1A99",
        description: faker.lorem.lines(2),
        estimatedDuration: faker.random.arrayElement([
          "10 min",
          "20 min",
          "8 min",
        ]),
        id: faker.datatype.uuid(),
        insightType: faker.random.arrayElement(Object.values(InsightType)),
        publishDate: faker.date.future().toDateString(),
        title: faker.lorem.sentence(6, 2),
      })

      insights = faker.datatype.array(3).map(createInsight)

      return res(ctx.json(insights))
    },
  )
}

export default handler()
