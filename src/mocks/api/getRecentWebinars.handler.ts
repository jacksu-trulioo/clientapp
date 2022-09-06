import faker from "faker"
import { DefaultRequestBody, rest } from "msw"

import siteConfig from "~/config"
import { InsightType, PastWebinar } from "~/services/mytfo/types"

const {
  api: { baseUrl },
} = siteConfig

function handler() {
  return rest.get<DefaultRequestBody, PastWebinar>(
    `${baseUrl}/portfolio/insight/webinars/recent`,
    (req, res, ctx) => {
      let pastWebinars = {} as PastWebinar

      const createGuest = () => ({
        id: faker.datatype.uuid(),
        name: faker.name.firstName(),
        picture: "https://via.placeholder.com/150/1A1A1A99",
        title: faker.name.title(),
        type: faker.name.jobType(),
      })

      const createPastWebinar = () => ({
        // Not using faker for images because it uses placeimg.com, which has
        // inconsistent images, regardless of setting an image type.
        bannerImage: "https://via.placeholder.com/200/1A1A1A99",
        cardImage: "https://via.placeholder.com/200/1A1A1A99",
        description: faker.lorem.lines(2),
        estimationDuration: faker.random.arrayElement([
          "10 min",
          "20 min",
          "8 min",
        ]),
        id: faker.datatype.uuid(),
        insightType: faker.random.arrayElement(Object.values(InsightType)),
        publishDate: faker.date.future().toDateString(),
        title: faker.lorem.sentence(6, 2),
        video: faker.random.word(),
        guests: faker.datatype.array(1).map(createGuest),
      })

      pastWebinars = createPastWebinar()

      return res(ctx.json(pastWebinars))
    },
  )
}

export default handler()
