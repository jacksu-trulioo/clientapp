import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { withSentry } from "@sentry/nextjs"
import type { NextApiRequest, NextApiResponse } from "next"

import { MyTfoClient } from "~/services/mytfo"
import { Insights } from "~/services/mytfo/clientTypes"
import { errorHandler } from "~/utils/errorHandler"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MyTfoClient(req, res)

  const lang = (req.query?.langCode as string) || "en"
  const id = req.query?.id as string

  if (req.method === "GET") {
    await getInsightDetails()
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getInsightDetails() {
    try {
      const response = await client.clientInsights.getClientInsightDetails({
        id,
        lang,
      })
      if (response.story) {
        let story: Insights = response.story
        let disclaimer = story.content.Disclaimer as string

        const regex = new RegExp(
          /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
        )

        const disclaimerRes = regex.test(disclaimer)
          ? await client.clientInsights.getDisclaimerContent({
              disclaimer,
              lang,
            })
          : ""

        let guestsArr = []

        if (story.content.Guests) {
          for (const guest of story.content.Guests) {
            const guestRes = await client.clientInsights.getWebinarGuestList({
              guest,
              lang,
            })

            const guestContent = guestRes.story.content

            let obj = {
              title: guestContent.Title,
              name: guestContent.Name,
              type: guestContent.Type,
              picture: guestContent.Picture.filename,
            }

            guestsArr.push(obj)
          }
        }

        res.status(200).json({
          details: story.content.Details,
          disclaimer: regex.test(disclaimer)
            ? disclaimerRes.story.content.Content
            : disclaimer,
          contents: story?.content?.client_app_content?.map((y) => {
            return {
              title: y.Title,
              description: y.Description,
            }
          }),
          insightType: "Article",
          id: story.id,
          title: story.content.Title,
          cardImage:
            story.content.CardImage?.filename ||
            story.content?.PosterImage?.filename,
          bannerImage: story.content.BannerImage.filename,
          description: story.content.Description,
          publishDate: story.content.PublishDate,
          orderingSequence: story.content.OrderingSequence,
          estimatedDuration: story.content.EstimatedDuration,
          guests: guestsArr,
          video: story?.content?.Video?.url || story?.content?.VideoURL,
          downloadLink: story?.content?.DownloadLink?.url,
        })
      } else {
        res.status(404).json({ message: "Story Not Found" })
      }
    } catch (error) {
      let errorrResponse = await errorHandler(error)
      res.status(errorrResponse?.statusCode || 500).json(errorrResponse)
    }
  }
}
export default withSentry(withApiAuthRequired(handler))
