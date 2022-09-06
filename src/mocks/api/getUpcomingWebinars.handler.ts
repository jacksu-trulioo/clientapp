import faker from "faker"
import { DefaultRequestBody, rest } from "msw"

import siteConfig from "~/config"
import { UpcomingWebinar } from "~/services/mytfo/types"

const {
  api: { baseUrl },
} = siteConfig

function handler() {
  return rest.get<DefaultRequestBody, UpcomingWebinar[]>(
    `${baseUrl}/portfolio/webinars/upcomings`,
    (req, res, ctx) => {
      let upcomingWebinars = [] as UpcomingWebinar[]

      const createGuest = () => ({
        id: faker.datatype.uuid(),
        name: faker.name.firstName(),
        picture: "https://via.placeholder.com/150/1A1A1A99",
        title: faker.name.title(),
        type: faker.name.jobType(),
      })

      const createUpcomingWebinar = () => ({
        id: faker.datatype.uuid(),
        title: faker.lorem.sentence(6, 2),
        date: faker.date.future().toDateString(),
        timeZone: faker.date.future().toDateString(),
        language: faker.locale.toString(),
        guests: faker.datatype.array(1).map(createGuest),
      })

      upcomingWebinars = faker.datatype.array(1).map(createUpcomingWebinar)

      return res(ctx.json(upcomingWebinars))
    },
  )
}

export default handler()
